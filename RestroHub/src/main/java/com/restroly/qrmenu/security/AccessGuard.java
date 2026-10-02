package com.restroly.qrmenu.security;

import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tenant and permission checks for the authenticated user. Exposed to SpEL as {@code @access}, e.g.
 * {@code @PreAuthorize("@access.can('MENU_WRITE') and @access.branch(#branchId)")}.
 *
 * <p>Branch access is derived from restaurant membership: a user linked to a restaurant can reach
 * all of its branches. ponytail: no per-branch user assignment exists yet; add a user↔branch table
 * if owners need branch-restricted managers.
 */
@Component("access")
@RequiredArgsConstructor
public class AccessGuard {

  private final UserRepository userRepository;
  private final BranchRepository branchRepository;
  private final EntityManager em;

  /** Whether the current user holds the given {@link Permission} through any of their roles. */
  public boolean can(String permission) {
    Permission p = Permission.valueOf(permission);
    return currentRoles().stream().anyMatch(p::allows);
  }

  /** Whether the current user is a platform super admin. */
  public boolean isSuperAdmin() {
    return currentRoles().contains(AppRole.SUPER_ADMIN);
  }

  /** Whether the current user is linked to the restaurant (super admins reach every restaurant). */
  @Transactional(readOnly = true)
  public boolean restaurant(Long restaurantId) {
    if (restaurantId == null || currentEmail().isEmpty()) {
      return false;
    }
    return isSuperAdmin() || restaurantIds().contains(restaurantId);
  }

  /** Whether the branch exists and belongs to a restaurant the current user is linked to. */
  @Transactional(readOnly = true)
  public boolean branch(Long branchId) {
    if (branchId == null || currentEmail().isEmpty()) {
      return false;
    }
    return branchRepository
        .findById(branchId)
        .map(b -> restaurant(b.getRestaurant().getRestId()))
        .orElse(false);
  }

  /** Whether the order belongs to a branch the current user can access. */
  @Transactional(readOnly = true)
  public boolean order(Long orderId) {
    return ownerBranch("select o.branch.branchId from Order o where o.orderId = :id", orderId);
  }

  /** Whether the menu belongs to a branch the current user can access. */
  @Transactional(readOnly = true)
  public boolean menu(Long menuId) {
    return ownerBranch("select m.branch.branchId from Menu m where m.menuId = :id", menuId);
  }

  /** Whether the table belongs to a branch the current user can access. */
  @Transactional(readOnly = true)
  public boolean table(Long tableId) {
    return ownerBranch("select t.branch.branchId from Tables t where t.tableId = :id", tableId);
  }

  /** Whether the UPI link belongs to a branch the current user can access. */
  @Transactional(readOnly = true)
  public boolean upiLink(Long upiLinkId) {
    return ownerBranch("select u.branch.branchId from UpiLink u where u.id = :id", upiLinkId);
  }

  /** Whether the service request belongs to a branch the current user can access. */
  @Transactional(readOnly = true)
  public boolean serviceRequest(Long requestId) {
    return ownerBranch("select s.branchId from ServiceRequest s where s.id = :id", requestId);
  }

  /** Whether the website config belongs to a restaurant the current user is linked to. */
  @Transactional(readOnly = true)
  public boolean site(String siteId) {
    if (siteId == null || currentEmail().isEmpty()) {
      return false;
    }
    return em.createQuery(
            "select s.restaurantId from SiteConfig s where s.siteId = :id", Long.class)
        .setParameter("id", siteId)
        .getResultStream()
        .findFirst()
        .map(this::restaurant)
        .orElse(false);
  }

  private boolean ownerBranch(String jpql, Long id) {
    if (id == null || currentEmail().isEmpty()) {
      return false;
    }
    return em.createQuery(jpql, Long.class)
        .setParameter("id", id)
        .getResultStream()
        .findFirst()
        .map(this::branch)
        .orElse(false);
  }

  /** Throws {@link AccessDeniedException} (→ 403) unless {@link #upiLink(Long)} holds. */
  public void checkUpiLink(Long upiLinkId) {
    if (!upiLink(upiLinkId)) {
      throw new AccessDeniedException("No access to UPI link " + upiLinkId);
    }
  }

  /** Restaurant IDs the current user is linked to through any role. */
  @Transactional(readOnly = true)
  public Set<Long> restaurantIds() {
    // ponytail: one user lookup per check; cache per request if guard calls show up in profiles.
    return currentEmail()
        .flatMap(userRepository::findByEmailWithUserRoleRestaurants)
        .map(
            user ->
                user.getUserRoleRestaurants().stream()
                    .map(UserRoleRestaurant::getRestaurant)
                    .filter(Objects::nonNull)
                    .map(r -> r.getRestId())
                    .collect(Collectors.toSet()))
        .orElse(Set.of());
  }

  private Set<AppRole> currentRoles() {
    Authentication auth = authentication();
    if (auth == null) {
      return Set.of();
    }
    return auth.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .map(AppRole::from)
        .flatMap(Optional::stream)
        .collect(Collectors.toSet());
  }

  private Optional<String> currentEmail() {
    Authentication auth = authentication();
    return auth == null ? Optional.empty() : Optional.ofNullable(auth.getName());
  }

  private static Authentication authentication() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
      return null;
    }
    return auth;
  }
}
