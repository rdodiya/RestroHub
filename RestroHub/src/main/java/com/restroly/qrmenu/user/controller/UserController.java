package com.restroly.qrmenu.user.controller;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.user.dto.ChangePasswordRequestDTO;
import com.restroly.qrmenu.user.dto.UserProfileRequestDTO;
import com.restroly.qrmenu.user.dto.UserProfileResponseDTO;
import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.token.Token;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user management")
public class UserController {

    private final UserService userService;

    // =========================================================
    // AUTHENTICATED CURRENT USER PROFILE APIs
    // =========================================================

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserProfileResponseDTO> getCurrentUserProfile() {
        log.info("Fetching current authenticated user profile");

        UserProfileResponseDTO profile = userService.getCurrentUserProfile();

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    @Operation(summary = "Update current authenticated user profile")
    public ResponseEntity<UserProfileResponseDTO> updateUserProfile(
            @Valid @RequestBody UserProfileRequestDTO request) {

        log.info("Updating current authenticated user profile");

        UserProfileResponseDTO updatedProfile =
                userService.updateUserProfile(request);

        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change password for authenticated user")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO request) {

        log.info("Changing password for authenticated user");
        userService.changePassword(request);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // =========================================================
    // ADMIN USER MANAGEMENT APIs
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<Map<String, Object>> getUserById(
            @Parameter(description = "User ID")
            @PathVariable Long id) {

        log.info("REST request to get user by ID: {}", id);

        UserResponse response = userService.getUserById(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User retrieved successfully",
                "data", response
        ));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by email")
    public ResponseEntity<Map<String, Object>> getUserByEmail(
            @Parameter(description = "User email")
            @PathVariable String email) {

        log.info("REST request to get user by email: {}", email);

        UserResponse response = userService.getUserByEmail(email);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User retrieved successfully",
                "data", response
        ));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users with pagination")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @PageableDefault(
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        log.info("REST request to get all users with pagination");

        Page<UserResponse> response =
                userService.getAllUsers(pageable);

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
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users without pagination")
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
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user")
    public ResponseEntity<Map<String, Object>> updateUser(
            @Parameter(description = "User ID")
            @PathVariable Long id,

            @Valid @RequestBody UserRequest request) {

        log.info("REST request to update user ID: {}", id);

        UserResponse response =
                userService.updateUser(id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User updated successfully",
                "data", response
        ));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @Parameter(description = "User ID")
            @PathVariable Long id) {

        log.info("REST request to delete user ID: {}", id);

        userService.deleteUser(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User deleted successfully"
        ));
    }

    @PostMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign roles to user")
    public ResponseEntity<Map<String, Object>> assignRolesToUser(
            @Parameter(description = "User ID")
            @PathVariable Long userId,

            @RequestBody Set<Long> roleIds) {

        log.info(
                "REST request to assign roles {} to user ID: {}",
                roleIds,
                userId
        );

        UserResponse response =
                userService.assignRolesToUser(userId, roleIds);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Roles assigned successfully",
                "data", response
        ));
    }

    @DeleteMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove roles from user")
    public ResponseEntity<Map<String, Object>> removeRolesFromUser(
            @Parameter(description = "User ID")
            @PathVariable Long userId,

            @RequestBody Set<Long> roleIds) {

        log.info(
                "REST request to remove roles {} from user ID: {}",
                roleIds,
                userId
        );

        UserResponse response =
                userService.removeRolesFromUser(userId, roleIds);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Roles removed successfully",
                "data", response
        ));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle user status")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(
            @Parameter(description = "User ID")
            @PathVariable Long id) {

        log.info(
                "REST request to toggle status for user ID: {}",
                id
        );

        UserResponse response =
                userService.toggleUserStatus(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User status toggled successfully",
                "data", response
        ));
    }

    @GetMapping("/exists/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Check if email exists")
    public ResponseEntity<Map<String, Object>> checkEmailExists(
            @Parameter(description = "Email to check")
            @PathVariable String email) {

        log.info(
                "REST request to check if email exists: {}",
                email
        );

        boolean exists = userService.existsByEmail(email);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "exists", exists
        ));
    }
    
    @GetMapping("/fetchRestaurantId")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> fetchRestaurantId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Usually this is the email if you set it while creating the Authentication object
        String email = authentication.getName();

        User user = userService.getUserByEmailEntity(email);

        Restaurant restaurant = user.getUserRoleRestaurants()
                .stream()
                .map(UserRoleRestaurant::getRestaurant)
                .findFirst()
                .orElse(null);

        Long restaurantId = restaurant != null ? restaurant.getRestId() : null;
        String restaurantName = restaurant != null ? restaurant.getName() : null;

        Long branchId = null;
        String branchName = null;
        if (restaurant != null && restaurant.getBranches() != null && !restaurant.getBranches().isEmpty()) {
            Branch branch = restaurant.getBranches().get(0);
            branchId = branch.getBranchId();
            branchName = branch.getName();
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "restaurantId", restaurantId,
                "restaurantName", restaurantName,
                "branchId", branchId,
                "branchName", branchName
        ));
    }
}

