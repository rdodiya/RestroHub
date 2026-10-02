package com.restroly.qrmenu.security;

import java.util.Locale;
import java.util.Optional;

/**
 * Roles the backend understands. Role rows in {@code t_role_master} are matched by name, with or
 * without the {@code ROLE_} prefix.
 */
public enum AppRole {
  SUPER_ADMIN,
  ADMIN,
  RESTAURANT_OWNER,
  MANAGER,
  MANAGER_USER,
  STAFF,
  CUSTOMER;

  private static final String PREFIX = "ROLE_";

  /** Normalizes a stored role name ("ROLE_ADMIN", "ADMIN", "restaurant owner") to its bare form. */
  public static String normalize(String roleName) {
    String name = roleName.trim().toUpperCase(Locale.ROOT).replace(' ', '_').replace('-', '_');
    while (name.startsWith(PREFIX)) {
      name = name.substring(PREFIX.length());
    }
    return name;
  }

  /** Spring Security authority for a stored role name; never doubles the {@code ROLE_} prefix. */
  public static String authority(String roleName) {
    return PREFIX + normalize(roleName);
  }

  /** Parses a stored role name or authority; empty for null or unknown names. */
  public static Optional<AppRole> from(String roleName) {
    if (roleName == null || roleName.isBlank()) {
      return Optional.empty();
    }
    try {
      return Optional.of(valueOf(normalize(roleName)));
    } catch (IllegalArgumentException ex) {
      return Optional.empty();
    }
  }
}
