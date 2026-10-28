package com.restroly.qrmenu.order.builder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.exception.ValidationException;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.table.entity.Tables;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OrderBuilderImplTest {

  private OrderBuilderImpl orderBuilder;

  @BeforeEach
  void setUp() {
    orderBuilder = new OrderBuilderImpl();
  }

  @Test
  void build_throwsValidationException_whenBranchOrTableOrItemsMissing() {
    assertThatThrownBy(() -> orderBuilder.build())
        .isInstanceOf(ValidationException.class)
        .hasMessageContaining("Branch is required")
        .hasMessageContaining("Table is required")
        .hasMessageContaining("At least one order item is required");
  }

  @Test
  void build_succeeds_whenAllRequiredFieldsPresent() {
    Branch branch = Branch.builder().branchId(1L).build();
    Tables table = Tables.builder().tableId(2L).tableNumber(1).build();
    Food food =
        Food.builder()
            .foodId(3L)
            .name("Burger")
            .price(new BigDecimal("120.00"))
            .isAvailable(true)
            .build();
    com.restroly.qrmenu.order.entity.OrderItem item =
        com.restroly.qrmenu.order.entity.OrderItem.builder()
            .food(food)
            .quantity(2)
            .unitPrice(food.getPrice())
            .build();

    Order order = orderBuilder.withBranch(branch).withTable(table).addOrderItem(item).build();

    assertThat(order).isNotNull();
    assertThat(order.getBranch()).isEqualTo(branch);
    assertThat(order.getTable()).isEqualTo(table);
    assertThat(order.getOrderItems()).hasSize(1);
    assertThat(order.getTotalAmount()).isEqualByComparingTo(new BigDecimal("240.00"));
  }
}
