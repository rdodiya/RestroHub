package com.restroly.qrmenu.security;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;
import org.junit.jupiter.api.Test;

class AppRoleTest {

  @Test
  void authorityNeverDoublesThePrefix() {
    // Role names are stored as "ROLE_ADMIN" (RoleRequest enforces it); older rows may be "ADMIN".
    assertEquals("ROLE_ADMIN", AppRole.authority("ROLE_ADMIN"));
    assertEquals("ROLE_ADMIN", AppRole.authority("ADMIN"));
    assertEquals("ROLE_RESTAURANT_OWNER", AppRole.authority("restaurant owner"));
  }

  @Test
  void fromParsesKnownRolesAndIgnoresUnknown() {
    assertEquals(Optional.of(AppRole.MANAGER_USER), AppRole.from("ROLE_MANAGER_USER"));
    assertEquals(Optional.of(AppRole.SUPER_ADMIN), AppRole.from("SUPER_ADMIN"));
    assertEquals(Optional.empty(), AppRole.from("ROLE_SOMETHING_ELSE"));
    assertEquals(Optional.empty(), AppRole.from(null));
  }
}
