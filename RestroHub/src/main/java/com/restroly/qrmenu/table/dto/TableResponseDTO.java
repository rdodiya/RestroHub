package com.restroly.qrmenu.table.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 2026-11-08 - Table response DTO - Include booked time ranges for the table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Table response payload")
public class TableResponseDTO {

  private Long tableId;
  private Long branchId;
  private Integer tableNumber;
  private Integer capacity;
  private String status;
  private String qrCodeUrl;
  private Boolean isActive;
  private List<TableBookingSlotDTO> bookedSlots;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime createdDate;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime updatedDate;
}
