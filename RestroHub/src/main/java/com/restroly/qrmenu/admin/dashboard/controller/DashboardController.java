package com.restroly.qrmenu.admin.dashboard.controller;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.admin.dashboard.service.DashboardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secure/api/v1/dashboard")
@CrossOrigin(origins = "*") // adjust for production
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;

  @GetMapping("/statistics")
  @PreAuthorize("@access.can('PLATFORM_ADMIN')") // all branches, all tenants: platform only
  public List<DashboardStatDTO> getStatistics() {
    return dashboardService.getDashboardStats(0L); // 0L represents "all" branches
  }

  @GetMapping("/statistics/{branchId}")
  @PreAuthorize("@access.can('VIEW_FINANCIALS') and @access.branch(#branchId)")
  public List<DashboardStatDTO> getStatistics(@PathVariable Long branchId) {
    return dashboardService.getDashboardStats(branchId);
  }
}
