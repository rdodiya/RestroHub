package com.restroly.qrmenu.config;

import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Initializes default roles in the database on application startup.
 * Ensures required roles (ADMIN, RESTAURANT_OWNER, CUSTOMER) exist
 * before any authentication (including Google OAuth) is attempted.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    private static final List<String[]> DEFAULT_ROLES = List.of(
        new String[]{"ADMIN",            "System administrator with full access"},
        new String[]{"RESTAURANT_OWNER", "Restaurant owner with management access"},
        new String[]{"CUSTOMER",         "End customer placing orders via QR menu"}
    );

    @Override
    public void run(String... args) {
        log.info("Checking and initializing default roles...");

        for (String[] roleData : DEFAULT_ROLES) {
            String roleName = roleData[0];
            String roleDesc = roleData[1];

            if (!roleRepository.existsByName(roleName)) {
                Role role = Role.builder()
                        .name(roleName)
                        .description(roleDesc)
                        .isActive(true)
                        .build();
                roleRepository.save(role);
                log.info("Created default role: {}", roleName);
            } else {
                log.debug("Role already exists, skipping: {}", roleName);
            }
        }

        log.info("Role initialization complete.");
    }
