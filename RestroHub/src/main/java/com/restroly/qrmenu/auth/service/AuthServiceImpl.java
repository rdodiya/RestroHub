package com.restroly.qrmenu.auth.service;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.LoginRequest;
import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.security.JwtTokenProvider;
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
import com.restroly.qrmenu.auth.dto.RegisterRequest;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.exception.DuplicateResourceException;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.repository.UserRepository;
import com.restroly.qrmenu.user.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;

import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private static class TokenData {
    private final String token;
    private final LocalDateTime expiryTime;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    public TokenData(String token, LocalDateTime expiryTime) {
        this.token = token;
        this.expiryTime = expiryTime;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }
}

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    private final Map<String, TokenData> resetTokenCache = new ConcurrentHashMap<>();

    @Value("${reset.expiry.threshold.days:90}")
    private int resetExpiryThresholdDays;

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
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean isResetRequired = false;

            if (user.getResetPassExpiryDate() != null &&
                    LocalDateTime.now().isAfter(user.getResetPassExpiryDate())) {

                isResetRequired = true;
            }
            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

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
                    .isResetRequire(isResetRequired)
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
        // In a production system, you would typically:
        // 1. Add the token to a blacklist (Redis cache)
        // 2. Remove from any session store
        // For now, we just clear the security context
        SecurityContextHolder.clearContext();
        log.info("User logged out successfully");
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {

        User user = userRepository.findByEmail(email)
            .orElse(null);
            if (user == null) {
                return;
            }

        String token = String.format("%06d", new Random().nextInt(999999));

        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);

        resetTokenCache.put(
        email,
        new TokenData(token, expiryTime)
    );



        return AuthResponse.builder()
        .username(user.getEmail())
        .build();
    }
    @Override
    public void resetPassword(String email, String token, String newPassword) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (passwordEncoder.matches(newPassword, user.getPassword())) {
        throw new RuntimeException("New password cannot be same as current password");
    }

    if (token != null && !token.trim().isEmpty()) {

        TokenData tokenData = resetTokenCache.get(email);

        if (tokenData == null) {
            throw new RuntimeException("Invalid or expired token");
        }

        if (LocalDateTime.now().isAfter(tokenData.getExpiryTime())) {
            resetTokenCache.remove(email);
            throw new RuntimeException("Token expired, please regenerate token");
        }

        if (!tokenData.getToken().equals(token)) {
            throw new RuntimeException("Invalid token");
        }

        resetTokenCache.remove(email);
    }

    user.setPassword(passwordEncoder.encode(newPassword));

    user.setResetPassExpiryDate(
            LocalDateTime.now().plusDays(resetExpiryThresholdDays)
    );

    userRepository.save(user);

    System.out.println("Password reset successful");
}
}