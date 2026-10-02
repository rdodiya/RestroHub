package com.restroly.qrmenu.admin.dashboard.service;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardInsights;
import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.repository.OrderItemRepository;
import com.restroly.qrmenu.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

  private final OrderRepository orderRepository;
  private final OrderItemRepository orderItemRepository;

  @Override
  public DashboardInsights.Stats getStats(Long branchId, boolean includeFinancials) {
    LocalDateTime start = LocalDate.now().atStartOfDay();
    LocalDateTime end = LocalDate.now().atTime(23, 59, 59);
    OrderStatus cancelled = OrderStatus.CANCELLED;

    long orders =
        orderRepository.countByBranchBranchIdAndCreatedAtBetweenAndStatusNot(
            branchId, start, end, cancelled);
    long pending =
        orderRepository.countByBranchBranchIdAndStatusIn(branchId, List.of(OrderStatus.PENDING));
    long activeTables =
        orderRepository.countActiveTables(
            branchId,
            List.of(
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
                OrderStatus.READY,
                OrderStatus.SERVED,
                OrderStatus.BILLED));
    long unpaid = orderRepository.countUnpaid(branchId, start, end, cancelled);

    if (!includeFinancials) {
      return new DashboardInsights.Stats(orders, null, null, pending, activeTables, unpaid, null);
    }
    BigDecimal gross = orderRepository.sumGrossValue(branchId, start, end, cancelled);
    BigDecimal avg =
        orders == 0
            ? BigDecimal.ZERO
            : gross.divide(BigDecimal.valueOf(orders), 2, RoundingMode.HALF_UP);
    BigDecimal collected = orderRepository.sumVerifiedCollected(branchId, start, end);
    return new DashboardInsights.Stats(
        orders, gross, avg, pending, activeTables, unpaid, collected);
  }

  @Override
  public List<DashboardInsights.DayTrend> getTrends(
      Long branchId, int days, boolean includeFinancials) {
    LocalDate today = LocalDate.now();
    LocalDate first = today.minusDays(Math.max(days, 1) - 1L);
    // ponytail: aggregates in memory; switch to a GROUP BY date query for very high volume
    Map<LocalDate, long[]> counts = new TreeMap<>();
    Map<LocalDate, BigDecimal> sums = new TreeMap<>();
    for (LocalDate d = first; !d.isAfter(today); d = d.plusDays(1)) {
      counts.put(d, new long[1]);
      sums.put(d, BigDecimal.ZERO);
    }
    orderRepository
        .findOrdersByBranchAndDateRange(branchId, first.atStartOfDay(), today.atTime(23, 59, 59))
        .stream()
        .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
        .forEach(
            o -> {
              LocalDate d = o.getCreatedAt().toLocalDate();
              counts.get(d)[0]++;
              sums.merge(
                  d,
                  o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount(),
                  BigDecimal::add);
            });
    return counts.entrySet().stream()
        .map(
            e ->
                new DashboardInsights.DayTrend(
                    e.getKey(), e.getValue()[0], includeFinancials ? sums.get(e.getKey()) : null))
        .toList();
  }

  @Override
  public List<DashboardInsights.TopItem> getTopItems(
      Long branchId, int days, int limit, boolean includeFinancials) {
    LocalDate today = LocalDate.now();
    return orderItemRepository
        .findTopItems(
            branchId,
            today.minusDays(Math.max(days, 1) - 1L).atStartOfDay(),
            today.atTime(23, 59, 59),
            OrderStatus.CANCELLED,
            PageRequest.of(0, Math.max(limit, 1)))
        .stream()
        .map(
            r ->
                new DashboardInsights.TopItem(
                    (String) r[0],
                    ((Number) r[1]).longValue(),
                    includeFinancials ? (BigDecimal) r[2] : null))
        .toList();
  }

  @Override
  public List<DashboardStatDTO> getDashboardStats(Long branchId) {

    // Today's Date Range
    LocalDate today = LocalDate.now();
    LocalDateTime startOfDay = today.atStartOfDay();
    LocalDateTime endOfDay = today.atTime(23, 59, 59);

    BigDecimal todayRevenue;
    long liveOrders;

    // Live Orders (Active statuses)
    List<OrderStatus> activeStatuses =
        List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING);

    if (branchId == null || branchId == 0) {
      // "all" branches case
      todayRevenue = orderRepository.getTodayRevenue(startOfDay, endOfDay);
      liveOrders = orderRepository.countByStatusIn(activeStatuses);
    } else {
      todayRevenue = orderRepository.getTodayRevenueByBranch(branchId, startOfDay, endOfDay);
      liveOrders = orderRepository.countByBranchBranchIdAndStatusIn(branchId, activeStatuses);
    }

    @SuppressWarnings("deprecation")
    NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
    String formattedRevenue = formatter.format(todayRevenue);

    return List.of(
        new DashboardStatDTO(
            "Today's Revenue", formattedRevenue, null, null, null, "revenue", "green", null, null),
        new DashboardStatDTO(
            "Live Orders",
            String.valueOf(liveOrders),
            null,
            null,
            "active",
            "orders",
            "orange",
            true,
            null));
  }
}
