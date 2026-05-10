package com.restroly.qrmenu.restaurant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Restaurant update request payload")
public class RestaurantUpdateDTO {

    @Schema(description = "Updated name of the restaurant",
            example = "Restro Hub Deluxe")
    private String name;

    @Schema(description = "Updated description of the restaurant")
    private String description;

    @Schema(description = "Updated contact phone number",
            example = "+91-9876543210")
    private String phoneNumber;

    @Schema(description = "Whether the restaurant is active", example = "true")
    private Boolean isActive;
}
