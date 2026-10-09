package com.restroly.qrmenu.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegisterRequest {

  @NotBlank private String firstName;

  @NotBlank private String lastName;

  @Email @NotBlank private String email;

  // Same rule as the register form (Register.jsx).
  @NotBlank
  @Size(min = 8, message = "Minimum 8 characters")
  @Pattern(
      regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
      message = "Must contain uppercase, lowercase, number and special character")
  private String password;

  @NotBlank private String restaurantName;
}
