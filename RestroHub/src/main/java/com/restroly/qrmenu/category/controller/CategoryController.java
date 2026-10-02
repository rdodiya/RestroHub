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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secure/api/v1/categories")
@RequiredArgsConstructor
// ponytail: role check only — Category/Food have no restaurant owner yet, so they are not
// tenant-scoped.
// Add a restaurant FK + backfill once the owner confirms the model (PRD §8 Open Questions).
public class CategoryController {

  private final CategoryService categoryService;

  @PostMapping("/addCategory")
  @PreAuthorize("@access.can('MENU_WRITE')")
  public ResponseEntity<ApiResponse<CategoryResponseDTO>> createCategory(
      @Valid @RequestBody CategoryRequestDTO requestDTO) {
    CategoryResponseDTO createdCategory = categoryService.createCategory(requestDTO);
    return new ResponseEntity<>(
        ApiResponse.success(createdCategory, "Category created successfully"), HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  @PreAuthorize("@access.can('OPERATIONS_READ')")
  public ResponseEntity<ApiResponse<CategoryResponseDTO>> getCategoryById(@PathVariable Long id) {
    CategoryResponseDTO category = categoryService.getCategoryById(id);
    return ResponseEntity.ok(ApiResponse.success(category));
  }

  @GetMapping("/getallcategories")
  @PreAuthorize("@access.can('OPERATIONS_READ')")
  public ResponseEntity<ApiResponse<PagedResponse<CategoryResponseDTO>>> getAllCategories(
      @PageableDefault(page = 0, size = 10, sort = "name") Pageable pageable) {
    Page<CategoryResponseDTO> categoryPage = categoryService.getAllCategories(pageable);
    PagedResponse<CategoryResponseDTO> pagedResponse = PagedResponse.from(categoryPage);
    return ResponseEntity.ok(
        ApiResponse.success(pagedResponse, "Categories retrieved successfully"));
  }

  @PutMapping("/update/{id}")
  @PreAuthorize("@access.can('MENU_WRITE')")
  public ResponseEntity<ApiResponse<CategoryResponseDTO>> updateCategory(
      @PathVariable Long id, @Valid @RequestBody CategoryRequestDTO requestDTO) {
    CategoryResponseDTO updatedCategory = categoryService.updateCategory(id, requestDTO);
    return ResponseEntity.ok(ApiResponse.success(updatedCategory, "Category updated successfully"));
  }

  @DeleteMapping("/delete/{id}")
  @PreAuthorize("@access.can('MENU_WRITE')")
  public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
    categoryService.deleteCategory(id);
    return ResponseEntity.ok(
        ApiResponse.success(null, "Category deleted (soft-deleted) successfully"));
  }

  @PutMapping("/restore/{id}")
  @PreAuthorize("@access.can('MENU_WRITE')")
  public ResponseEntity<ApiResponse<CategoryResponseDTO>> restoreCategory(@PathVariable Long id) {
    CategoryResponseDTO restored = categoryService.restoreCategory(id);
    return ResponseEntity.ok(ApiResponse.success(restored, "Category restored successfully"));
  }

  @GetMapping("/activecategories")
  @PreAuthorize("@access.can('OPERATIONS_READ')")
  public ResponseEntity<ApiResponse<PagedResponse<CategoryResponseDTO>>> getActiveCategories(
      @PageableDefault(page = 0, size = 10, sort = "name") Pageable pageable) {
    Page<CategoryResponseDTO> categoryPage = categoryService.getActiveCategories(pageable);
    PagedResponse<CategoryResponseDTO> pagedResponse = PagedResponse.from(categoryPage);
    return ResponseEntity.ok(
        ApiResponse.success(pagedResponse, "Active categories retrieved successfully"));
  }
}
