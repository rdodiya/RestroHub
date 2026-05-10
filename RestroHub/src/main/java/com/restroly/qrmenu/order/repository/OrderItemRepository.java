package com.restroly.qrmenu.order.repository;

import com.restroly.qrmenu.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderOrderId(Long orderId);
//    List<OrderItem> findByOrder_OrderId(Long orderId);

}