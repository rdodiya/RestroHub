package com.restroly.qrmenu.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.restroly.qrmenu.audit.service.AuditLogService;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.exception.DuplicateResourceException;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.user.dto.RoleAssignmentDto;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import com.restroly.qrmenu.user.repository.UserRoleRestaurantRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RoleAssignmentServiceTest {

  @Mock UserRoleRestaurantRepository assignments;
  @Mock UserRepository userRepository;
  @Mock RoleRepository roleRepository;
  @Mock RestaurantRepository restaurantRepository;
  @Mock AuditLogService auditLog;

  RoleAssignmentService service;

  @BeforeEach
  void setUp() {
    service =
        new RoleAssignmentService(
            assignments, userRepository, roleRepository, restaurantRepository, auditLog);
    when(userRepository.findById(1L))
        .thenReturn(Optional.of(User.builder().userId(1L).name("U").email("u@x.com").build()));
    when(restaurantRepository.findById(2L))
        .thenReturn(Optional.of(Restaurant.builder().restId(2L).name("R").build()));
  }

  private void role(String name) {
    when(roleRepository.findById(3L))
        .thenReturn(Optional.of(Role.builder().id(3L).name(name).build()));
  }

  @Test
  void assignsAdminRole() {
    role("ROLE_ADMIN");
    when(assignments.save(any(UserRoleRestaurant.class))).thenAnswer(i -> i.getArgument(0));

    RoleAssignmentDto dto = service.assign(1L, 2L, 3L);

    assertEquals("ADMIN", dto.roleName());
    assertEquals("R", dto.restaurantName());
  }

  @Test
  void rejectsSuperAdminAndLegacyRoles() {
    role("ROLE_SUPER_ADMIN");
    assertThrows(BusinessException.class, () -> service.assign(1L, 2L, 3L));
    role("ROLE_RESTAURANT_OWNER");
    assertThrows(BusinessException.class, () -> service.assign(1L, 2L, 3L));
    verify(assignments, never()).save(any());
  }

  @Test
  void rejectsDuplicate() {
    role("ROLE_MANAGER");
    when(assignments.existsByUser_UserIdAndRole_IdAndRestaurant_RestId(1L, 3L, 2L))
        .thenReturn(true);
    assertThrows(DuplicateResourceException.class, () -> service.assign(1L, 2L, 3L));
  }
}
