package com.restroly.qrmenu.auth.controller;

import com.restroly.qrmenu.auth.dto.AuthResponse;
import com.restroly.qrmenu.auth.dto.LoginRequest;
import com.restroly.qrmenu.auth.dto.RefreshTokenRequest;
import com.restroly.qrmenu.auth.service.AuthService;
import com.restroly.qrmenu.common.dto.ApiResponse;
import com.restroly.qrmenu.common.exception.ErrorResponse;
import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import com.restroly.qrmenu.user.entity.UserToken;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;

@RestController
@RequestMapping(PUBLIC_API_VERSION + "/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "APIs for user authentication and token management")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "Authenticate user and generate tokens",
            description = "Authenticates user credentials and returns JWT access token and refresh token"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Authentication successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class),
                            examples = @ExampleObject(value = """
                                    {
                                        "success": true,
                                        "message": "Login successful",
                                        "data": {
                                            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                            "tokenType": "Bearer",
                                            "expiresIn": 86400,
                                            "username": "admin",
                                            "roles": ["ROLE_ADMIN"]
                                        },
                                        "timestamp": "2024-01-15T10:30:00"
                                    }
                                    """)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid request - validation failed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication failed - invalid credentials",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(value = """
                                    {
                                        "status": 401,
                                        "error": "UNAUTHORIZED",
                                        "message": "Invalid username or password",
                                        "path": "/api/v1/auth/login",
                                        "timestamp": "2024-01-15T10:30:00",
                                        "traceId": "abc123"
                                    }
                                    """)
                    )
            )
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Login credentials",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = LoginRequest.class),
                    examples = @ExampleObject(value = """
                            {
                                "username": "admin",
                                "password": "admin123"
                            }
                            """)
            )
    )
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        log.info("Login request received for user: {}", loginRequest.getUsername());

        AuthResponse authResponse = authService.login(loginRequest,response);

        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Refresh access token",
            description = "Generates new access and refresh tokens using a valid refresh token"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired refresh token",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {

        log.debug("Refresh token request received");

        AuthResponse authResponse = authService.refreshToken(refreshTokenRequest);

        return ResponseEntity.ok(ApiResponse.success(authResponse, "Token refreshed successfully"));
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Logout user",
            description = "Invalidates the current user session"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Logout successful"
            )
    })
    public ResponseEntity<ApiResponse<String>> logout(Authentication authentication,HttpServletResponse response) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        authService.logout(userDetails.getUsername(), response);

        log.info("User logged out successfully");

        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    @GetMapping("/validate")
    @Operation(
            summary = "Validate token",
            description = "Validates if the provided JWT token is valid and not expired"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Token is valid"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Token is invalid or expired"
            )
    })
    public ResponseEntity<ApiResponse<String>> validateToken(HttpServletRequest request) {
        String token = extractToken(request);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        // Token validation happens in the security filter
        // If we reach here, the token is valid
        return ResponseEntity.ok(ApiResponse.success("Token is valid"));
    }

    // ─── POST /api/auth/register (Public) ───
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody UserRequest request,
            HttpServletResponse response
    ) {
        try {
            AuthResponse authResponse =
                    authService.register(request, response);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
//                            .success(false)
//                            .message(e.getMessage())
                            .build());
        }
    }

    // ─── GET /api/auth/verify (Protected) ───
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyToken(
            Authentication authentication
    ) {
        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();
        UserResponse userResponse =
                authService.verifyToken(userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Token is valid")
                .data(userResponse)
                .build());
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}