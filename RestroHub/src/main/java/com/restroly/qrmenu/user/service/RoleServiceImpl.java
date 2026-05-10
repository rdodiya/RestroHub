package com.restroly.qrmenu.user.service;

import com.restroly.qrmenu.user.dto.RoleRequest;
import com.restroly.qrmenu.user.dto.RoleResponse;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.exception.DuplicateResourceException;
import com.restroly.qrmenu.user.exception.RoleNotFoundException;
import com.restroly.qrmenu.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleResponse createRole(RoleRequest request) {
        log.info("Creating new role with name: {}", request.getName());

        // Check if role name already exists
        if (roleRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Role with name '" + request.getName() + "' already exists");
        }

        // Build role entity
        Role role = Role.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Role savedRole = roleRepository.save(role);
        log.info("Role created successfully with ID: {}", savedRole.getId());

        return mapToResponse(savedRole);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Long id) {
        log.info("Fetching role with ID: {}", id);

        Role role = roleRepository.findByIdWithUsers(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        return mapToResponseWithUserCount(role);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleByName(String name) {
        log.info("Fetching role with name: {}", name);

        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with name: " + name));

        return mapToResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        log.info("Fetching all roles");

        return roleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllActiveRoles() {
        log.info("Fetching all active roles");

        return roleRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse updateRole(Long id, RoleRequest request) {
        log.info("Updating role with ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        // Check name uniqueness (if changed)
        if (request.getName() != null && !request.getName().equals(role.getName())) {
            if (roleRepository.existsByNameAndIdNot(request.getName(), id)) {
                throw new DuplicateResourceException("Role with name '" + request.getName() + "' already exists");
            }
            role.setName(request.getName());
        }

        // Update fields
        if (request.getDescription() != null) {
            role.setDescription(request.getDescription());
        }
        if (request.getIsActive() != null) {
            role.setIsActive(request.getIsActive());
        }

        Role updatedRole = roleRepository.save(role);
        log.info("Role updated successfully with ID: {}", id);

        return mapToResponse(updatedRole);
    }

    @Override
    public void deleteRole(Long id) {
        log.info("Deleting role with ID: {}", id);

        Role role = roleRepository.findByIdWithUsers(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        // Check if role is assigned to any users
        long userCount = roleRepository.countUsersByRoleId(id);
        if (userCount > 0) {
            throw new IllegalStateException("Cannot delete role. It is assigned to " + userCount + " user(s)");
        }

        roleRepository.delete(role);
        log.info("Role deleted successfully with ID: {}", id);
    }

    @Override
    public RoleResponse toggleRoleStatus(Long id) {
        log.info("Toggling status for role ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        role.setIsActive(!role.getIsActive());
        Role updatedRole = roleRepository.save(role);

        log.info("Role status toggled to {} for ID: {}", updatedRole.getIsActive(), id);
        return mapToResponse(updatedRole);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }

    // Private helper methods
    private RoleResponse mapToResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .isActive(role.getIsActive())
                .build();
    }

    private RoleResponse mapToResponseWithUserCount(Role role) {
        long userCount = roleRepository.countUsersByRoleId(role.getId());

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .isActive(role.getIsActive())
                .userCount((int) userCount)
                .build();
    }
}