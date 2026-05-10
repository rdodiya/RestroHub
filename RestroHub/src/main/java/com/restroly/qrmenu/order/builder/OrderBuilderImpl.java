// com/Restroly/qrmenu/order/builder/OrderBuilder.java
package com.restroly.qrmenu.order.builder;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.entity.OrderItem;
import com.restroly.qrmenu.table.entity.Tables;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class OrderBuilderImpl implements OrderBuilder {

    private Branch branch;
    private Tables table;
    private String customerName;
    private String customerPhone;
    private String specialInstructions;
    private OrderStatus status;
    private List<OrderItem> orderItems;

    public OrderBuilderImpl() {
        reset();
    }

    @Override
    public void reset() {
        this.branch = null;
        this.table = null;
        this.customerName = null;
        this.customerPhone = null;
        this.specialInstructions = null;
        this.status = OrderStatus.PENDING;
        this.orderItems = new ArrayList<>();
    }

    @Override
    public OrderBuilder withBranch(Branch branch) {
        this.branch = branch;
        return this;
    }

    @Override
    public OrderBuilder withTable(Tables table) {
        this.table = table;
        return this;
    }

    @Override
    public OrderBuilder withCustomerName(String customerName) {
        this.customerName = customerName;
        return this;
    }

    @Override
    public OrderBuilder withCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
        return this;
    }

    @Override
    public OrderBuilder withSpecialInstructions(String instructions) {
        this.specialInstructions = instructions;
        return this;
    }

    @Override
    public OrderBuilder withStatus(OrderStatus status) {
        this.status = status;
        return this;
    }

    @Override
    public OrderBuilder addOrderItem(OrderItem item) {
        this.orderItems.add(item);
        return this;
    }

    @Override
    public OrderBuilder addOrderItems(List<OrderItem> items) {
        this.orderItems.addAll(items);
        return this;
    }

    @Override
    public Order build() {
        validateOrder();

        Order order = new Order();
//        order.setBranch(this.branch);
//        order.setTable(this.table);
//        order.setCustomerName(this.customerName);
//        order.setCustomerPhone(this.customerPhone);
//        order.setSpecialInstructions(this.specialInstructions);
//        order.setStatus(this.status);
//        order.setCreatedAt(LocalDateTime.now());
//        order.setOrderItems(new ArrayList<>());
//
//        // Calculate total and set order reference in items
//        BigDecimal totalAmount = BigDecimal.ZERO;
//        
//        for (OrderItem item : this.orderItems) {
//            item.setOrder(order);
//            
//            // Calculate subtotal for each item
//            BigDecimal subtotal = item.getUnitPrice()
//                    .multiply(BigDecimal.valueOf(item.getQuantity()));
//            item.setSubtotal(subtotal);
//            
//            totalAmount = totalAmount.add(subtotal);
//            order.getOrderItems().add(item);
//        }
//        
//        order.setTotalAmount(totalAmount);
//
//        log.info("Order built successfully with {} items, total: {}", 
//                orderItems.size(), totalAmount);

        // Reset for next build
        reset();

        return order;
    }

    private void validateOrder() {
        List<String> errors = new ArrayList<>();

        if (branch == null) {
            errors.add("Branch is required");
        }
        if (table == null) {
            errors.add("Table is required");
        }
        if (orderItems.isEmpty()) {
            errors.add("At least one order item is required");
        }

        if (!errors.isEmpty()) {
            throw new IllegalStateException(
                "Invalid order: " + String.join(", ", errors)
            );
        }
    }
}