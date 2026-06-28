package com.restroly.qrmenu.user.init;

import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(RoleInitializer.class);
    private static final String CUSTOMER_ROLE = "CUSTOMER";

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            if (!roleRepository.existsByName(CUSTOMER_ROLE)) {
                Role r = Role.builder()
                        .name(CUSTOMER_ROLE)
                        .description("Default customer role")
                        .isActive(true)
                        .build();
                roleRepository.save(r);
                log.info("Inserted missing role: {}", CUSTOMER_ROLE);
            } else {
                log.debug("Role '{}' already exists", CUSTOMER_ROLE);
            }
        } catch (Exception e) {
            log.error("Error ensuring default roles exist", e);
        }
    }
}
