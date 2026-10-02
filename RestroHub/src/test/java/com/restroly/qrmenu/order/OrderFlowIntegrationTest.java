package com.restroly.qrmenu.order;

import static org.assertj.core.api.Assertions.assertThat;

import com.restroly.qrmenu.common.enums.OrderSource;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderItemRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.payment.service.PaymentService;
import com.restroly.qrmenu.security.AccessGuard;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Runs the real schema (Flyway V1-V4, Hibernate {@code validate}) on PostgreSQL and checks tenant
 * isolation, the order status flow and UPI deep links. Skipped when Docker is not available.
 */
@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest
@ActiveProfiles("test")
class OrderFlowIntegrationTest {

  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

  @DynamicPropertySource
  static void db(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    r.add("spring.datasource.username", POSTGRES::getUsername);
    r.add("spring.datasource.password", POSTGRES::getPassword);
    r.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
    r.add("spring.jpa.database-platform", () -> "org.hibernate.dialect.PostgreSQLDialect");
    r.add(
        "spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.PostgreSQLDialect");
    r.add("spring.jpa.hibernate.ddl-auto", () -> "validate"); // proves V3/V4 match the entities
    r.add("spring.flyway.baseline-on-migrate", () -> "false");
  }

  @Autowired private JdbcTemplate jdbc;
  @Autowired private OrderService orderService;
  @Autowired private PaymentService paymentService;
  @Autowired private AccessGuard access;

  private long branchA;
  private long branchB;
  private long tableA;
  private long foodId;

  @BeforeEach
  void seed() {
    long restA = restaurant("Rest A");
    long restB = restaurant("Rest B");
    branchA = branch(restA, "Branch A");
    branchB = branch(restB, "Branch B");
    tableA =
        jdbc.queryForObject(
            "INSERT INTO t_table_master (branch_id, table_number, is_active) VALUES (?, 1, TRUE) RETURNING table_id",
            Long.class,
            branchA);
    long category =
        jdbc.queryForObject(
            "INSERT INTO t_category_master (name, is_delete) VALUES ('Mains', FALSE) RETURNING category_id",
            Long.class);
    foodId =
        jdbc.queryForObject(
            "INSERT INTO t_food_master (name, price, is_available, is_veg, is_delete, category_id) "
                + "VALUES ('Paneer', 150.00, TRUE, TRUE, FALSE, ?) RETURNING food_id",
            Long.class,
            category);
    long role =
        jdbc.queryForObject(
            "INSERT INTO t_role_master (role_name, is_active) VALUES ('ROLE_ADMIN', TRUE) "
                + "ON CONFLICT (role_name) DO UPDATE SET is_active = TRUE RETURNING role_id",
            Long.class);
    long user =
        jdbc.queryForObject(
            "INSERT INTO t_usr_master (user_name, user_email, user_password, is_active, is_locked) "
                + "VALUES ('Admin A', 'admin.a@it.test', 'x', TRUE, FALSE) RETURNING user_id",
            Long.class);
    jdbc.update(
        "INSERT INTO user_role_restaurant (user_id, role_id, restaurant_id) VALUES (?, ?, ?)",
        user,
        role,
        restA);
    SecurityContextHolder.getContext()
        .setAuthentication(
            new UsernamePasswordAuthenticationToken(
                "admin.a@it.test", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))));
  }

  @AfterEach
  void clean() {
    SecurityContextHolder.clearContext();
    jdbc.execute(
        "TRUNCATE t_order_items, t_order_master, t_food_master, t_category_master, t_table_master, "
            + "t_branch_master, t_address_master, user_role_restaurant, t_usr_master, t_restaurant_master "
            + "RESTART IDENTITY CASCADE");
  }

  @Test
  void crossTenantAccessIsBlocked() {
    OrderResponse order = place();

    assertThat(access.branch(branchA)).isTrue();
    assertThat(access.order(order.getOrderId())).isTrue();
    assertThat(access.branch(branchB)).isFalse();

    long orderB =
        jdbc.queryForObject(
            "INSERT INTO t_order_master (branch_id, table_id, status, payment_status, created_at) "
                + "VALUES (?, ?, 'PENDING', 'UNPAID', NOW()) RETURNING order_id",
            Long.class,
            branchB,
            tableA);
    assertThat(access.order(orderB)).isFalse();
  }

  @Test
  void orderMovesThroughStatusLifecycle() {
    OrderResponse order = place();
    assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
    assertThat(order.getOrderSource()).isEqualTo(OrderSource.STAFF);

    for (OrderStatus next :
        List.of(
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.SERVED,
            OrderStatus.COMPLETED)) {
      assertThat(orderService.updateOrderStatus(order.getOrderId(), next).getStatus())
          .isEqualTo(next);
    }
    String persisted =
        jdbc.queryForObject(
            "SELECT status FROM t_order_master WHERE order_id = ?",
            String.class,
            order.getOrderId());
    assertThat(persisted).isEqualTo("COMPLETED");
  }

  @Test
  void upiDeepLinkCarriesPayeeAndServerComputedAmount() {
    OrderResponse order = place();
    assertThat(order.getTotalAmount()).isEqualByComparingTo(new BigDecimal("300.00"));

    String link =
        paymentService.generatePaymentLink(order.getTotalAmount(), order.getOrderId(), "cafe@upi");

    assertThat(link).startsWith("upi://pay").contains("pa=cafe%40upi").contains("am=300.00");
  }

  private OrderResponse place() {
    return orderService.createOrder(
        CreateOrderRequest.builder()
            .branchId(branchA)
            .tableId(tableA)
            .items(List.of(OrderItemRequest.builder().foodId(foodId).quantity(2).build()))
            .build(),
        OrderSource.STAFF);
  }

  private long restaurant(String name) {
    return jdbc.queryForObject(
        "INSERT INTO t_restaurant_master (name, description, is_active) VALUES (?, 'd', TRUE) RETURNING rest_id",
        Long.class,
        name);
  }

  private long branch(long restaurantId, String name) {
    long address =
        jdbc.queryForObject(
            "INSERT INTO t_address_master (city, state, country, postal_code, address_line1) "
                + "VALUES ('c', 's', 'IN', '1', 'l') RETURNING address_id",
            Long.class);
    return jdbc.queryForObject(
        "INSERT INTO t_branch_master (name, is_delete, rest_id, address_id) VALUES (?, FALSE, ?, ?) RETURNING branch_id",
        Long.class,
        name,
        restaurantId,
        address);
  }
}
