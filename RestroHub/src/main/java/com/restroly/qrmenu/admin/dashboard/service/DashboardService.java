package com.restroly.qrmenu.admin.dashboard.service;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardInsights;
import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;
import java.util.List;

public interface DashboardService {

  List<DashboardStatDTO> getDashboardStats(Long branchId);

  /** Today's stats for a branch; money fields are null unless includeFinancials. */
  DashboardInsights.Stats getStats(Long branchId, boolean includeFinancials);

  /** Orders and gross value per day for the last {@code days} days (oldest first). */
  List<DashboardInsights.DayTrend> getTrends(Long branchId, int days, boolean includeFinancials);

  /** Best-selling items over the last {@code days} days. */
  List<DashboardInsights.TopItem> getTopItems(
      Long branchId, int days, int limit, boolean includeFinancials);
}
