// com/Restroly/qrmenu/order/builder/OrderBuilder.java
package com.restroly.qrmenu.order.builder;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.entity.OrderItem;
import com.restroly.qrmenu.table.entity.Tables;
import java.util.List;

public interface OrderBuilder {
    
    OrderBuilder withBranch(Branch branch);
    
    OrderBuilder withTable(Tables table);
    
    OrderBuilder withCustomerName(String customerName);
    
    OrderBuilder withCustomerPhone(String customerPhone);
    
    OrderBuilder withSpecialInstructions(String instructions);
    
    OrderBuilder withStatus(OrderStatus status);
    
    OrderBuilder addOrderItem(OrderItem item);
    
    OrderBuilder addOrderItems(List<OrderItem> items);
    
    Order build();
    
    void reset();
}