package com.restroly.qrmenu.superAdmin.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleResponse {

    private Long userId;

    private String userName;

    private String roleName;

    private String restaurantName;

    private Boolean active;
}