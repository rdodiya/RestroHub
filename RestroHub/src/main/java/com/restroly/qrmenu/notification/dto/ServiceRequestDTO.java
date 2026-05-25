package com.restroly.qrmenu.notification.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Service request payload from customer")
public class ServiceRequestDTO {

    @NotNull(message = "Restaurant ID is required")
    @Schema(description = "Restaurant ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long restaurantId;

    @NotNull(message = "Branch ID is required")
    @Schema(description = "Branch ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long branchId;

    @NotNull(message = "Table number is required")
    @Min(value = 1, message = "Table number must be greater than 0")
    @Schema(description = "Table number (must be > 0, table 0 is counter)", example = "5", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer tableNumber;

    @NotNull(message = "Request type is required")
    @Schema(description = "Type of service request", example = "CALL_WAITER", requiredMode = Schema.RequiredMode.REQUIRED)
    private String requestType;
}
