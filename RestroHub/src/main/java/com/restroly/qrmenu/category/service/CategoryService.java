// com/restroly/qrmenu/category/service/CategoryService.java
package com.restroly.qrmenu.category.service;

import com.restroly.qrmenu.category.dto.CategoryRequestDTO;
import com.restroly.qrmenu.category.dto.CategoryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {

	public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO);

	public CategoryResponseDTO getCategoryById(Long id) ;

	public Page<CategoryResponseDTO> getAllCategories(Pageable pageable);

	public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO requestDTO);

	public void deleteCategory(Long id);
}