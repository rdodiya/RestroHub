package com.restroly.qrmenu.reservation.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

// 2026-11-08 - Table reservation request DTO - Accept customer reservation payload from website
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {

  private Long branchId;

  private Long tableId;

  @NotBlank(message = "Customer name is required")
  @JsonAlias({"name", "customer_name"})
  private String customerName;

  @JsonAlias({"email", "customer_email"})
  private String customerEmail;

  @NotBlank(message = "Phone number is required")
  @JsonAlias({"phone", "customer_phone"})
  private String customerPhone;

  @NotBlank(message = "Reservation date is required")
  @JsonAlias({"date", "reservation_date"})
  private String reservationDate;

  @NotBlank(message = "Time slot is required")
  @JsonAlias({"time", "time_slot"})
  private String timeSlot;

  @JsonAlias({"startTime", "start_time"})
  private String startTime;

  @JsonAlias({"endTime", "end_time"})
  private String endTime;

  @JsonAlias({"timeRange", "time_range"})
  private String timeRange;

  @JsonAlias({"guests", "guests_count"})
  private Object guests;

  @JsonAlias({"requests", "special_requests"})
  private String specialRequests;

  public Integer getParsedGuestsCount() {
    if (guests == null) {
      return 2;
    }
    if (guests instanceof Number number) {
      return number.intValue();
    }
    String str = guests.toString().replaceAll("[^0-9]", "").trim();
    if (str.isEmpty()) {
      return 2;
    }
    try {
      return Integer.parseInt(str);
    } catch (NumberFormatException e) {
      return 2;
    }
  }
}
