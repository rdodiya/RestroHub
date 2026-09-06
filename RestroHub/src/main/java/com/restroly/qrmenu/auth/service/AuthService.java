package com.restroly.qrmenu.auth.service;

import java.util.Map;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.LoginRequest;
import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
import com.restroly.qrmenu.auth.dto.RegisterRequest;
import com.restroly.qrmenu.auth.dto.ResetPasswordRequest;
import com.restroly.qrmenu.auth.dto.VerifyResetCodeRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest registerRequest);

    AuthResponse login(LoginRequest loginRequest);

    AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    void logout(String token);

    /**
     * Generates a 6-digit OTP, stores it, sends an email, and returns a safe success response.
     */
    Map<String, Object> forgotPassword(String email);

    /**
     * Verifies the 6-digit OTP, checks expiry and failed attempt limit,
     * invalidates the OTP, and returns a secure, short-lived resetToken.
     */
    Map<String, Object> verifyResetCode(VerifyResetCodeRequest request);

    /**
     * Uses the secure resetToken to reset the user's password with BCrypt.
     */
    void resetPassword(ResetPasswordRequest request);
}