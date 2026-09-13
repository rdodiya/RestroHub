package com.restroly.qrmenu.user.dto;

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

    private String dateOfBirth;

    private String gender;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private String bio;

    // Transient field to carry file data from Controller to Service layer
    private byte[] profileImageBytes;
}