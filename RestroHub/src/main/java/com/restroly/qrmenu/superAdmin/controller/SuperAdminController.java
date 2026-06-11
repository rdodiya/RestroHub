package com.restroly.qrmenu.superAdmin.controller;

import com.restroly.qrmenu.superAdmin.dto.AssignRoleRequest;
import com.restroly.qrmenu.superAdmin.dto.AssignRoleResponse;
import com.restroly.qrmenu.superAdmin.dto.PendingCustomerResponse;
import com.restroly.qrmenu.superAdmin.service.SuperAdminUserService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/super-admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Super Admin Management")
public class SuperAdminController {

    private final SuperAdminUserService superAdminUserService;

    @GetMapping("/pending-customers")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Fetch all customer registrations")
    public ResponseEntity<?> fetchAllPendingUsers(

            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("REST request to fetch all customer registrations");

        Page<PendingCustomerResponse> response = superAdminUserService.fetchAllPendingCustomers(pageable);

        return ResponseEntity.ok(Map.of("success", true, "message", "Customer registrations fetched successfully", "data", response.getContent(), "pagination", Map.of("currentPage", response.getNumber(), "totalPages", response.getTotalPages(), "totalElements", response.getTotalElements(), "size", response.getSize())));
    }

    @PostMapping("/assign-role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Assign role to user")
    public ResponseEntity<?> assignRoleToUser(@Valid @RequestBody AssignRoleRequest request) {

        log.info("Super Admin assigning role {} to user {}", request.getRoleId(), request.getUserId());

        AssignRoleResponse response = superAdminUserService.assignRole(request);

        return ResponseEntity.ok(Map.of("success", true, "message", "Role assigned successfully", "data", response));
    }

    @PutMapping("/update-role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Assign role to user")
    public ResponseEntity<?> updateRoleOfUser(@Valid @RequestBody AssignRoleRequest request) {

        log.info("Super Admin assigning role {} to user {}", request.getRoleId(), request.getUserId());

        AssignRoleResponse response = superAdminUserService.updateRole(request);

        return ResponseEntity.ok(Map.of("success", true, "message", "Role assigned successfully", "data", response));
    }

    @PutMapping("/update-status")
    @PreAuthorize("hasRole('SUPER_ADDMIN')")
    @Operation(summary = "update user status")
    public ResponseEntity<?> updateUserStatus(@Valid @RequestBody AssignRoleRequest request) {

        log.info("Super Admin assigning role {} to user {}", request.getRoleId(), request.getUserId());

        AssignRoleResponse response = superAdminUserService.updateUserStatus(request);

        return ResponseEntity.ok(Map.of("success", true, "message", "Role assigned successfully", "data", response));
    }
}
