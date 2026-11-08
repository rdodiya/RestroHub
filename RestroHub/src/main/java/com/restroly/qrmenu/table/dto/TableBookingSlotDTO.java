package com.restroly.qrmenu.table.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 2026-11-08 - Table booking slot DTO - Details of a booked time range on a table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Booked time slot on a table")
public class TableBookingSlotDTO {

  private Long reservationId;
  private String confirmationNumber;
  private String reservationDate;
  private String timeSlot;
  private String startTime;
  private String endTime;
  private String timeRange;
  private String customerName;
  private String customerPhone;
  private Integer guestsCount;
  private String status;
}
