package com.restroly.qrmenu.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for Google OAuth authentication.
 * The token is the ID token received from Google's frontend after user authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Google OAuth authentication request")
public class GoogleAuthRequest {

    @NotBlank(message = "Google ID token is required")
    @Schema(
        description = "Google ID token obtained from Google Sign-In on frontend",
        example = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJ..."
    )
    private String token;
}
