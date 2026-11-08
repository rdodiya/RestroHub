package com.restroly.qrmenu.reservation.dto;

import java.util.List;
import lombok.*;

// 2026-11-08 - Table reservation availability DTO - Availability response for time slots with
// 15-min gap
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationAvailabilityResponse {

  private boolean available;
  private int availableTablesCount;
  private String requestedTimeRange;
  private String message;
  private List<String> alternativeSlots;
}
