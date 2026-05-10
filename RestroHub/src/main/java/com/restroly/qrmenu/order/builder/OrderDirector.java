// com/Restroly/qrmenu/order/builder/OrderDirector.java
package com.restroly.qrmenu.order.builder;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderItemRequest;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.entity.OrderItem;
import com.restroly.qrmenu.table.entity.Tables;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderDirector {

//
//    private final OrderBuilder orderBuilder;
//    private final OrderItemBuilder orderItemBuilder;
    private final OrderBuilder orderBuilder = null;
    private final OrderItemBuilder orderItemBuilder = new OrderItemBuilder();

    /**
     * Build a standard dine-in order
     */
    public Order buildDineInOrder(
            Branch branch,
            Tables table,
            String customerName,
            Map<Food, Integer> foodQuantities) {

        orderBuilder.reset();
        orderBuilder
                .withBranch(branch)
                .withTable(table)
                .withCustomerName(customerName)
                .withStatus(OrderStatus.PENDING);

        // Build order items
        foodQuantities.forEach((food, quantity) -> {
            OrderItem item = orderItemBuilder
                    .withFood(food)
                    .withQuantity(quantity)
                    .build();
            orderBuilder.addOrderItem(item);
        });

        return orderBuilder.build();
    }

    /**
     * Build order from request DTO
     */
    public Order buildOrderFromRequest(
            CreateOrderRequest request,
            Branch branch,
            Tables table,
            List<Food> foods) {

        orderBuilder.reset();
        orderBuilder
                .withBranch(branch)
                .withTable(table)
                .withCustomerName(request.getCustomerName())
                .withCustomerPhone(request.getCustomerPhone())
                .withSpecialInstructions(request.getSpecialInstructions())
                .withStatus(OrderStatus.PENDING);

        // Map food IDs to Food entities for lookup
        Map<Long, Food> foodMap = foods.stream()
                .collect(java.util.stream.Collectors.toMap(
                        Food::getFoodId, 
                        f -> f
                ));

        // Build order items from request
        for (OrderItemRequest itemRequest : request.getItems()) {
            Food food = foodMap.get(itemRequest.getFoodId());
            if (food != null) {
                OrderItem item = orderItemBuilder
                        .withFood(food)
                        .withQuantity(itemRequest.getQuantity())
                        .withSpecialRequest(itemRequest.getSpecialRequest())
                        .build();
                orderBuilder.addOrderItem(item);
            }
        }

        return orderBuilder.build();
    }

    /**
     * Build a quick order with minimum details
     */
    public Order buildQuickOrder(
            Branch branch, 
            Tables table, 
            List<OrderItem> items) {
        
        return orderBuilder
                .withBranch(branch)
                .withTable(table)
                .addOrderItems(items)
                .build();
    }
}