package com.restroly.qrmenu.user.controller;

import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import com.restroly.qrmenu.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user registration and management")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account")
    public ResponseEntity<Map<String, Object>> registerUser(
            @Valid @RequestBody UserRequest request) {
        log.info("REST request to register user with email: {}", request.getEmail());

        UserResponse response = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "success", true,
                        "message", "User registered successfully",
                        "data", response
                ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
    public ResponseEntity<Map<String, Object>> getUserById(
            @Parameter(description = "User ID") @PathVariable Long id) {
        log.info("REST request to get user by ID: {}", id);

        UserResponse response = userService.getUserById(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User retrieved successfully",
                "data", response
        ));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email", description = "Retrieves a user by their email")
    public ResponseEntity<Map<String, Object>> getUserByEmail(
            @Parameter(description = "User email") @PathVariable String email) {
        log.info("REST request to get user by email: {}", email);

        UserResponse response = userService.getUserByEmail(email);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User retrieved successfully",
                "data", response
        ));
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves all users with pagination")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("REST request to get all users with pagination");

        Page<UserResponse> response = userService.getAllUsers(pageable);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Users retrieved successfully",
                "data", response.getContent(),
                "pagination", Map.of(
                        "currentPage", response.getNumber(),
                        "totalPages", response.getTotalPages(),
                        "totalElements", response.getTotalElements(),
                        "size", response.getSize()
                )
        ));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all users without pagination", description = "Retrieves all users")
    public ResponseEntity<Map<String, Object>> getAllUsersWithoutPagination() {
        log.info("REST request to get all users");

        List<UserResponse> response = userService.getAllUsers();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Users retrieved successfully",
                "data", response,
                "count", response.size()
        ));
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update user", description = "Updates an existing user")
    public ResponseEntity<Map<String, Object>> updateUser(
            @Parameter(description = "User ID") @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        log.info("REST request to update user ID: {}", id);

        UserResponse response = userService.updateUser(id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User updated successfully",
                "data", response
        ));
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete user", description = "Deletes a user by their ID")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @Parameter(description = "User ID") @PathVariable Long id) {
        log.info("REST request to delete user ID: {}", id);

        userService.deleteUser(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User deleted successfully"
        ));
    }

    @PostMapping("/{userId}/roles")
    @Operation(summary = "Assign roles to user", description = "Assigns one or more roles to a user")
    public ResponseEntity<Map<String, Object>> assignRolesToUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @RequestBody Set<Long> roleIds) {
        log.info("REST request to assign roles {} to user ID: {}", roleIds, userId);

        UserResponse response = userService.assignRolesToUser(userId, roleIds);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Roles assigned successfully",
                "data", response
        ));
    }

    @DeleteMapping("/{userId}/roles")
    @Operation(summary = "Remove roles from user", description = "Removes one or more roles from a user")
    public ResponseEntity<Map<String, Object>> removeRolesFromUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @RequestBody Set<Long> roleIds) {
        log.info("REST request to remove roles {} from user ID: {}", roleIds, userId);

        UserResponse response = userService.removeRolesFromUser(userId, roleIds);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Roles removed successfully",
                "data", response
        ));
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle user status", description = "Toggles the active status of a user")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(
            @Parameter(description = "User ID") @PathVariable Long id) {
        log.info("REST request to toggle status for user ID: {}", id);

        UserResponse response = userService.toggleUserStatus(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User status toggled successfully",
                "data", response
        ));
    }

    @GetMapping("/exists/email/{email}")
    @Operation(summary = "Check if email exists", description = "Checks if a user with the given email exists")
    public ResponseEntity<Map<String, Object>> checkEmailExists(
            @Parameter(description = "Email to check") @PathVariable String email) {
        log.info("REST request to check if email exists: {}", email);

        boolean exists = userService.existsByEmail(email);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "exists", exists
        ));
    }
}