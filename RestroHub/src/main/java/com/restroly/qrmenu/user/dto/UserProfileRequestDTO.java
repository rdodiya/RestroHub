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

    @NotBlank(message = "Name cannot be empty")
    private String name;

    private String phoneNumber;
}