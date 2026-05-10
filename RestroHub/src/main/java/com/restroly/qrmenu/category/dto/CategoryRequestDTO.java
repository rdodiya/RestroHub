package com.restroly.qrmenu.category.dto; // Changed package to fit category DTO

import com.restroly.qrmenu.category.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Category creation/update request payload") // Updated schema description
public class CategoryRequestDTO {

    @NotBlank(message = "Category name is required") // Added NotBlank as category name is nullable=false in entity
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters") // Adjusted max size for category name
    @Schema(description = "Name of the category", example = "Appetizers")
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters") // Adjusted max size for description
    @Schema(description = "Detailed description of the category")
    private String description;

    @Schema(description = "Whether the category is marked for deletion (soft delete)")
    private Boolean isDelete; // Mirrors the field from the Category entity

    public static CategoryRequestDTO fromEntity(Category category) {
        if (category == null) return null;

        return CategoryRequestDTO.builder()
                .name(category.getName())
                .description(category.getDescription())
                .isDelete(category.getIsDelete())
                .build();
    }

    public static Category toEntity(CategoryRequestDTO dto) {
        if (dto == null) return null;

        return Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .isDelete(dto.getIsDelete())
                // categoryId, foods, menu, dates → handled elsewhere
                .build();
    }
}