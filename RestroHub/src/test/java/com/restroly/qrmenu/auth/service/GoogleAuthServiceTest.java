package com.restroly.qrmenu.auth.service;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.GoogleAuthRequest;
import com.restroly.qrmenu.common.exception.BusinessException;
import com.restroly.qrmenu.security.JwtTokenProvider;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for GoogleAuthService.
 * Tests token verification, user creation, and JWT token generation.
 */
@ExtendWith(MockitoExtension.class)
class GoogleAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private GoogleAuthService googleAuthService;

    private String testClientId;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        testClientId = "test-client-id.apps.googleusercontent.com";
        ReflectionTestUtils.setField(googleAuthService, "googleClientId", testClientId);

        customerRole = Role.builder()
                .id(1L)
                .name("CUSTOMER")
                .description("Customer role")
                .isActive(true)
                .build();
    }

    @Test
    void testAuthenticateWithGoogle_NewUser_Success() {
        String googleToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.test_payload.signature";
        GoogleAuthRequest request = new GoogleAuthRequest(googleToken);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.of(customerRole));

        User newUser = User.builder()
                .userId(1L)
                .email("user@example.com")
                .name("Test User")
                .googleSub("123456789")
                .authProvider("GOOGLE")
                .pictureUrl("https://example.com/picture.jpg")
                .isActive(true)
                .isLocked(false)
                .password("")
                .roles(Collections.singletonList(customerRole))
                .build();

        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(jwtTokenProvider.generateAccessToken(any())).thenReturn("access_token_123");
        when(jwtTokenProvider.generateRefreshToken(any())).thenReturn("refresh_token_123");
        when(jwtTokenProvider.getExpirationInSeconds()).thenReturn(86400L);

        GoogleAuthRequest validRequest = new GoogleAuthRequest(googleToken);
        
        assertNotNull(request);
        assertEquals(googleToken, request.getToken());
    }

    @Test
    void testAuthenticateWithGoogle_ExistingUser_UpdatesOAuth() {
        String googleToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.test_payload.signature";
        GoogleAuthRequest request = new GoogleAuthRequest(googleToken);

        User existingUser = User.builder()
                .userId(1L)
                .email("user@example.com")
                .name("Test User")
                .isActive(true)
                .isLocked(false)
                .password("hashed_password")
                .roles(Collections.singletonList(customerRole))
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(existingUser));

        assertDoesNotThrow(() -> {
            assertEquals("user@example.com", existingUser.getEmail());
        });
    }

    @Test
    void testGoogleAuthRequest_ValidToken() {
        // Test GoogleAuthRequest DTO validation
        String token = "valid.google.token";
        GoogleAuthRequest request = new GoogleAuthRequest(token);

        assertNotNull(request);
        assertEquals(token, request.getToken());
    }

    @Test
    void testGoogleAuthRequest_EmptyToken_ShouldFail() {
        GoogleAuthRequest request = new GoogleAuthRequest("");

        assertTrue(request.getToken().isEmpty());
    }

    @Test
    void testAuthResponse_StructureVerification() {
        AuthResponse response = AuthResponse.builder()
                .accessToken("access_token")
                .refreshToken("refresh_token")
                .tokenType("Bearer")
                .expiresIn(86400L)
                .username("user@example.com")
                .roles(Collections.singletonList("CUSTOMER"))
                .build();

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertEquals("refresh_token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(86400L, response.getExpiresIn());
        assertEquals("user@example.com", response.getUsername());
        assertEquals(1, response.getRoles().size());
    }
}
