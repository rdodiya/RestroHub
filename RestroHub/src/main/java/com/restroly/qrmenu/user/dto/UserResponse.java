package com.restroly.qrmenu.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private String profileImage;

    private Boolean isActive;

    private Set<RoleResponse> roles;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}