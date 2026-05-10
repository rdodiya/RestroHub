package com.restroly.qrmenu.restaurant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.*;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Restaurant response payload")
public class RestaurantResponseDTO {

    @Schema(description = "Unique identifier of the restaurant", example = "1")
    private Long restId;

    @Schema(description = "Name of the restaurant", example = "Restro Hub")
    private String name;

    @Schema(description = "Description of the restaurant")
    private String description;

    @Schema(description = "Contact phone number",
            example = "+91-9876543210")
    private String phoneNumber;

    @Schema(description = "Whether the restaurant is active", example = "true")
    private Boolean isActive;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Timestamp when the restaurant was created")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Timestamp when the restaurant was last updated")
    private LocalDateTime updatedDate;
}