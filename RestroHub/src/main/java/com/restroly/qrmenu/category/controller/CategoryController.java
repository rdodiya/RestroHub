// com/restroly/qrmenu/category/controller/CategoryController.java

package com.restroly.qrmenu.category.controller;

import com.restroly.qrmenu.category.dto.CategoryRequestDTO;
import com.restroly.qrmenu.category.dto.CategoryResponseDTO;
import com.restroly.qrmenu.category.service.CategoryService;
import com.restroly.qrmenu.common.dto.ApiResponse;
import com.restroly.qrmenu.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.restroly.qrmenu.category.dto.CategoryDTO;
import com.restroly.qrmenu.category.service.CategoryService;

@RestController
@RequestMapping("/secure/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;

	@PostMapping("/addCategory")
	public ResponseEntity<ApiResponse<CategoryResponseDTO>> createCategory(
			@Valid @RequestBody CategoryRequestDTO requestDTO) {
		CategoryResponseDTO createdCategory = categoryService.createCategory(requestDTO);
		return new ResponseEntity<>(ApiResponse.success(createdCategory, "Category created successfully"), HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<CategoryResponseDTO>> getCategoryById(@PathVariable Long id) {
		CategoryResponseDTO category = categoryService.getCategoryById(id);
		return ResponseEntity.ok(ApiResponse.success(category));
	}

	@GetMapping("/getallcategories")
	public ResponseEntity<ApiResponse<PagedResponse<CategoryResponseDTO>>> getAllCategories(
			@PageableDefault(page = 0, size = 10, sort = "name") Pageable pageable) {
		Page<CategoryResponseDTO> categoryPage = categoryService.getAllCategories(pageable);
		PagedResponse<CategoryResponseDTO> pagedResponse = PagedResponse.from(categoryPage);
		return ResponseEntity.ok(ApiResponse.success(pagedResponse, "Categories retrieved successfully"));
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<ApiResponse<CategoryResponseDTO>> updateCategory(
			@PathVariable Long id,
			@Valid @RequestBody CategoryRequestDTO requestDTO) {
		CategoryResponseDTO updatedCategory = categoryService.updateCategory(id, requestDTO);
		return ResponseEntity.ok(ApiResponse.success(updatedCategory, "Category updated successfully"));
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
		categoryService.deleteCategory(id);
		return ResponseEntity.ok(ApiResponse.success(null, "Category deleted (soft-deleted) successfully"));
	}
}