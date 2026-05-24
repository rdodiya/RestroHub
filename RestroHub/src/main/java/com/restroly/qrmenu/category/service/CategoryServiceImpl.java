package com.restroly.qrmenu.category.service;

import com.restroly.qrmenu.category.dto.CategoryRequestDTO;
import com.restroly.qrmenu.category.dto.CategoryResponseDTO;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.user.exception.DuplicateResourceException;

import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;

	/* =======================
       CREATE CATEGORY
     ======================= */
	@Transactional
	public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO) {
		log.debug("Creating category with name: {}", requestDTO.getName());

		// Check for duplicate category name within the same menu
		if(categoryRepository.existsByNameIgnoreCaseAndMenu_MenuId(
				requestDTO.getName(), requestDTO.getMenuId())) {
			log.warn("Category with name '{}' already exists in menu '{}'", requestDTO.getName(), requestDTO.getMenuId());
			throw new DuplicateResourceException("Category with name '" + requestDTO.getName() + "' already exists");
		}
		Category category = CategoryDTO.toEntity(
				CategoryDTO.builder()
						.name(requestDTO.getName())
						.description(requestDTO.getDescription())
						.isDelete(false) // default value
						.updatedDate(LocalDateTime.now())
						.build()
		);

		Category savedCategory = categoryRepository.save(category);
		log.info("Category created with ID: {}", savedCategory.getCategoryId());
		return CategoryResponseDTO.fromEntity(savedCategory);
	}

	/* =======================
       GET CATEGORY BY ID
     ======================= */
	@Override
	@Transactional(readOnly = true)
	public CategoryResponseDTO getCategoryById(Long id) {
		log.debug("Fetching category with ID: {}", id);
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
		log.debug("Fetching all categories with pagination: {}", pageable);
		return categoryRepository.findAll(pageable)
				.map(CategoryResponseDTO::fromEntity);
	}

	/* =======================
       UPDATE CATEGORY
     ======================= */
	@Transactional
	public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO requestDTO) {
		log.debug("Updating category with ID: {}", id);
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
		log.info("Category updated with ID: {}", updatedCategory.getCategoryId());
		return CategoryResponseDTO.fromEntity(updatedCategory);
	}

	/* =======================
       SOFT DELETE CATEGORY
     ======================= */
	@Override
	@Transactional
	public void deleteCategory(Long id) {
		log.debug("Soft deleting category with ID: {}", id);
		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() ->
						new ResourceNotFoundException("Category", "id", id));

		existingCategory.setIsDelete(true);
		existingCategory.setUpdatedDate(LocalDateTime.now());
		log.info("Category with ID: {} marked as deleted", id);
		categoryRepository.save(existingCategory);
	}

	@Override
	@Transactional(readOnly = true)
	public Page<CategoryResponseDTO> getActiveCategories(Pageable pageable) {
		log.debug("Fetching active categories with pagination: {}", pageable);
		return categoryRepository.findByIsDeleteFalse(pageable)
				.map(CategoryResponseDTO::fromEntity);
	}
}
