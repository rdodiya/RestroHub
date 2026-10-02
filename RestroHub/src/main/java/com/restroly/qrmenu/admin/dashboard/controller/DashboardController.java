package com.restroly.qrmenu.admin.dashboard.controller;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardInsights;
import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import com.restroly.qrmenu.admin.dashboard.service.DashboardService;
import com.restroly.qrmenu.security.AccessGuard;
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
  private final AccessGuard access;

  /** Today's headline numbers; amounts are omitted for roles without VIEW_FINANCIALS. */
  @GetMapping("/stats")
  @PreAuthorize("@access.can('OPERATIONS_READ') and @access.branch(#branchId)")
  public DashboardInsights.Stats getStats(@RequestParam Long branchId) {
    return dashboardService.getStats(branchId, access.can("VIEW_FINANCIALS"));
  }

  /** Orders (and gross value, if permitted) per day. */
  @GetMapping("/trends")
  @PreAuthorize("@access.can('OPERATIONS_READ') and @access.branch(#branchId)")
  public List<DashboardInsights.DayTrend> getTrends(
      @RequestParam Long branchId, @RequestParam(defaultValue = "7") int days) {
    return dashboardService.getTrends(branchId, days, access.can("VIEW_FINANCIALS"));
  }

  /** Best-selling items; revenue is omitted for roles without VIEW_FINANCIALS. */
  @GetMapping("/top-items")
  @PreAuthorize("@access.can('OPERATIONS_READ') and @access.branch(#branchId)")
  public List<DashboardInsights.TopItem> getTopItems(
      @RequestParam Long branchId,
      @RequestParam(defaultValue = "7") int days,
      @RequestParam(defaultValue = "5") int limit) {
    return dashboardService.getTopItems(branchId, days, limit, access.can("VIEW_FINANCIALS"));
  }

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
