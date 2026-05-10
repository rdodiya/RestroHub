package com.restroly.qrmenu.user.controller;

import com.restroly.qrmenu.user.dto.RoleRequest;
import com.restroly.qrmenu.user.dto.RoleResponse;
import com.restroly.qrmenu.user.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Role Management", description = "APIs for role creation and management")
public class RoleController {

    private final RoleService roleService;

    @PostMapping("/addRole")
    @Operation(summary = "Create a new role", description = "Creates a new role")
    public ResponseEntity<Map<String, Object>> createRole(
            @Valid @RequestBody RoleRequest request) {
        log.info("REST request to create role: {}", request.getName());

        RoleResponse response = roleService.createRole(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "success", true,
                        "message", "Role created successfully",
                        "data", response
                ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID", description = "Retrieves a role by its ID")
    public ResponseEntity<Map<String, Object>> getRoleById(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("REST request to get role by ID: {}", id);

        RoleResponse response = roleService.getRoleById(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Role retrieved successfully",
                "data", response
        ));
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get role by name", description = "Retrieves a role by its name")
    public ResponseEntity<Map<String, Object>> getRoleByName(
            @Parameter(description = "Role name") @PathVariable String name) {
        log.info("REST request to get role by name: {}", name);

        RoleResponse response = roleService.getRoleByName(name);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Role retrieved successfully",
                "data", response
        ));
    }

    @GetMapping
    @Operation(summary = "Get all roles", description = "Retrieves all roles")
    public ResponseEntity<Map<String, Object>> getAllRoles() {
        log.info("REST request to get all roles");

        List<RoleResponse> response = roleService.getAllRoles();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Roles retrieved successfully",
                "data", response,
                "count", response.size()
        ));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active roles", description = "Retrieves all active roles")
    public ResponseEntity<Map<String, Object>> getAllActiveRoles() {
        log.info("REST request to get all active roles");

        List<RoleResponse> response = roleService.getAllActiveRoles();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Active roles retrieved successfully",
                "data", response,
                "count", response.size()
        ));
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update role", description = "Updates an existing role")
    public ResponseEntity<Map<String, Object>> updateRole(
            @Parameter(description = "Role ID") @PathVariable Long id,
            @Valid @RequestBody RoleRequest request) {
        log.info("REST request to update role ID: {}", id);

        RoleResponse response = roleService.updateRole(id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Role updated successfully",
                "data", response
        ));
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete role", description = "Deletes a role by its ID")
    public ResponseEntity<Map<String, Object>> deleteRole(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("REST request to delete role ID: {}", id);

        roleService.deleteRole(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Role deleted successfully"
        ));
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle role status", description = "Toggles the active status of a role")
    public ResponseEntity<Map<String, Object>> toggleRoleStatus(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("REST request to toggle status for role ID: {}", id);

        RoleResponse response = roleService.toggleRoleStatus(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Role status toggled successfully",
                "data", response
        ));
    }

    @GetMapping("/exists/name/{name}")
    @Operation(summary = "Check if role name exists", description = "Checks if a role with the given name exists")
    public ResponseEntity<Map<String, Object>> checkRoleNameExists(
            @Parameter(description = "Role name to check") @PathVariable String name) {
        log.info("REST request to check if role name exists: {}", name);

        boolean exists = roleService.existsByName(name);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "exists", exists
        ));
    }
}