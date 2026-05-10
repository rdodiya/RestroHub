package com.restroly.qrmenu.food.dto;

import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.food.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FoodMapper {

    // ─────────────────────────────────────────────
    // 1. FoodRequestDTO → Food Entity (CREATE)
    // ─────────────────────────────────────────────
    public Food toEntity(FoodRequestDTO dto) {
        if (dto == null) return null;

        return Food.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .isVeg(dto.getIsVeg() != null ? dto.getIsVeg() : true)
                .isDelete(false)
                .build();
        // Note: Category is set in Service layer, NOT here
    }

    // ─────────────────────────────────────────────
    // 2. Food Entity → FoodResponseDTO
    // ─────────────────────────────────────────────
    public FoodResponseDTO toResponseDTO(Food food) {
        if (food == null) return null;

        return FoodResponseDTO.builder()
                .foodId(food.getFoodId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .imageUrl(food.getImageUrl())
                .isAvailable(food.getIsAvailable())
                .isVeg(food.getIsVeg())
                .createdAt(food.getDateCreated())
                .updatedAt(food.getUpdatedDate())
                .categoryId(
                        food.getCategory() != null
                                ? food.getCategory().getCategoryId()
                                : null
                )
                .build();
    }

    // ─────────────────────────────────────────────
    // 3. Page<Food> → PageResponseDTO<FoodResponseDTO>
    // ─────────────────────────────────────────────
    public PageResponseDTO<FoodResponseDTO> toPageResponseDTO(Page<Food> foodPage) {
        if (foodPage == null) return null;

        List<FoodResponseDTO> content = foodPage.getContent()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

        return PageResponseDTO.<FoodResponseDTO>builder()
                .content(content)
                .pageNumber(foodPage.getNumber())
                .pageSize(foodPage.getSize())
                .totalElements(foodPage.getTotalElements())
                .totalPages(foodPage.getTotalPages())
                .first(foodPage.isFirst())
                .last(foodPage.isLast())
                .build();
    }

    // ─────────────────────────────────────────────
    // 4. FoodUpdateDTO → Update existing Food Entity (PATCH-style)
    //    Only updates fields that are NOT null
    // ─────────────────────────────────────────────
    public void updateEntityFromDTO(FoodUpdateDTO dto, Food food) {
        if (dto == null || food == null) return;

        if (dto.getName() != null) {
            food.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            food.setDescription(dto.getDescription());
        }

        if (dto.getPrice() != null) {
            food.setPrice(dto.getPrice());
        }

        if (dto.getImageUrl() != null) {
            food.setImageUrl(dto.getImageUrl());
        }

        if (dto.getIsAvailable() != null) {
            food.setIsAvailable(dto.getIsAvailable());
        }

        if (dto.getIsVeg() != null) {
            food.setIsVeg(dto.getIsVeg());
        }

        // Note: Category update from FoodUpdateDTO uses String 'category' field
        // If you need category updates, handle it in the Service layer
        // by looking up the Category entity from the repository
    }
}