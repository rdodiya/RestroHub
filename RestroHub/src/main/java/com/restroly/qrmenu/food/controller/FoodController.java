// src/main/java/com/Restroly/qrmenu/food/controller/FoodController.java
package com.restroly.qrmenu.food.controller;

import com.restroly.qrmenu.common.exception.ErrorResponse;
import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.food.dto.*;
import com.restroly.qrmenu.food.dto.FoodRequestDTO;
import com.restroly.qrmenu.food.dto.FoodResponseDTO;
import com.restroly.qrmenu.food.dto.FoodUpdateDTO;
import com.restroly.qrmenu.food.service.FoodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.concurrent.atomic.LongAccumulator;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION +"/foods")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Food Management", description = "APIs for managing food items in the restaurant menu")
public class FoodController {

    private final FoodService foodService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)  // ← CHANGED
//    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Create a new food item",
            description = "Creates a new food item in the menu. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Food item created successfully",
                    content = @Content(schema = @Schema(implementation = FoodResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Food item already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<FoodResponseDTO> createFood(
            @Valid @ModelAttribute FoodRequestDTO requestDTO,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        log.info("REST request to create food item: {}", requestDTO.getName());
        FoodResponseDTO response = foodService.createFood(requestDTO, image);

        URI location = URI.create("/" + ApiConstants.APP_NAME + SECURE_API_VERSION + "/foods/" + response.getFoodId());
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping(value = "/{foodId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get food item by ID",
            description = "Retrieves a food item by its unique identifier"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Food item found",
                    content = @Content(schema = @Schema(implementation = FoodResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Food item not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<FoodResponseDTO> getFoodById(
            @Parameter(description = "Long Id of the food item", required = true)
            @PathVariable Long foodId) {

        log.debug("REST request to get food by id: {}", foodId);
        FoodResponseDTO response = foodService.getFoodById(foodId);
        return ResponseEntity.ok(response);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get all food items",
            description = "Retrieves all food items with pagination and sorting support"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved food items",
                    content = @Content(schema = @Schema(implementation = PageResponseDTO.class)))
    })
    public ResponseEntity<PageResponseDTO<FoodResponseDTO>> getAllFoods(
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,

            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,

            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_FIELD) String sortBy,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to get all foods, page: {}, size: {}", page, size);

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<FoodResponseDTO> response = foodService.getAllFoods(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/available", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get available food items",
            description = "Retrieves all currently available food items"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved available food items")
    })
    public ResponseEntity<PageResponseDTO<FoodResponseDTO>> getAvailableFoods(
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_FIELD) String sortBy,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to get available foods");

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<FoodResponseDTO> response = foodService.getAvailableFoods(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/category/{category}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get food items by category",
            description = "Retrieves all food items in a specific category"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved food items")
    })
    public ResponseEntity<PageResponseDTO<FoodResponseDTO>> getFoodsByCategory(
            @Parameter(description = "Category name", required = true)
            @PathVariable Long category,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size) {

        log.debug("REST request to get foods by category: {}", category);

        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        PageResponseDTO<FoodResponseDTO> response = foodService.getFoodsByCategory(category, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Search food items",
            description = "Search food items with multiple filter criteria"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved matching food items")
    })
    public ResponseEntity<PageResponseDTO<FoodResponseDTO>> searchFoods(
            @Parameter(description = "Search by name (partial match)")
            @RequestParam(required = false) String name,

            @Parameter(description = "Filter by category")
            @RequestParam(required = false) String category,

            @Parameter(description = "Filter by availability")
            @RequestParam(required = false) Boolean isAvailable,

            @Parameter(description = "Filter by vegetarian option")
            @RequestParam(required = false) Boolean isVegetarian,

            @Parameter(description = "Minimum price")
            @RequestParam(required = false) BigDecimal minPrice,

            @Parameter(description = "Maximum price")
            @RequestParam(required = false) BigDecimal maxPrice,

            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_FIELD) String sortBy,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to search foods with filters");

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<FoodResponseDTO> response = foodService.searchFoods(
                name, category, isAvailable, isVegetarian, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get all food categories",
            description = "Retrieves a list of all distinct food categories"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved categories")
    })
    public ResponseEntity<List<String>> getAllCategories() {
        log.debug("REST request to get all food categories");
        List<String> categories = foodService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping(value = "/{foodId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Update a food item",
            description = "Updates an existing food item. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Food item updated successfully",
                    content = @Content(schema = @Schema(implementation = FoodResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Food item not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Food name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<FoodResponseDTO> updateFood(
            @Parameter(description = "UUID of the food item", required = true)
            @PathVariable Long foodId, @RequestParam(value = "image", required = false) MultipartFile image,
            @Valid @ModelAttribute FoodUpdateDTO updateDTO) {

        log.info("REST request to update food with id: {}", foodId);
        FoodResponseDTO response = foodService.updateFood(foodId, updateDTO, image);
        return ResponseEntity.ok(response);
    }

    @PatchMapping(value = "/{foodId}/{available}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Update food availability",
            description = "Updates the availability status of a food item",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Availability updated successfully"),
            @ApiResponse(responseCode = "404", description = "Food item not found")
    })
    public ResponseEntity<FoodResponseDTO> updateAvailability(
            @Parameter(description = "UUID of the food item", required = true)
            @PathVariable Long foodId,
            @Parameter(description = "Availability status", required = true)
            @PathVariable Boolean available) {

        log.info("REST request to update availability for food id: {} to: {}", foodId, available);
        FoodResponseDTO response = foodService.updateAvailability(foodId, available);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{foodId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete a food item",
            description = "Deletes a food item from the menu. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Food item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Food item not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<Void> deleteFood(
            @Parameter(description = "UUID of the food item", required = true)
            @PathVariable Long foodId) {

        log.info("REST request to delete food with id: {}", foodId);
        foodService.deleteFood(foodId);
        return ResponseEntity.noContent().build();
    }
}