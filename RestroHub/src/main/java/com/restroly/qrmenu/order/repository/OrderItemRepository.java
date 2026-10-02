package com.restroly.qrmenu.order.repository;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.entity.OrderItem;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

  List<OrderItem> findByOrderOrderId(Long orderId);

  /** Rows of [food name, total quantity, total revenue], best sellers first. */
  @Query(
      "SELECT i.food.name, SUM(i.quantity), SUM(i.subtotal) FROM OrderItem i "
          + "WHERE i.order.branch.branchId = :branchId AND i.order.createdAt BETWEEN :start AND :end "
          + "AND i.order.status <> :excluded GROUP BY i.food.name ORDER BY SUM(i.quantity) DESC")
  List<Object[]> findTopItems(
      @Param("branchId") Long branchId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end,
      @Param("excluded") OrderStatus excluded,
      Pageable pageable);
}
