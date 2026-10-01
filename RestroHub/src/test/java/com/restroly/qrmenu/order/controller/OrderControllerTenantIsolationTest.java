package com.restroly.qrmenu.order.controller;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.config.SecurityConfig;
import com.restroly.qrmenu.order.dto.OrderItemResponse;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.payment.service.PaymentService;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.security.AccessGuard;
import com.restroly.qrmenu.security.JwtTokenProvider;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.UserRepository;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Proves the @PreAuthorize tenant guards are wired: a user of restaurant 1 cannot read branch 20
 * (restaurant 2), and roles without VIEW_FINANCIALS get orders without amounts.
 */
@WebMvcTest(OrderController.class)
@Import({SecurityConfig.class, AccessGuard.class})
class OrderControllerTenantIsolationTest {

  private static final String OWN_BRANCH = "/secure/api/v1/orders/branch/10";
  private static final String OTHER_TENANT_BRANCH = "/secure/api/v1/orders/branch/20";

  @Autowired private MockMvc mvc;

  @MockBean private OrderService orderService;
  @MockBean private PaymentService paymentService;
  @MockBean private WhatsappOrderNotificationService whatsapp;
  @MockBean private JwtTokenProvider jwtTokenProvider;
  @MockBean private UserDetailsService userDetailsService;
  @MockBean private UserRepository userRepository;
  @MockBean private BranchRepository branchRepository;
  @MockBean private EntityManager entityManager;

  @BeforeEach
  void tenants() {
    branch(10L, 1L);
    branch(20L, 2L);
    linkToRestaurant1("admin@rest-a.com", "ROLE_ADMIN");
    linkToRestaurant1("mu@rest-a.com", "ROLE_MANAGER_USER");

    OrderItemResponse item =
        OrderItemResponse.builder()
            .foodId(5L)
            .foodName("Paneer Tikka")
            .quantity(2)
            .unitPrice(new BigDecimal("150.00"))
            .subtotal(new BigDecimal("300.00"))
            .build();
    when(orderService.getOrdersByBranch(10L))
        .thenAnswer(
            inv ->
                List.of(
                    OrderResponse.builder()
                        .orderId(100L)
                        .branchId(10L)
                        .totalAmount(new BigDecimal("300.00"))
                        .paymentLink("upi://pay?pa=rest@upi")
                        .items(new java.util.ArrayList<>(List.of(item)))
                        .build()));
  }

  @Test
  @WithMockUser(username = "admin@rest-a.com", roles = "ADMIN")
  void adminReadsOwnBranchWithAmounts() throws Exception {
    mvc.perform(get(OWN_BRANCH))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].orderId").value(100))
        .andExpect(jsonPath("$[0].totalAmount").value(300.00));
  }

  @Test
  @WithMockUser(username = "admin@rest-a.com", roles = "ADMIN")
  void adminCannotReadAnotherRestaurantsBranch() throws Exception {
    mvc.perform(get(OTHER_TENANT_BRANCH)).andExpect(status().isForbidden());
    verify(orderService, never()).getOrdersByBranch(anyLong());
  }

  @Test
  @WithMockUser(username = "mu@rest-a.com", roles = "MANAGER_USER")
  void managerUserGetsOrdersWithoutFinancialFields() throws Exception {
    mvc.perform(get(OWN_BRANCH))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].orderId").value(100))
        .andExpect(jsonPath("$[0].totalAmount").doesNotExist())
        .andExpect(jsonPath("$[0].paymentLink").doesNotExist())
        .andExpect(jsonPath("$[0].items[0].unitPrice").doesNotExist())
        .andExpect(jsonPath("$[0].items[0].subtotal").doesNotExist());
  }

  @Test
  void anonymousIsRejected() throws Exception {
    mvc.perform(get(OWN_BRANCH)).andExpect(status().is4xxClientError());
    verify(orderService, never()).getOrdersByBranch(anyLong());
  }

  private void branch(long branchId, long restaurantId) {
    when(branchRepository.findById(branchId))
        .thenReturn(
            Optional.of(
                Branch.builder()
                    .branchId(branchId)
                    .restaurant(Restaurant.builder().restId(restaurantId).build())
                    .build()));
  }

  private void linkToRestaurant1(String email, String role) {
    User user = User.builder().email(email).userRoleRestaurants(new HashSet<>()).build();
    user.getUserRoleRestaurants()
        .add(
            UserRoleRestaurant.builder()
                .user(user)
                .role(Role.builder().name(role).build())
                .restaurant(Restaurant.builder().restId(1L).build())
                .build());
    when(userRepository.findByEmailWithUserRoleRestaurants(email)).thenReturn(Optional.of(user));
  }
}
