package com.restroly.qrmenu.admin.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Response shapes for the order dashboard; money fields are null (omitted) without VIEW_FINANCIALS.
 */
public final class DashboardInsights {

  private DashboardInsights() {}

  /** Today's headline numbers for a branch. */
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record Stats(
      long todaysOrders,
      BigDecimal grossOrderValue,
      BigDecimal avgOrderValue,
      long pendingOrders,
      long activeTables,
      long unpaidCount,
      BigDecimal verifiedCollectedAmount) {}

  /** One day of the sales trend. */
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record DayTrend(LocalDate date, long orders, BigDecimal grossOrderValue) {}

  /** A best-selling item. */
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record TopItem(String name, long quantity, BigDecimal revenue) {}
}
