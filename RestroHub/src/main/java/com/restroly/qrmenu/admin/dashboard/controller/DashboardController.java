package com.restroly.qrmenu.admin.dashboard.controller;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.admin.dashboard.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/notifications/stream/{branchId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE))
    public SseEmitter streamNotifications(@PathVariable Long branchId) {
        return dashboardService.switchOnNotificationsForBranch(branchId);
    }
}
