package com.restroly.qrmenu.config;

import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing default roles and users...");

        // Initialize Roles
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN", "Administrator role");
        Role userRole = createRoleIfNotFound("ROLE_USER", "Standard user role");
        Role ownerRole = createRoleIfNotFound("ROLE_RESTAURANT_OWNER", "Restaurant owner role");

        // Initialize Users
        createUserIfNotFound("admin@restroly.com", "admin123", "System Admin", Arrays.asList(adminRole, userRole));
        createUserIfNotFound("owner@restroly.com", "owner123", "Restaurant Owner", Arrays.asList(ownerRole, userRole));
        createUserIfNotFound("user@restroly.com", "user123", "Normal User", Arrays.asList(userRole));

        log.info("Data initialization completed.");
    }

    private Role createRoleIfNotFound(String name, String description) {
        return roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role role = Role.builder()
                            .name(name)
                            .description(description)
                            .isActive(true)
                            .build();
                    return roleRepository.save(role);
                });
    }

    private void createUserIfNotFound(String email, String password, String name, List<Role> roles) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .name(name)
                    .roles(roles)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            log.info("Created default user: {}", email);
        }
    }
}
