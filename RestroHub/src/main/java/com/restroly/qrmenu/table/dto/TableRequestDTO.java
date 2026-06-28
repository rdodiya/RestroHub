package com.restroly.qrmenu.table.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Table creation and update request payload")
public class TableRequestDTO {

    @NotNull(message = "Table number is required")
    @Min(value = 1, message = "Table number must be greater than 0")
    private Integer tableNumber;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    @Pattern(regexp = "(?i)available|occupied|reserved",
            message = "Status must be available, occupied, or reserved")
    private String status;

    private String qrCodeUrl;

    private Boolean isActive;
}
