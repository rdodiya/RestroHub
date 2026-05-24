package com.restroly.qrmenu.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String pictureUrl;
    // We can add resuruant specific fields later if user entry holds item
}

