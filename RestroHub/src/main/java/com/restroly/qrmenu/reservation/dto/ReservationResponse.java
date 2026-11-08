package com.restroly.qrmenu.reservation.dto;

import java.time.LocalDateTime;
import lombok.*;

// 2026-11-08 - Table reservation response DTO - Return reservation confirmation and table info
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {

  private boolean success;
  private String message;
  private String confirmationNumber;
  private Long reservationId;
  private Long branchId;
  private Long tableId;
  private Integer tableNumber;
  private String customerName;
  private String customerEmail;
  private String customerPhone;
  private String reservationDate;
  private String timeSlot;
  private Integer guestsCount;
  private String specialRequests;
  private String status;
  private LocalDateTime createdAt;
}
