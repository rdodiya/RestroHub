package com.restroly.qrmenu.admin.dashboard.controller;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.admin.dashboard.service.DashboardService;
import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.branch.dto.BranchResponseDTO.RestaurantDTO;
import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.service.BranchService;
import com.restroly.qrmenu.order.service.OrderNotificationService;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.service.RestaurantService;

import org.apache.commons.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/secure/api/v1/dashboard")
@CrossOrigin(origins = "*") // adjust for production
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/statistics")
    public List<DashboardStatDTO> getStatistics() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/notifications/stream/{branchId}")
    public SseEmitter streamNotifications(@PathVariable Long branchId) {
        return dashboardService.switchOnNotificationsForBranch(branchId);
    }
}