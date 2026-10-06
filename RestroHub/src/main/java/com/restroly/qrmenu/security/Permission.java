package com.restroly.qrmenu.security;

import static com.restroly.qrmenu.security.AppRole.*;

import java.util.EnumSet;
import java.util.Set;

/**
 * Role → permission matrix (PHASE1 §5). This is the single place to change who may do what. Default
 * model pending owner sign-off — see PRD §8.
 */
public enum Permission {
  /** Plans, features, users, restaurant assignments, suspension. */
  PLATFORM_ADMIN(SUPER_ADMIN),
  /** Restaurant profile, branches, staff roles, UPI VPA, subscription. */
  RESTAURANT_SETTINGS(SUPER_ADMIN, ADMIN, RESTAURANT_OWNER),
  /** Create/update/delete menus, categories, foods, tables; Excel import. */
  MENU_WRITE(SUPER_ADMIN, ADMIN, RESTAURANT_OWNER, MANAGER),
  /** Read menus, tables, orders, KDS. */
  OPERATIONS_READ(SUPER_ADMIN, ADMIN, RESTAURANT_OWNER, MANAGER, MANAGER_USER, STAFF),
  /** Move an order through its status flow. */
  ORDER_STATUS_UPDATE(SUPER_ADMIN, ADMIN, RESTAURANT_OWNER, MANAGER, STAFF),
  /** See amounts, totals, revenue and UPI details; export data. */
  VIEW_FINANCIALS(SUPER_ADMIN, ADMIN, RESTAURANT_OWNER, MANAGER);

  private final Set<AppRole> roles;

  Permission(AppRole... roles) {
    this.roles = EnumSet.of(roles[0], roles);
  }

  public boolean allows(AppRole role) {
    return roles.contains(role);
  }
}
