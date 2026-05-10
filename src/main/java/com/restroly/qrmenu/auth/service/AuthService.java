package com.restroly.qrmenu.auth.service;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.LoginRequest;
import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest,HttpServletResponse response);

    AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    void logout(String username, HttpServletResponse response);

    AuthResponse register(UserRequest request, HttpServletResponse response);

    UserResponse verifyToken(String username);
}
