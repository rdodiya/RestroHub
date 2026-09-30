package com.restroly.qrmenu.admin.dashboard.service;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

  private final OrderRepository orderRepository;

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
