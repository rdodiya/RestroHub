package com.restroly.qrmenu.admin.dashboard.service;


import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.repository.OrderRepository;
import com.restroly.qrmenu.order.service.OrderNotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;

    @Override
    public List<DashboardStatDTO> getDashboardStats() {

        // Today's Date Range
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        // Today's Revenue
        BigDecimal todayRevenue = orderRepository.getTodayRevenue(startOfDay, endOfDay);

        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        String formattedRevenue = formatter.format(todayRevenue);

        // Live Orders (Active statuses)
        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING
        );

        long liveOrders = orderRepository.countByStatusIn(activeStatuses);

        return List.of(
                new DashboardStatDTO(
                        "Today's Revenue",
                        formattedRevenue,
                        null,
                        null,
                        null,
                        "revenue",
                        "green",
                        null,
                        null
                ),
                new DashboardStatDTO(
                        "Live Orders",
                        String.valueOf(liveOrders),
                        null,
                        null,
                        "active",
                        "orders",
                        "orange",
                        true,
                        null
                )
        );
    }

    // @Override
    // public SseEmitter switchOnNotificationsForBranch(Long branchId) {
    //     if(branchRepository.existsById(branchId)){
    //         return notificationService.subscribe(branchId);
    //     }
    //     throw new IllegalArgumentException("Branch not found with ID: " + branchId);
    // }

}
