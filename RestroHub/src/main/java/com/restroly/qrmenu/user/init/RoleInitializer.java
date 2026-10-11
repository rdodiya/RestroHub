package com.restroly.qrmenu.user.init;

import com.restroly.qrmenu.security.AppRole;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.repository.RoleRepository;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Keeps t_role_master aligned with {@link AppRole}: inserts any of the four app roles that are
 * missing and deactivates legacy rows (CUSTOMER, RESTAURANT_OWNER, MANAGER_USER, ...) so they no
 * longer show up in role pickers. Existing assignments to legacy roles are migrated by
 * V7__consolidate_roles.sql.
 */
@Component
public class RoleInitializer implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(RoleInitializer.class);

  private static final Map<AppRole, String> DESCRIPTIONS =
      Map.of(
          AppRole.SUPER_ADMIN, "Platform owner",
          AppRole.ADMIN, "Restaurant owner: full access to own restaurant",
          AppRole.MANAGER, "Limited access compared to admin",
          AppRole.STAFF, "Kitchen display and order status");

  private final RoleRepository roleRepository;

  public RoleInitializer(RoleRepository roleRepository) {
    this.roleRepository = roleRepository;
  }

  @Override
  public void run(ApplicationArguments args) {
    try {
      List<Role> existing = roleRepository.findAll();
      for (AppRole appRole : AppRole.values()) {
        boolean present =
            existing.stream().anyMatch(r -> AppRole.normalize(r.getName()).equals(appRole.name()));
        if (!present) {
          roleRepository.save(
              Role.builder()
                  .name("ROLE_" + appRole.name())
                  .description(DESCRIPTIONS.get(appRole))
                  .isActive(true)
                  .build());
          log.info("Inserted missing role: {}", appRole);
        }
      }
      for (Role r : existing) {
        if (AppRole.from(r.getName()).isEmpty() && !Boolean.FALSE.equals(r.getIsActive())) {
          r.setIsActive(false);
          roleRepository.save(r);
          log.info("Deactivated legacy role: {}", r.getName());
        }
      }
    } catch (Exception e) {
      log.error("Error ensuring app roles exist", e);
    }
  }
}
