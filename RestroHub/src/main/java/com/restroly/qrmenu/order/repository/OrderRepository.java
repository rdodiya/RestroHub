// com/Restroly/qrmenu/order/repository/OrderRepository.java
package com.restroly.qrmenu.order.repository;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBranchBranchIdOrderByCreatedAtDesc(Long branchId);

    List<Order> findByBranchBranchIdAndStatus(Long branchId, OrderStatus status);

    List<Order> findByTableTableIdOrderByCreatedAtDesc(Long tableId);

    List<Order> findByTable_TableId(Long tableId);

    List<Order> findByBranch_BranchId(Long branchId);

//    List<Order> findByStatus(boolean status);
    
    @Query("SELECT o FROM Order o WHERE o.branch.branchId = :branchId " +
           "AND o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findOrdersByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Order o WHERE o.branch.branchId = :branchId " +
           "AND o.status IN :statuses ORDER BY o.createdAt DESC")
    List<Order> findActiveOrdersByBranch(
            @Param("branchId") Long branchId,
            @Param("statuses") List<OrderStatus> statuses);

    // Today's Revenue
    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.createdAt BETWEEN :start AND :end
            """)
    BigDecimal getTodayRevenue(LocalDateTime start, LocalDateTime end);

    // Live Orders Count
    long countByStatusIn(List<OrderStatus> statuses);
}