package com.restroly.qrmenu.food.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Food creation request payload")
public class FoodRequestDTO {

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