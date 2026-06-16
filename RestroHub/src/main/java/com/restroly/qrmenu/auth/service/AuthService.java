package com.restroly.qrmenu.auth.service;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.LoginRequest;
import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
import com.restroly.qrmenu.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);

    AuthResponse login(LoginRequest loginRequest);

    AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    void logout(String token);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
}