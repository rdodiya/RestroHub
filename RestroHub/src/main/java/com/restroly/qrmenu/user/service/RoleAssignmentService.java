package com.restroly.qrmenu.user.service;

import com.restroly.qrmenu.audit.entity.AuditAction;
import com.restroly.qrmenu.audit.service.AuditLogService;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.exception.DuplicateResourceException;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.security.AppRole;
import com.restroly.qrmenu.user.dto.RoleAssignmentDto;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import com.restroly.qrmenu.user.repository.UserRoleRestaurantRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Superadmin management of user + role + restaurant assignments. */
@Service
@RequiredArgsConstructor
public class RoleAssignmentService {

  private final UserRoleRestaurantRepository assignments;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final RestaurantRepository restaurantRepository;
  private final AuditLogService auditLog;

  /** Lists every assignment, newest first. */
  @Transactional(readOnly = true)
  public List<RoleAssignmentDto> list() {
    return assignments.findAllWithDetails().stream().map(this::toDto).toList();
  }

  /** Lists all restaurants as id/name pairs for the assignment form. */
  @Transactional(readOnly = true)
  public List<Map<String, Object>> restaurants() {
    return restaurantRepository.findAll().stream()
        .<Map<String, Object>>map(r -> Map.of("id", r.getRestId(), "name", r.getName()))
        .toList();
  }

  /** Grants an ADMIN, MANAGER or STAFF role for one restaurant. */
  @Transactional
  public RoleAssignmentDto assign(long userId, long restaurantId, long roleId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    Restaurant restaurant =
        restaurantRepository
            .findById(restaurantId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Restaurant not found: " + restaurantId));
    Role role =
        roleRepository
            .findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));

    AppRole appRole = AppRole.from(role.getName()).orElse(null);
    if (appRole == null || appRole == AppRole.SUPER_ADMIN) {
      throw new BusinessException("Only ADMIN, MANAGER or STAFF can be assigned to a restaurant");
    }
    if (assignments.existsByUser_UserIdAndRole_IdAndRestaurant_RestId(
        userId, roleId, restaurantId)) {
      throw new DuplicateResourceException("User already has this role for this restaurant");
    }

    UserRoleRestaurant saved =
        assignments.save(
            UserRoleRestaurant.builder().user(user).role(role).restaurant(restaurant).build());
    auditLog.record(
        AuditAction.ROLE_ASSIGNED,
        "USER",
        userId,
        restaurantId,
        Map.of("role", appRole.name(), "source", "ADMIN_PANEL"));
    return toDto(saved);
  }

  /** Revokes one assignment. */
  @Transactional
  public void revoke(long assignmentId) {
    UserRoleRestaurant urr =
        assignments
            .findById(assignmentId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Assignment not found: " + assignmentId));
    long userId = urr.getUser().getUserId();
    long restaurantId = urr.getRestaurant().getRestId();
    String role = AppRole.normalize(urr.getRole().getName());
    assignments.delete(urr);
    auditLog.record(
        AuditAction.ROLE_REMOVED,
        "USER",
        userId,
        restaurantId,
        Map.of("role", role, "source", "ADMIN_PANEL"));
  }

  private RoleAssignmentDto toDto(UserRoleRestaurant u) {
    return new RoleAssignmentDto(
        u.getId(),
        u.getUser().getUserId(),
        u.getUser().getName(),
        u.getUser().getEmail(),
        u.getRestaurant().getRestId(),
        u.getRestaurant().getName(),
        u.getRole().getId(),
        AppRole.normalize(u.getRole().getName()));
  }
}
