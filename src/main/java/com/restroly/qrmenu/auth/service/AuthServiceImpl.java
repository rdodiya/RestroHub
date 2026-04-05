package com.restroly.qrmenu.auth.service;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.LoginRequest;
import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
import com.restroly.qrmenu.common.exception.BusinessException;
import com.restroly.qrmenu.security.JwtTokenProvider;
import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.TokenType;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserToken;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import com.restroly.qrmenu.user.repository.UserTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    private final UserRepository userRepository;
    private final UserTokenRepository tokenRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private static final String REFRESH_COOKIE_NAME = "refreshToken";


    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${security.jwt.access-expiration:900000}")
    private long accessTokenExpirationMs;

    @Value("${security.jwt.refresh-expiration:604800000}")
    private long refreshTokenExpirationMs;

    @Override
    public AuthResponse login(LoginRequest loginRequest,HttpServletResponse response) {
        log.info("Login attempt for user: {}", loginRequest.getUsername());

        try {
            // 1. Authenticate via Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 2. Load user entity from DB
            User user = userRepository.findByEmail(loginRequest.getUsername())
                    .orElseThrow(() -> new BusinessException("User not found"));

            if (!user.isActive()) {
                throw new BusinessException("Account is deactivated");
            }

            // 3. Revoke all existing valid tokens for this user
            tokenRepository.revokeAllTokensByUser(user.getUserId());

            // 4. Generate new token pair
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

            // 5. Persist both tokens in t_rel_usr_token
            saveToken(user, accessToken, TokenType.ACCESS, accessTokenExpirationMs);
            saveToken(user, refreshToken, TokenType.REFRESH, refreshTokenExpirationMs);

            // 6. Set refresh token as HTTP-only cookie
            addRefreshTokenCookie(response, refreshToken);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            log.info("User {} logged in successfully", loginRequest.getUsername());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                    .username(userDetails.getUsername())
                    .roles(roles)
                    .build();

        } catch (BadCredentialsException ex) {
            log.warn("Failed login attempt for user: {}",
                    loginRequest.getUsername());
            throw new BadCredentialsException("Invalid username or password");

        } catch (AuthenticationException ex) {
            log.error("Authentication error for user {}: {}",
                    loginRequest.getUsername(), ex.getMessage());
            throw new BusinessException(
                    "Authentication failed: " + ex.getMessage());
        }
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        log.debug("Refresh token request received");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Invalid or expired refresh token");
        }

        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new BusinessException("Token is not a refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        log.info("Token refreshed for user: {}", username);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                .username(username)
                .roles(roles)
                .build();
    }

    @Override
    public void logout(String username, HttpServletResponse response) {
        // In a production system, you would typically:
        // 1. Add the token to a blacklist (Redis cache)
        // 2. Remove from any session store
        // For now, we just clear the security context
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        // Revoke all tokens in DB
        tokenRepository.revokeAllTokensByUser(user.getUserId());

        // Clear the refresh token cookie
        clearRefreshTokenCookie(response);

        // Clear security context
        SecurityContextHolder.clearContext();

        log.info("User {} logged out — all tokens revoked", username);

    }

    /**
     * @param request
     * @param response
     * @return
     */
    @Override
    public AuthResponse register(UserRequest request, HttpServletResponse response) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        // 2. Find default USER role
        //    Adjust "USER" to match your actual role name in t_mst_role
        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() ->
                        new BusinessException("Default USER role not found. "
                                + "Seed the database first."));

        // 3. Create and save user
        User user = User.builder()
                .name(request.getFirstName() + " " + request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhone())
                .isActive(true)
                .isLocked(false)
                .roles(List.of(defaultRole))
                .build();

        user = userRepository.save(user);

        // 4. Load UserDetails for token generation
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        // 5. Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        // 6. Persist tokens in t_rel_usr_token
        saveToken(user, accessToken, TokenType.ACCESS, accessTokenExpirationMs);
        saveToken(user, refreshToken, TokenType.REFRESH, refreshTokenExpirationMs);

        // 7. Set refresh token as HTTP-only cookie
        addRefreshTokenCookie(response, refreshToken);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        log.info("User {} registered successfully", request.getEmail());

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
     * @param username
     * @return
     */
    @Override
    public UserResponse verifyToken(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        return UserResponse.builder()
                .id(user.getUserId())
                .firstName(extractFirstName(user.getName()))
                .lastName(extractLastName(user.getName()))
                .fullName(user.getName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedDate())
                .build();
    }

    /**
     * Persist a token row in t_rel_usr_token
     */
    private void saveToken(User user, String jwt,
                           TokenType type, long expirationMs) {

        UserToken token = UserToken.builder()
                .token(jwt)
                .tokenType(type)
                .revoked(false)
                .expired(false)
                .user(user)
                .expiresAt(LocalDateTime.now()
                        .plusSeconds(expirationMs / 1000))
                .build();

        tokenRepository.save(token);
    }

    /**
     * Write the refresh token into an HTTP-only, SameSite=Strict cookie.
     * Path is scoped to /api/auth so the cookie is only sent
     * to auth endpoints (login, refresh, logout).
     */
    private void addRefreshTokenCookie(HttpServletResponse response,
                                       String refreshToken) {
        int maxAge = (int) (refreshTokenExpirationMs / 1000);

        String cookieHeader = String.format(
                "%s=%s; Path=/api/auth; Max-Age=%d; HttpOnly; %sSameSite=Strict",
                REFRESH_COOKIE_NAME,
                refreshToken,
                maxAge,
                cookieSecure ? "Secure; " : ""
        );

        response.addHeader("Set-Cookie", cookieHeader);
    }

    /**
     * Clear the refresh token cookie by setting Max-Age=0
     */
    private void clearRefreshTokenCookie(HttpServletResponse response) {
        String cookieHeader = String.format(
                "%s=; Path=/api/auth; Max-Age=0; HttpOnly; %sSameSite=Strict",
                REFRESH_COOKIE_NAME,
                cookieSecure ? "Secure; " : ""
        );

        response.addHeader("Set-Cookie", cookieHeader);
    }

    /**
     * Read the refresh token from the incoming request cookies
     */
    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_COOKIE_NAME.equals(c.getName()))
                .map(jakarta.servlet.http.Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private String extractFirstName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "";
        String[] parts = fullName.trim().split("\\s+", 2);
        return parts[0];
    }

    private String extractLastName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "";
        String[] parts = fullName.trim().split("\\s+", 2);
        return parts.length > 1 ? parts[1] : "";
    }
}