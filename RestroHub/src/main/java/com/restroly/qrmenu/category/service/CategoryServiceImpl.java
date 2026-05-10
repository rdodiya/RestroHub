package com.restroly.qrmenu.category.service;

import com.restroly.qrmenu.category.dto.CategoryRequestDTO;
import com.restroly.qrmenu.category.dto.CategoryResponseDTO;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.restroly.qrmenu.category.dto.CategoryDTO;
import com.restroly.qrmenu.category.entity.Category;
import com.restroly.qrmenu.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;

	/* =======================
       CREATE CATEGORY
     ======================= */
	@Transactional
	public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO) {

		Category category = CategoryDTO.toEntity(
				CategoryDTO.builder()
						.name(requestDTO.getName())
						.description(requestDTO.getDescription())
						.isDelete(false) // default value
						.updatedDate(LocalDateTime.now())
						.build()
		);

		Category savedCategory = categoryRepository.save(category);
		return CategoryResponseDTO.fromEntity(savedCategory);
	}

	/* =======================
       GET CATEGORY BY ID
     ======================= */
	@Override
	@Transactional(readOnly = true)
	public CategoryResponseDTO getCategoryById(Long id) {

		Category category = categoryRepository.findById(id)
				.orElseThrow(() ->
						new ResourceNotFoundException("Category", "id", id));

		return CategoryResponseDTO.fromEntity(category);
	}

	/* =======================
       GET ALL CATEGORIES
     ======================= */
	@Override
	@Transactional(readOnly = true)
	public Page<CategoryResponseDTO> getAllCategories(Pageable pageable) {

		return categoryRepository.findAll(pageable)
				.map(CategoryResponseDTO::fromEntity);
	}

	/* =======================
       UPDATE CATEGORY
     ======================= */
	@Transactional
	public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO requestDTO) {

		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() ->
						new ResourceNotFoundException("Category", "id", id));

		// Update fields
		existingCategory.setName(requestDTO.getName());
		existingCategory.setDescription(requestDTO.getDescription());

		if (requestDTO.getIsDelete() != null) {
			existingCategory.setIsDelete(requestDTO.getIsDelete());
		}

		existingCategory.setUpdatedDate(LocalDateTime.now());

		Category updatedCategory = categoryRepository.save(existingCategory);
		return CategoryResponseDTO.fromEntity(updatedCategory);
	}

	/* =======================
       SOFT DELETE CATEGORY
     ======================= */
	@Override
	@Transactional
	public void deleteCategory(Long id) {

		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() ->
						new ResourceNotFoundException("Category", "id", id));

		existingCategory.setIsDelete(true);
		existingCategory.setUpdatedDate(LocalDateTime.now());

		categoryRepository.save(existingCategory);
	}
}
