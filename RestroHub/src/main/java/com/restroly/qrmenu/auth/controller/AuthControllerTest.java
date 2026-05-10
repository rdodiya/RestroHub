package com.restroly.qrmenu.auth.controller;

//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.restroly.qrmenu.auth.dto.AuthResponse;
//import com.restroly.qrmenu.auth.dto.LoginRequest;
//import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
//import com.restroly.qrmenu.auth.service.AuthService;
//import com.restroly.qrmenu.common.exception.BusinessException;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.BDDMockito.given;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test")
class AuthControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private AuthService authService;
//
//    private LoginRequest validLoginRequest;
//    private AuthResponse authResponse;
//
//    @BeforeEach
//    void setUp() {
//        validLoginRequest = LoginRequest.builder()
//                .username("admin")
//                .password("admin123")
//                .build();
//
//        authResponse = AuthResponse.builder()
//                .accessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test")
//                .refreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh")
//                .tokenType("Bearer")
//                .expiresIn(86400L)
//                .username("admin")
//                .roles(List.of("ROLE_ADMIN"))
//                .build();
//    }
//
//    @Test
//    @DisplayName("POST /v1/auth/login - Should return tokens on successful login")
//    void shouldReturnTokensOnSuccessfulLogin() throws Exception {
//        // Given
//        given(authService.login(any(LoginRequest.class))).willReturn(authResponse);
//
//        // When/Then
//        mockMvc.perform(post("/v1/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validLoginRequest)))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Login successful"))
//                .andExpect(jsonPath("$.data.accessToken").exists())
//                .andExpect(jsonPath("$.data.refreshToken").exists())
//                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
//                .andExpect(jsonPath("$.data.username").value("admin"))
//                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_ADMIN"));
//    }
//
//    @Test
//    @DisplayName("POST /v1/auth/login - Should return 401 on invalid credentials")
//    void shouldReturn401OnInvalidCredentials() throws Exception {
//        // Given
//        given(authService.login(any(LoginRequest.class)))
//                .willThrow(new BadCredentialsException("Invalid username or password"));
//
//        // When/Then
//        mockMvc.perform(post("/v1/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validLoginRequest)))
//                .andExpect(status().isUnauthorized())
//                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"))
//                .andExpect(jsonPath("$.message").value("Invalid credentials"));
//    }
//
//    @Test
//    @DisplayName("POST /v1/auth/login - Should return 400 on validation error")
//    void shouldReturn400OnValidationError() throws Exception {
//        // Given - Invalid request with blank username
//        LoginRequest invalidRequest = LoginRequest.builder()
//                .username("")
//                .password("admin123")
//                .build();
//
//        // When/Then
//        mockMvc.perform(post("/v1/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(invalidRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"))
//                .andExpect(jsonPath("$.validationErrors").isArray());
//    }
//
//    @Test
//    @DisplayName("POST /v1/auth/refresh - Should return new tokens on valid refresh")
//    void shouldReturnNewTokensOnValidRefresh() throws Exception {
//        // Given
//        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
//                .refreshToken("valid-refresh-token")
//                .build();
//
//        given(authService.refreshToken(any(RefreshTokenRequest.class))).willReturn(authResponse);
//
//        // When/Then
//        mockMvc.perform(post("/v1/auth/refresh")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(refreshRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.data.accessToken").exists())
//                .andExpect(jsonPath("$.data.refreshToken").exists());
//    }
//
//    @Test
//    @DisplayName("POST /v1/auth/refresh - Should return 400 on invalid refresh token")
//    void shouldReturn400OnInvalidRefreshToken() throws Exception {
//        // Given
//        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
//                .refreshToken("invalid-refresh-token")
//                .build();
//
//        given(authService.refreshToken(any(RefreshTokenRequest.class)))
//                .willThrow(new BusinessException("Invalid or expired refresh token"));
//
//        // When/Then
//        mockMvc.perform(post("/v1/auth/refresh")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(refreshRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.error").value("BAD_REQUEST"));
//    }
}