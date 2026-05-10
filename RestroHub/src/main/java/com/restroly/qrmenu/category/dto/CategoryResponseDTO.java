package com.restroly.qrmenu.category.dto;

import com.restroly.qrmenu.category.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Category response payload")
public class CategoryResponseDTO {

    @Schema(description = "Unique identifier of the category")
    private Long categoryId;

    @Schema(description = "Name of the category")
    private String name;

    @Schema(description = "Detailed description of the category")
    private String description;

    @Schema(description = "Soft delete status")
    private Boolean isDelete;

    @Schema(description = "Last updated timestamp")
    private LocalDateTime updatedDate;

    @Schema(description = "List of Food IDs associated with this category")
    private Set<Long> foodIds;

    @Schema(description = "List of Menu IDs associated with this category")
    private Set<Long> menuIds;

    /* =======================
       Entity → Response DTO
     ======================= */
    public static CategoryResponseDTO fromEntity(Category category) {
        if (category == null) return null;

        return CategoryResponseDTO.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .isDelete(category.getIsDelete())
                .updatedDate(category.getUpdatedDate())
                .foodIds(
                        category.getFoods()
                                .stream()
                                .map(food -> food.getFoodId())   // ✅ FIX
                                .collect(Collectors.toSet())
                )
                .menuIds(
                        category.getMenu()
                                .stream()
                                .map(menu -> menu.getMenuId())   // ✅ FIX
                                .collect(Collectors.toSet())
                )
                .build();
    }

    /* =======================
      DTO → Entity (SAFE)
    ======================= */
    public static Category toEntity(CategoryResponseDTO dto) {
        if (dto == null) return null;

        return Category.builder()
                .categoryId(dto.getCategoryId())
                .name(dto.getName())
                .description(dto.getDescription())
                .isDelete(dto.getIsDelete())
                .updatedDate(dto.getUpdatedDate())
                // ⚠️ Relations must be handled in Service layer
                .foods(new HashSet<>())
                .menu(new HashSet<>())
                .build();
    }
}
