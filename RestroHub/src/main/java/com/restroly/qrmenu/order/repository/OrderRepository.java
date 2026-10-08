// com/Restroly/qrmenu/order/repository/OrderRepository.java
package com.restroly.qrmenu.order.repository;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository
    extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

  List<Order> findByBranchBranchIdOrderByCreatedAtDesc(Long branchId);

  Optional<Order> findByIdempotencyKey(String idempotencyKey);

  List<Order> findByBranchBranchIdAndStatus(Long branchId, OrderStatus status);

  List<Order> findByTableTableIdOrderByCreatedAtDesc(Long tableId);

  List<Order> findByTable_TableId(Long tableId);

  List<Order> findByBranch_BranchId(Long branchId);

  //    List<Order> findByStatus(boolean status);

  @Query(
      "SELECT o FROM Order o WHERE o.branch.branchId = :branchId "
          + "AND o.createdAt BETWEEN :startDate AND :endDate")
  List<Order> findOrdersByBranchAndDateRange(
      @Param("branchId") Long branchId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  @Query(
      "SELECT o FROM Order o WHERE o.branch.branchId = :branchId "
          + "AND o.status IN :statuses ORDER BY o.createdAt DESC")
  List<Order> findActiveOrdersByBranch(
      @Param("branchId") Long branchId, @Param("statuses") List<OrderStatus> statuses);

  // Today's Revenue
  @Query(
      """
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.createdAt BETWEEN :start AND :end
            """)
  BigDecimal getTodayRevenue(LocalDateTime start, LocalDateTime end);

  // Today's Revenue By Branch
  @Query(
      """
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.branch.branchId = :branchId AND o.createdAt BETWEEN :start AND :end
            """)
  BigDecimal getTodayRevenueByBranch(
      @Param("branchId") Long branchId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  // Live Orders Count
  long countByStatusIn(List<OrderStatus> statuses);

  // Live Orders Count by Branch
  long countByBranchBranchIdAndStatusIn(Long branchId, List<OrderStatus> statuses);

  // ---- Dashboard v2 (branch-scoped, cancelled orders excluded) ----

  long countByBranchBranchIdAndCreatedAtBetweenAndStatusNot(
      Long branchId, LocalDateTime start, LocalDateTime end, OrderStatus excluded);

  @Query(
      "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.branch.branchId = :branchId "
          + "AND o.createdAt BETWEEN :start AND :end AND o.status <> :excluded")
  BigDecimal sumGrossValue(
      @Param("branchId") Long branchId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end,
      @Param("excluded") OrderStatus excluded);

  @Query(
      "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.branch.branchId = :branchId "
          + "AND o.createdAt BETWEEN :start AND :end AND o.paymentStatus = "
          + "com.restroly.qrmenu.common.enums.OrderPaymentStatus.VERIFIED_BY_STAFF")
  BigDecimal sumVerifiedCollected(
      @Param("branchId") Long branchId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  @Query(
      "SELECT COUNT(o) FROM Order o WHERE o.branch.branchId = :branchId "
          + "AND o.createdAt BETWEEN :start AND :end AND o.status <> :excluded "
          + "AND (o.paymentStatus IS NULL OR o.paymentStatus = "
          + "com.restroly.qrmenu.common.enums.OrderPaymentStatus.UNPAID)")
  long countUnpaid(
      @Param("branchId") Long branchId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end,
      @Param("excluded") OrderStatus excluded);

  @Query(
      "SELECT COUNT(DISTINCT o.table.tableId) FROM Order o WHERE o.branch.branchId = :branchId "
          + "AND o.status IN :statuses")
  long countActiveTables(
      @Param("branchId") Long branchId, @Param("statuses") List<OrderStatus> statuses);
}
