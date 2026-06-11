package com.restroly.qrmenu.superAdmin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignRoleRequest {

    private Long userId;

    private Long roleId;

    private Long restaurantId;

    private Boolean activateUser;
}