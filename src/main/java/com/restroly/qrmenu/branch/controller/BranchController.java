package com.restroly.qrmenu.branch.controller;

import com.restroly.qrmenu.branch.dto.BranchRequestDTO;
import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.branch.service.BranchService;
import com.restroly.qrmenu.common.exception.ErrorResponse;
import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.common.util.ApiConstants;

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

import java.net.URI;
import java.util.List;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/branches")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Branch Management", description = "APIs for managing restaurant branches")
public class BranchController {

    private final BranchService branchService;

    // ========== CREATE ==========
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Create a new branch",
            description = "Creates a new branch for a restaurant. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Branch created successfully",
                    content = @Content(schema = @Schema(implementation = BranchResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Branch name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<BranchResponseDTO> createBranch(
            @Valid @RequestBody BranchRequestDTO requestDTO) {

        log.info("REST request to create branch: {}", requestDTO.getName());
        BranchResponseDTO response = branchService.createBranch(requestDTO);

        URI location = URI.create("/" + ApiConstants.APP_NAME + SECURE_API_VERSION +
                "/branches/" + response.getBranchId());
        return ResponseEntity.created(location).body(response);
    }

    // ========== GET BY ID ==========
    @GetMapping(value = "/{branchId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get branch by ID",
            description = "Retrieves a branch by its unique identifier"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Branch found",
                    content = @Content(schema = @Schema(implementation = BranchResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Branch not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<BranchResponseDTO> getBranchById(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.debug("REST request to get branch by id: {}", branchId);
        BranchResponseDTO response = branchService.getBranchById(branchId);
        return ResponseEntity.ok(response);
    }

    // ========== GET ALL (Paginated) ==========
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get all branches",
            description = "Retrieves all branches with pagination and sorting support"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved branches",
                    content = @Content(schema = @Schema(implementation = PageResponseDTO.class)))
    })
    public ResponseEntity<PageResponseDTO<BranchResponseDTO>> getAllBranches(
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,

            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,

            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "name") String sortBy,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to get all branches, page: {}, size: {}", page, size);

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<BranchResponseDTO> response = branchService.getAllBranches(pageable);
        return ResponseEntity.ok(response);
    }

    // ========== GET BY RESTAURANT ==========
    @GetMapping(value = "/restaurant/{restId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get branches by restaurant",
            description = "Retrieves all branches for a specific restaurant"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved branches"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PageResponseDTO<BranchResponseDTO>> getBranchesByRestaurant(
            @Parameter(description = "ID of the restaurant", required = true)
            @PathVariable Long restId,

            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to get branches for restaurant ID: {}", restId);

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<BranchResponseDTO> response = branchService.getBranchesByRestaurantId(restId, pageable);
        return ResponseEntity.ok(response);
    }

    // ========== SEARCH ==========
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Search branches",
            description = "Search branches with multiple filter criteria"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved matching branches")
    })
    public ResponseEntity<PageResponseDTO<BranchResponseDTO>> searchBranches(
            @Parameter(description = "Search by name or description (partial match)")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Filter by restaurant ID")
            @RequestParam(required = false) Long restId,

            @Parameter(description = "Filter by city")
            @RequestParam(required = false) String city,

            @Parameter(description = "Filter by state")
            @RequestParam(required = false) String state,

            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to search branches with filters");

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<BranchResponseDTO> response = branchService.searchBranches(
                keyword, restId, city, state, pageable);
        return ResponseEntity.ok(response);
    }

    // ========== UPDATE ==========
    @PutMapping(value = "/{branchId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Update a branch",
            description = "Updates an existing branch. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Branch updated successfully",
                    content = @Content(schema = @Schema(implementation = BranchResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Branch not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Branch name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<BranchResponseDTO> updateBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId,
            @Valid @RequestBody BranchRequestDTO requestDTO) {

        log.info("REST request to update branch with id: {}", branchId);
        BranchResponseDTO response = branchService.updateBranch(branchId, requestDTO);
        return ResponseEntity.ok(response);
    }

    // ========== SOFT DELETE ==========
    @DeleteMapping("/{branchId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete a branch",
            description = "Soft deletes a branch. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Branch deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Branch not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<Void> deleteBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.info("REST request to delete branch with id: {}", branchId);
        branchService.deleteBranch(branchId);
        return ResponseEntity.noContent().build();
    }

    // ========== HARD DELETE ==========
    @DeleteMapping("/{branchId}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Permanently delete a branch",
            description = "Permanently removes a branch from the database. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Branch permanently deleted"),
            @ApiResponse(responseCode = "404", description = "Branch not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<Void> hardDeleteBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.info("REST request to permanently delete branch with id: {}", branchId);
        branchService.hardDeleteBranch(branchId);
        return ResponseEntity.noContent().build();
    }

    // ========== RESTORE ==========
    @PatchMapping(value = "/{branchId}/restore", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Restore a deleted branch",
            description = "Restores a soft-deleted branch. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Branch restored successfully",
                    content = @Content(schema = @Schema(implementation = BranchResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Branch not found")
    })
    public ResponseEntity<BranchResponseDTO> restoreBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.info("REST request to restore branch with id: {}", branchId);
        BranchResponseDTO response = branchService.restoreBranch(branchId);
        return ResponseEntity.ok(response);
    }

    // ========== COUNT BY RESTAURANT ==========
    @GetMapping(value = "/restaurant/{restId}/count", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Count branches by restaurant",
            description = "Returns the count of active branches for a specific restaurant"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully")
    })
    public ResponseEntity<Long> countBranchesByRestaurant(
            @Parameter(description = "ID of the restaurant", required = true)
            @PathVariable Long restId) {

        log.debug("REST request to count branches for restaurant ID: {}", restId);
        long count = branchService.countBranchesByRestaurant(restId);
        return ResponseEntity.ok(count);
    }

    // ========== CHECK NAME EXISTS ==========
    @GetMapping(value = "/exists", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Check if branch name exists",
            description = "Checks if a branch name already exists for a restaurant"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Check completed successfully")
    })
    public ResponseEntity<Boolean> checkNameExists(
            @Parameter(description = "Branch name to check", required = true)
            @RequestParam String name,

            @Parameter(description = "Restaurant ID", required = true)
            @RequestParam Long restId) {

        log.debug("REST request to check if branch name exists: {}", name);
        boolean exists = branchService.existsByName(name, restId);
        return ResponseEntity.ok(exists);
    }
}