package com.restroly.qrmenu.auth.service;

import com.google.auth.oauth2.TokenVerifier;
import com.google.api.client.json.webtoken.JsonWebSignature;
import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.GoogleAuthRequest;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.security.JwtTokenProvider;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for handling Google OAuth 2.0 authentication.
 * Verifies Google ID tokens, creates/updates user records, and issues JWT tokens.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${google.oauth.client-id}")
    private String googleClientId;

    /**
     * Authenticates user via Google OAuth token.
     * 1. Verifies the Google ID token
     * 2. Extracts user info (email, name, picture)
     * 3. Creates or updates user in database
     * 4. Assigns default roles (CUSTOMER role for new users)
     * 5. Issues JWT access & refresh tokens
     *
     * @param googleAuthRequest Contains Google ID token
     * @return AuthResponse with JWT tokens and user info
     * @throws BusinessException if token is invalid or verification fails
     */
    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest googleAuthRequest) {
        String idToken = googleAuthRequest.getToken();

        if (idToken == null || idToken.isBlank()) {
            throw new BusinessException("Google token is missing");
        }
        
        log.info("Google OAuth authentication initiated");

        JsonWebSignature jws = verifyGoogleToken(idToken);
        JsonWebSignature.Payload payload = jws.getPayload();

        String googleSub = (String) payload.get("sub");
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        if (email == null || email.isEmpty()) {
            log.error("Google token missing email claim");
            throw new BusinessException("Google token does not contain email. Cannot proceed with authentication.");
        }

        final String finalName = (name == null || name.isEmpty()) ? email.split("@")[0] : name;

        log.debug("Google token verified for email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    if (existingUser.getGoogleSub() == null) {
                        existingUser.setGoogleSub(googleSub);
                        existingUser.setAuthProvider("GOOGLE");
                        log.info("Updated existing user {} with Google OAuth", email);
                    }
                    
                    // Only download Google image if they don't already have a profile image
                    if ((existingUser.getUserProfile() == null || existingUser.getUserProfile().length == 0) && pictureUrl != null) {
                        byte[] imageBytes = downloadProfileImage(pictureUrl);
                        existingUser.setUserProfile(imageBytes);
                    }
                    
                    existingUser.setIsActive(true);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .name(finalName)
                            .googleSub(googleSub)
                            .authProvider("GOOGLE")
                            .userProfile(downloadProfileImage(pictureUrl))
                            .isActive(true)
                            .isLocked(false)
                            .password("") 
                            .build();

                    Role customerRole = roleRepository.findByName("CUSTOMER")
                            .orElseThrow(() -> new BusinessException("CUSTOMER role not found in database. Please ensure roles are initialized."));

                    newUser.setRoles(Collections.singletonList(customerRole));

                    User savedUser = userRepository.save(newUser);
                    log.info("Created new user from Google OAuth: {}", email);
                    return savedUser;
                });

        UserDetails userDetails = buildUserDetailsFromGoogleUser(user);

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        log.info("Google OAuth authentication successful for user: {}", email);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                .username(user.getEmail())
                .roles(roles)
                .build();
    }

    /**
     * Downloads the profile image from Google's servers.
     * Wrapped in a try-catch to ensure login succeeds even if the image download fails.
     */
    private byte[] downloadProfileImage(String pictureUrl) {
        if (pictureUrl == null || pictureUrl.isEmpty()) {
            return null;
        }
        try {
            return restTemplate.getForObject(pictureUrl, byte[].class);
        } catch (Exception ex) {
            log.warn("Failed to download Google profile image from {}: {}", pictureUrl, ex.getMessage());
            return null; // Return null so login can proceed without the image
        }
    }

    /**
     * Verifies Google ID token signature and claims using Google's TokenVerifier.
     * Validates that the token is issued by Google and matches the expected audience (clientId).
     *
     * @param idToken Google ID token from frontend
     * @return TokenVerifier instance for claim extraction
     * @throws BusinessException if token is invalid, expired, or signature verification fails
     */
    private JsonWebSignature verifyGoogleToken(String idToken) {
        System.out.println("GOOGLE CLIENT ID => " + googleClientId);
        try {
            TokenVerifier verifier = TokenVerifier.newBuilder()
                    .setAudience(googleClientId)
                    .build();

            JsonWebSignature jws = verifier.verify(idToken);
            
            log.debug("Google token signature verified successfully");
            return jws;

        } catch (Exception ex) {
            log.error("Failed to verify Google token", ex);
            throw new BusinessException("Invalid Google token: " + ex.getMessage());
        }
    }

    /**
     * Builds a Spring Security UserDetails from Google OAuth user.
     * Used for JWT token generation.
     *
     * @param user User entity from database
     * @return UserDetails with email as username and user's roles as authorities
     */
    private UserDetails buildUserDetailsFromGoogleUser(User user) {
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isActive(),
                true,
                true,
                !user.isLocked(),
                authorities
        );
    }
}
