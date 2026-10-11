package com.restroly.qrmenu.user.dto;

public record RoleAssignmentDto(
    Long id,
    Long userId,
    String userName,
    String userEmail,
    Long restaurantId,
    String restaurantName,
    Long roleId,
    String roleName) {}
