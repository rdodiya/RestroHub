package com.restroly.qrmenu.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequestDTO {

    // Name is optional for partial updates (e.g., only updating profile image)
    private String name;

    private String phoneNumber;

    // Transient field to carry file data from Controller to Service layer
    private byte[] profileImageBytes;
}