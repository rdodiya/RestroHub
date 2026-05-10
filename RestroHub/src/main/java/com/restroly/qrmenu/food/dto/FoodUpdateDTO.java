// src/main/java/com/Restroly/qrmenu/food/dto/FoodUpdateDTO.java
package com.restroly.qrmenu.food.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Food update request payload")
public class FoodUpdateDTO {

    @NotBlank(message = "Food name is required")
    @Size(min = 2, max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @DecimalMin(value = "0.01")
    @DecimalMax(value = "9999.99")
    @Digits(integer = 4, fraction = 2)
    private BigDecimal price;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String imageUrl;

    private Boolean isAvailable;
    private Boolean isVeg;

}