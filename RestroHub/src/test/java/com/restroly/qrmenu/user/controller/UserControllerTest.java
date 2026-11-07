package com.restroly.qrmenu.user.controller;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.service.UserService;
import java.util.Collections;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

class UserControllerTest {

  private final UserService userService = mock(UserService.class);
  private final UserController userController = new UserController(userService);

  @BeforeEach
  void setUp() {
    SecurityContextHolder.getContext()
        .setAuthentication(
            new UsernamePasswordAuthenticationToken(
                "test@restroly.com", "password", Collections.emptyList()));
  }

  @AfterEach
  void tearDown() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void fetchRestaurantIdHandlesUserWithoutRestaurantSafely() {
    // 2026-11-07 - Verify no NullPointerException when user has no restaurant or branches
    User user =
        User.builder()
            .email("test@restroly.com")
            .userRoleRestaurants(Collections.emptySet())
            .build();
    when(userService.getUserByEmailEntity("test@restroly.com")).thenReturn(user);

    ResponseEntity<Map<String, Object>> response =
        assertDoesNotThrow(() -> userController.fetchRestaurantId());

    assertEquals(200, response.getStatusCode().value());
    Map<String, Object> body = response.getBody();
    assertTrue((Boolean) body.get("success"));
    assertNull(body.get("restaurantId"));
    assertNull(body.get("branchId"));
  }
}
