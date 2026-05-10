package com.restroly.qrmenu.category.dto;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.restroly.qrmenu.category.entity.Category;
import com.restroly.qrmenu.food.entity.Food;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CategoryDTO {

	private Long categoryId;
	private String name;
	private String description;
	private Boolean isDelete;
	private LocalDateTime updatedDate;
	private Date createdDate;

	@Builder.Default
	private Set<Food> foods = new HashSet<>();

	/* =======================
       Entity → DTO
     ======================= */
	public static CategoryDTO fromEntity(Category category) {
		if (category == null) return null;

		return CategoryDTO.builder()
				.categoryId(category.getCategoryId())
				.name(category.getName())
				.description(category.getDescription())
				.isDelete(category.getIsDelete())
				.updatedDate(category.getUpdatedDate())
				.foods(category.getFoods())
				.build();
	}

	/* =======================
       DTO → Entity
     ======================= */
	public static Category toEntity(CategoryDTO dto) {
		if (dto == null) return null;

		return Category.builder()
				.categoryId(dto.getCategoryId())
				.name(dto.getName())
				.description(dto.getDescription())
				.isDelete(dto.getIsDelete())
				.updatedDate(dto.getUpdatedDate())
				.foods(dto.getFoods())
				.build();
	}
}