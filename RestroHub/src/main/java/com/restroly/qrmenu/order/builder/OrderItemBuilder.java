// com/Restroly/qrmenu/order/builder/OrderItemBuilder.java
package com.restroly.qrmenu.order.builder;

import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.order.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class OrderItemBuilder {

    private Food food;
    private Integer quantity;
    private String specialRequest;

    public OrderItemBuilder() {
        reset();
    }

    public void reset() {
        this.food = null;
        this.quantity = 1;
        this.specialRequest = null;
    }

    public OrderItemBuilder withFood(Food food) {
        this.food = food;
        return this;
    }

    public OrderItemBuilder withQuantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public OrderItemBuilder withSpecialRequest(String specialRequest) {
        this.specialRequest = specialRequest;
        return this;
    }

    public OrderItem build() {
        if (food == null) {
            throw new IllegalStateException("Food item is required");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalStateException("Quantity must be greater than 0");
        }

        OrderItem item = new OrderItem();
        item.setFood(food);
        item.setQuantity(quantity);
        item.setUnitPrice(food.getPrice());
        item.setSubtotal(food.getPrice().multiply(BigDecimal.valueOf(quantity)));
        item.setSpecialRequest(specialRequest);

        reset();
        return item;
    }
}