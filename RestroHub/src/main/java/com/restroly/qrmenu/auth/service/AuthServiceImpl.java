package com.restroly.qrmenu.auth.service;

import com.restroly.qrmenu.auth.dto.*;
import com.restroly.qrmenu.auth.entity.PasswordResetToken;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.restaurant.service.RestaurantService;
import com.restroly.qrmenu.security.JwtTokenProvider;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.exception.DuplicateResourceException;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.repository.UserRepository;
import com.restroly.qrmenu.user.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final RestaurantService restaurantService;
    private final com.restroly.qrmenu.auth.repository.PasswordResetTokenRepository passwordResetTokenRepository;
    private final com.restroly.qrmenu.notification.service.EmailService emailService;

    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

            List<String> roles = userRepository.findByEmailWithUserRoleRestaurants(userDetails.getUsername()).
                    get().getUserRoleRestaurants().stream().map(UserRoleRestaurant::getRole)
                    .map(Role::getName).distinct().collect(Collectors.toList());

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
            log.warn("Failed login attempt for user: {}", loginRequest.getUsername());
            throw new BadCredentialsException("Invalid username or password");
        } catch (AuthenticationException ex) {
            log.error("Authentication error for user {}: {}", loginRequest.getUsername(), ex.getMessage());
            throw new BusinessException("Authentication failed: " + ex.getMessage());
        }
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        log.debug("Refresh token request received");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("Invalid or expired refresh token");
            throw new BusinessException("Invalid or expired refresh token");
        }

        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            log.warn("Provided token is not a refresh token");
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
    public void logout(String token) {
        SecurityContextHolder.clearContext();
        log.info("User logged out successfully");
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User already exists with this email");
        }

        User user = User.builder()
                .name(registerRequest.getFirstName() + " " + registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .isActive(true)
                .isLocked(false)
                .authProvider("LOCAL")
                .build();

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Default CUSTOMER role not found"));

        UserRoleRestaurant userRoleRestaurant = UserRoleRestaurant.builder()
                .role(customerRole)
                .user(user)
                .restaurant(
                        restaurantService.getRestaurantByNameEntity(
                                registerRequest.getRestaurantName()
                        )
                )
                .build();
        if (user.getUserRoleRestaurants() == null) {
            user.setUserRoleRestaurants(new HashSet<>());
        }

        user.getUserRoleRestaurants().add(userRoleRestaurant);
        userRepository.save(user);

        return AuthResponse.builder()
                .username(user.getEmail())
                .build();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Map<String, Object> forgotPassword(String email) {
        if (email == null || email.isBlank()) {
            throw new BusinessException("Email is required");
        }

        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BusinessException("No account found with email: " + normalizedEmail));

        // Invalidate any previously generated uncompleted tokens for this user
        passwordResetTokenRepository.invalidateAllTokensForUser(user);

        // Generate cryptographically secure 6-digit numeric OTP
        String otpCode = String.format("%06d", new java.security.SecureRandom().nextInt(900000) + 100000);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .otpCode(otpCode)
                .token(otpCode)
                .expiryDate(java.time.LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .isOtpVerified(false)
                .isResetCompleted(false)
                .failedAttempts(0)
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Send email with OTP code
        emailService.sendPasswordResetOtp(user.getEmail(), otpCode, OTP_EXPIRY_MINUTES);

        log.info("Password reset OTP generated and dispatched for user [{}]", normalizedEmail);

        // Do NOT expose OTP code in response body for security
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Verification code sent to your email.");
        result.put("email", normalizedEmail);
        result.put("expiryMinutes", OTP_EXPIRY_MINUTES);
        return result;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Map<String, Object> verifyResetCode(VerifyResetCodeRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BusinessException("Email is required");
        }
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new BusinessException("Verification code is required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String enteredCode = request.getCode().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BusinessException("No account found with email: " + normalizedEmail));

        PasswordResetToken tokenRecord = passwordResetTokenRepository
                .findTopByUser_EmailAndIsOtpVerifiedFalseAndIsResetCompletedFalseOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() -> new BusinessException("Invalid or expired verification code."));

        // Check if failed attempts limit reached
        if (tokenRecord.getFailedAttempts() != null && tokenRecord.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
            tokenRecord.setIsResetCompleted(true); // Burn token
            passwordResetTokenRepository.save(tokenRecord);
            throw new BusinessException("Too many invalid attempts. This verification code has been locked. Please request a new code.");
        }

        // Check expiration
        if (tokenRecord.isExpired()) {
            tokenRecord.setIsResetCompleted(true);
            passwordResetTokenRepository.save(tokenRecord);
            throw new BusinessException("Invalid or expired verification code.");
        }

        // Verify code
        if (!tokenRecord.getOtpCode().equals(enteredCode)) {
            int attempts = (tokenRecord.getFailedAttempts() == null ? 0 : tokenRecord.getFailedAttempts()) + 1;
            tokenRecord.setFailedAttempts(attempts);
            passwordResetTokenRepository.save(tokenRecord);

            int remaining = MAX_FAILED_ATTEMPTS - attempts;
            if (remaining <= 0) {
                tokenRecord.setIsResetCompleted(true);
                passwordResetTokenRepository.save(tokenRecord);
                throw new BusinessException("Too many invalid attempts. Please request a new code.");
            }
            throw new BusinessException("Invalid or expired verification code.");
        }

        // Mark OTP as verified and issue cryptographically secure UUID resetToken
        String resetTokenUuid = UUID.randomUUID().toString();
        tokenRecord.setIsOtpVerified(true);
        tokenRecord.setResetToken(resetTokenUuid);
        // Extend token validity for password entry (15 mins)
        tokenRecord.setExpiryDate(java.time.LocalDateTime.now().plusMinutes(15));
        passwordResetTokenRepository.save(tokenRecord);

        log.info("OTP verified successfully for user [{}]. Issued resetToken.", normalizedEmail);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Verification code verified successfully.");
        result.put("email", normalizedEmail);
        result.put("resetToken", resetTokenUuid);
        return result;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BusinessException("Email is required");
        }
        if (request.getResetToken() == null || request.getResetToken().isBlank()) {
            throw new BusinessException("Valid reset token is required");
        }
        if (request.getNewPassword() == null || !request.getNewPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&~#^()_\\-+=<>.,])[A-Za-z\\d@$!%*?&~#^()_\\-+=<>.,]{8,}$")) {
            throw new BusinessException("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String resetTokenStr = request.getResetToken().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BusinessException("No account found with email: " + normalizedEmail));

        PasswordResetToken tokenRecord = passwordResetTokenRepository
                .findByResetTokenAndIsOtpVerifiedTrueAndIsResetCompletedFalse(resetTokenStr)
                .orElseThrow(() -> new BusinessException("Invalid or expired password reset session. Please verify your code again."));

        // Verify token belongs to user
        if (tokenRecord.getUser().getUserId() != user.getUserId()) {
            throw new BusinessException("Invalid password reset token for this account.");
        }

        // Verify not expired
        if (tokenRecord.isExpired()) {
            tokenRecord.setIsResetCompleted(true);
            passwordResetTokenRepository.save(tokenRecord);
            throw new BusinessException("Password reset session has expired. Please request a new verification code.");
        }

        // Securely hash and update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token completely finished so it can NEVER be reused
        tokenRecord.setIsResetCompleted(true);
        passwordResetTokenRepository.save(tokenRecord);

        log.info("Password successfully reset for user [{}]", normalizedEmail);
    }
}