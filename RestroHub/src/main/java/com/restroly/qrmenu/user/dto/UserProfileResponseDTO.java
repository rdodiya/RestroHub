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
    private String profileImage; // Base64 encoded raw string without data URI prefix
    private String role;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantDescription;
    private String branches;
    private String joinedDate;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String bio;
}


