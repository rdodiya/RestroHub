package com.restroly.qrmenu.notification.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Service request response payload")
public class ServiceRequestResponseDTO {

    @Schema(description = "Unique request ID", example = "1")
    private Long id;

    @Schema(description = "Restaurant ID", example = "1")
    private Long restaurantId;

    @Schema(description = "Branch ID", example = "1")
    private Long branchId;

    @Schema(description = "Table number that made the request", example = "5")
    private Integer tableNumber;

    @Schema(description = "Type of service request", example = "CALL_WAITER")
    private String requestType;

    @Schema(description = "Current status of the request", example = "PENDING")
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "When the request was created")
    private LocalDateTime createdAt;
}
