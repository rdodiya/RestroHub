package com.restroly.qrmenu.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class AccessGuardTest {

  @Mock private UserRepository userRepository;

  @Mock private BranchRepository branchRepository;

  @Mock private EntityManager em;

  @InjectMocks private AccessGuard access;

  @AfterEach
  void clearContext() {
    SecurityContextHolder.clearContext();
  }

  private void loginAs(String email, Long restaurantId, String... roles) {
    User user = User.builder().email(email).userRoleRestaurants(new HashSet<>()).build();
    Restaurant restaurant =
        restaurantId == null ? null : Restaurant.builder().restId(restaurantId).build();
    for (String role : roles) {
      user.getUserRoleRestaurants()
          .add(
              UserRoleRestaurant.builder()
                  .user(user)
                  .role(Role.builder().name(role).build())
                  .restaurant(restaurant)
                  .build());
    }
    lenient()
        .when(userRepository.findByEmailWithUserRoleRestaurants(email))
        .thenReturn(Optional.of(user));
    SecurityContextHolder.getContext()
        .setAuthentication(
            new UsernamePasswordAuthenticationToken(
                email,
                null,
                Arrays.stream(roles)
                    .map(r -> new SimpleGrantedAuthority(AppRole.authority(r)))
                    .toList()));
  }

  private void branchBelongsTo(long branchId, long restaurantId) {
    Branch branch =
        Branch.builder()
            .branchId(branchId)
            .restaurant(Restaurant.builder().restId(restaurantId).build())
            .build();
    lenient().when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
  }

  @Test
  void userCanAccessOwnRestaurantOnly() {
    loginAs("a@rest-a.com", 1L, "ROLE_ADMIN");

    assertTrue(access.restaurant(1L));
    assertFalse(access.restaurant(2L));
    assertFalse(access.restaurant(null));
  }

  @Test
  void userCanAccessBranchOfOwnRestaurantOnly() {
    loginAs("a@rest-a.com", 1L, "ROLE_MANAGER");
    branchBelongsTo(10L, 1L);
    branchBelongsTo(20L, 2L);

    assertTrue(access.branch(10L));
    assertFalse(access.branch(20L));
    assertFalse(access.branch(99L));
  }

  @Test
  @SuppressWarnings("unchecked")
  void orderAccessFollowsItsBranch() {
    loginAs("a@rest-a.com", 1L, "ROLE_STAFF");
    branchBelongsTo(10L, 1L);
    branchBelongsTo(20L, 2L);
    TypedQuery<Long> ownOrder = mock(TypedQuery.class);
    TypedQuery<Long> otherOrder = mock(TypedQuery.class);
    when(em.createQuery(anyString(), eq(Long.class))).thenReturn(ownOrder, otherOrder);
    when(ownOrder.setParameter("id", 100L)).thenReturn(ownOrder);
    when(ownOrder.getResultStream()).thenReturn(Stream.of(10L));
    when(otherOrder.setParameter("id", 200L)).thenReturn(otherOrder);
    when(otherOrder.getResultStream()).thenReturn(Stream.of(20L));

    assertTrue(access.order(100L));
    assertFalse(access.order(200L));
  }

  @Test
  void superAdminCanAccessAnyTenant() {
    loginAs("root@restroly.com", null, "SUPER_ADMIN");
    branchBelongsTo(20L, 2L);

    assertTrue(access.restaurant(2L));
    assertTrue(access.branch(20L));
  }

  @Test
  void anonymousUserCannotAccessAnything() {
    assertFalse(access.restaurant(1L));
    assertFalse(access.branch(10L));
    assertFalse(access.can("OPERATIONS_READ"));
  }

  @Test
  void permissionsFollowRoleMatrix() {
    loginAs("staff@rest-a.com", 1L, "ROLE_STAFF");
    assertTrue(access.can("OPERATIONS_READ"));
    assertTrue(access.can("ORDER_STATUS_UPDATE"));
    assertFalse(access.can("VIEW_FINANCIALS"));
    assertFalse(access.can("MENU_WRITE"));
    assertFalse(access.can("RESTAURANT_SETTINGS"));
  }

  @Test
  void managerUserIsReadOnlyWithoutFinancials() {
    loginAs("mu@rest-a.com", 1L, "ROLE_MANAGER_USER");
    assertTrue(access.can("OPERATIONS_READ"));
    assertFalse(access.can("ORDER_STATUS_UPDATE"));
    assertFalse(access.can("VIEW_FINANCIALS"));
    assertFalse(access.can("MENU_WRITE"));
  }

  @Test
  void managerRunsOperationsButNotSettings() {
    loginAs("m@rest-a.com", 1L, "ROLE_MANAGER");
    assertTrue(access.can("MENU_WRITE"));
    assertTrue(access.can("VIEW_FINANCIALS"));
    assertFalse(access.can("RESTAURANT_SETTINGS"));
    assertFalse(access.can("PLATFORM_ADMIN"));
  }
}
