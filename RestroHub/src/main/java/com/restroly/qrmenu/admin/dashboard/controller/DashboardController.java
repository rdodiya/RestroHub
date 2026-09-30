package com.restroly.qrmenu.admin.dashboard.controller;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.admin.dashboard.service.DashboardService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secure/api/v1/dashboard")
@CrossOrigin(origins = "*") // adjust for production
public class DashboardController {

  @Autowired private DashboardService dashboardService;

  @GetMapping("/statistics")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public List<DashboardStatDTO> getStatistics() {
    return dashboardService.getDashboardStats(0L); // 0L represents "all" branches
  }

  @GetMapping("/statistics/{branchId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public List<DashboardStatDTO> getStatistics(@PathVariable Long branchId) {
    return dashboardService.getDashboardStats(branchId);
  }
}
