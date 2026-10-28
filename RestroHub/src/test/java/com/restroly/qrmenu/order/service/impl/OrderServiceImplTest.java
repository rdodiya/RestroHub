package com.restroly.qrmenu.order.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.common.enums.OrderSource;
import com.restroly.qrmenu.exception.ValidationException;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.food.repository.FoodRepository;
import com.restroly.qrmenu.order.builder.OrderDirector;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderItemRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.mapper.OrderMapper;
import com.restroly.qrmenu.order.repository.OrderRepository;
import com.restroly.qrmenu.order.service.OrderEventPublisher;
import com.restroly.qrmenu.order.service.OrderNotificationService;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

  @Mock private OrderRepository orderRepository;
  @Mock private BranchRepository branchRepository;
  @Mock private TablesRepository tableRepository;
  @Mock private FoodRepository foodRepository;
  @Mock private OrderNotificationService notificationService;
  @Mock private OrderEventPublisher eventPublisher;
  @Mock private OrderDirector orderDirector;
  @Mock private OrderMapper orderMapper;

  @InjectMocks private OrderServiceImpl orderService;

  private Branch branch;
  private Tables table;
  private Food food1;

  @BeforeEach
  void setUp() {
    branch = Branch.builder().branchId(10L).branchUpiId("test@upi").build();
    table = Tables.builder().tableId(20L).branch(branch).tableNumber(5).isActive(true).build();
    food1 =
        Food.builder()
            .foodId(100L)
            .name("Pizza")
            .price(new BigDecimal("250.00"))
            .isAvailable(true)
            .build();
  }

  @Test
  void createOrder_allowsMultipleCustomizationsOfSameFood() {
    CreateOrderRequest request =
        CreateOrderRequest.builder()
            .branchId(10L)
            .tableId(20L)
            .items(
                List.of(
                    OrderItemRequest.builder()
                        .foodId(100L)
                        .quantity(1)
                        .specialRequest("No onion")
                        .build(),
                    OrderItemRequest.builder()
                        .foodId(100L)
                        .quantity(2)
                        .specialRequest("Extra cheese")
                        .build()))
            .build();

    when(branchRepository.findByBranchIdAndIsDeleteFalse(10L)).thenReturn(Optional.of(branch));
    when(tableRepository.findByTableIdAndIsActiveTrue(20L)).thenReturn(Optional.of(table));
    when(foodRepository.findByFoodIdInAndIsDeleteFalse(List.of(100L, 100L)))
        .thenReturn(List.of(food1));

    Order order = new Order();
    order.setOrderId(1L);
    when(orderDirector.buildOrderFromRequest(request, branch, table, List.of(food1)))
        .thenReturn(order);
    when(orderRepository.save(any(Order.class))).thenReturn(order);
    when(orderMapper.toResponse(order)).thenReturn(OrderResponse.builder().orderId(1L).build());

    OrderResponse response = orderService.createOrder(request);

    assertThat(response).isNotNull();
    assertThat(response.getOrderId()).isEqualTo(1L);
    verify(orderRepository).save(any(Order.class));
  }

  @Test
  void createOrder_throwsValidationException_whenTableBelongsToDifferentBranch() {
    Branch otherBranch = Branch.builder().branchId(99L).build();
    Tables wrongTable =
        Tables.builder().tableId(20L).branch(otherBranch).tableNumber(5).isActive(true).build();

    CreateOrderRequest request =
        CreateOrderRequest.builder()
            .branchId(10L)
            .tableId(20L)
            .items(List.of(OrderItemRequest.builder().foodId(100L).quantity(1).build()))
            .build();

    when(branchRepository.findByBranchIdAndIsDeleteFalse(10L)).thenReturn(Optional.of(branch));
    when(tableRepository.findByTableIdAndIsActiveTrue(20L)).thenReturn(Optional.of(wrongTable));

    assertThatThrownBy(() -> orderService.createOrder(request))
        .isInstanceOf(ValidationException.class)
        .hasMessageContaining("Table does not belong to the specified branch");
  }

  @Test
  void createOrder_throwsValidationException_whenFoodIsUnavailable() {
    Food unavailableFood =
        Food.builder()
            .foodId(100L)
            .name("Pizza")
            .price(new BigDecimal("250.00"))
            .isAvailable(false)
            .build();

    CreateOrderRequest request =
        CreateOrderRequest.builder()
            .branchId(10L)
            .tableId(20L)
            .items(List.of(OrderItemRequest.builder().foodId(100L).quantity(1).build()))
            .build();

    when(branchRepository.findByBranchIdAndIsDeleteFalse(10L)).thenReturn(Optional.of(branch));
    when(tableRepository.findByTableIdAndIsActiveTrue(20L)).thenReturn(Optional.of(table));
    when(foodRepository.findByFoodIdInAndIsDeleteFalse(List.of(100L)))
        .thenReturn(List.of(unavailableFood));

    assertThatThrownBy(() -> orderService.createOrder(request))
        .isInstanceOf(ValidationException.class)
        .hasMessageContaining("currently unavailable");
  }

  @Test
  void createOrder_handlesCounterTableWhenTableIdZero() {
    Tables counterTable =
        Tables.builder().tableId(55L).branch(branch).tableNumber(0).isActive(true).build();

    CreateOrderRequest request =
        CreateOrderRequest.builder()
            .branchId(10L)
            .tableId(0L)
            .items(List.of(OrderItemRequest.builder().foodId(100L).quantity(1).build()))
            .build();

    when(branchRepository.findByBranchIdAndIsDeleteFalse(10L)).thenReturn(Optional.of(branch));
    when(tableRepository.findByBranch_BranchIdAndTableNumber(10L, 0))
        .thenReturn(Optional.of(counterTable));
    when(foodRepository.findByFoodIdInAndIsDeleteFalse(List.of(100L))).thenReturn(List.of(food1));

    Order order = new Order();
    order.setOrderId(2L);
    when(orderDirector.buildOrderFromRequest(request, branch, counterTable, List.of(food1)))
        .thenReturn(order);
    when(orderRepository.save(any(Order.class))).thenReturn(order);
    when(orderMapper.toResponse(order))
        .thenReturn(
            OrderResponse.builder().orderId(2L).orderSource(OrderSource.COUNTER_QR).build());

    OrderResponse response = orderService.createOrder(request);

    assertThat(response).isNotNull();
    assertThat(response.getOrderId()).isEqualTo(2L);
    assertThat(order.getOrderSource()).isEqualTo(OrderSource.COUNTER_QR);
  }
}
