// src/main/java/com/Restroly/qrmenu/food/dto/FoodResponseDTO.java
package com.restroly.qrmenu.food.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Food item response payload")
public class FoodResponseDTO {

    @Schema(description = "Unique identifier of the food item",
            example = "1")
    private Long foodId;

    @Schema(description = "Name of the food item", example = "Margherita Pizza")
    private String name;

    @Schema(description = "Detailed description of the food item")
    private String description;

    @Schema(description = "Price of the food item", example = "12.99")
    private BigDecimal price;

    @Schema(description = "Category of the food item", example = "Pizza")
    private Long categoryId;

    @Schema(description = "URL of the food item image")
    private String imageUrl;

    @Schema(description = "Whether the food item is currently available", example = "true")
    private Boolean isAvailable;

    @Schema(description = "Whether the food item is vegetarian", example = "true")
    private Boolean isVegetarian;

    @Schema(description = "Whether the food item is veg", example = "false")
    private Boolean isVeg;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Timestamp when the food item was created")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Timestamp when the food item was last updated")
    private LocalDateTime updatedAt;
}