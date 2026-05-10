package com.restroly.qrmenu.menu.controller;

import com.restroly.qrmenu.common.exception.ErrorResponse;
import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.menu.dto.MenuRequestDTO;
import com.restroly.qrmenu.menu.dto.MenuResponseDTO;
import com.restroly.qrmenu.menu.service.MenuService;

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
@RequestMapping(SECURE_API_VERSION + "/menus")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Menu Management", description = "APIs for managing restaurant menus")
public class MenuController {

    private final MenuService menuService;

    // ========== CREATE ==========
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Create a new menu",
            description = "Creates a new menu with optional branch and categories. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Menu created successfully",
                    content = @Content(schema = @Schema(implementation = MenuResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Menu name already exists for this branch",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<MenuResponseDTO> createMenu(
            @Valid @RequestBody MenuRequestDTO requestDTO) {

        log.info("REST request to create menu: {}", requestDTO.getMenuName());
        MenuResponseDTO response = menuService.createMenu(requestDTO);

        URI location = URI.create("/" + ApiConstants.APP_NAME + SECURE_API_VERSION +
                "/menus/" + response.getMenuId());
        return ResponseEntity.created(location).body(response);
    }

    // ========== GET BY ID ==========
    @GetMapping(value = "/{menuId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get menu by ID",
            description = "Retrieves a menu by its unique identifier with full details"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Menu found",
                    content = @Content(schema = @Schema(implementation = MenuResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Menu not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<MenuResponseDTO> getMenuById(
            @Parameter(description = "ID of the menu", required = true)
            @PathVariable Long menuId) {

        log.debug("REST request to get menu by id: {}", menuId);
        MenuResponseDTO response = menuService.getMenuById(menuId);
        return ResponseEntity.ok(response);
    }

    // ========== GET ALL (Paginated) ==========
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get all menus",
            description = "Retrieves all menus with pagination and sorting support"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved menus",
                    content = @Content(schema = @Schema(implementation = PageResponseDTO.class)))
    })
    public ResponseEntity<PageResponseDTO<MenuResponseDTO>> getAllMenus(
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,

            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,

            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "menuName") String sortBy,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to get all menus, page: {}, size: {}", page, size);

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<MenuResponseDTO> response = menuService.getAllMenus(pageable);
        return ResponseEntity.ok(response);
    }

    // ========== GET BY BRANCH ==========
    @GetMapping(value = "/branch/{branchId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get menus by branch",
            description = "Retrieves all menus for a specific branch"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved menus"),
            @ApiResponse(responseCode = "404", description = "Branch not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<MenuResponseDTO>> getMenusByBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.debug("REST request to get menus for branch ID: {}", branchId);
        List<MenuResponseDTO> response = menuService.getMenusByBranchId(branchId);
        return ResponseEntity.ok(response);
    }

    // ========== SEARCH ==========
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Search menus",
            description = "Search menus by keyword with optional branch filter"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved matching menus")
    })
    public ResponseEntity<PageResponseDTO<MenuResponseDTO>> searchMenus(
            @Parameter(description = "Search by name or description (partial match)")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Filter by branch ID")
            @RequestParam(required = false) Long branchId,

            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "menuName") String sortBy,
            @RequestParam(defaultValue = ApiConstants.DEFAULT_SORT_DIRECTION) String sortDirection) {

        log.debug("REST request to search menus with keyword: {}", keyword);

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponseDTO<MenuResponseDTO> response = menuService.searchMenus(keyword, branchId, pageable);
        return ResponseEntity.ok(response);
    }

    // ========== UPDATE ==========
    @PutMapping(value = "/{menuId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Update a menu",
            description = "Updates an existing menu. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Menu updated successfully",
                    content = @Content(schema = @Schema(implementation = MenuResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Menu not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Menu name already exists for this branch",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<MenuResponseDTO> updateMenu(
            @Parameter(description = "ID of the menu", required = true)
            @PathVariable Long menuId,
            @Valid @RequestBody MenuRequestDTO requestDTO) {

        log.info("REST request to update menu with id: {}", menuId);
        MenuResponseDTO response = menuService.updateMenu(menuId, requestDTO);
        return ResponseEntity.ok(response);
    }

    // ========== SOFT DELETE ==========
    @DeleteMapping("/{menuId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete a menu",
            description = "Soft deletes a menu. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Menu deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Menu not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<Void> deleteMenu(
            @Parameter(description = "ID of the menu", required = true)
            @PathVariable Long menuId) {

        log.info("REST request to delete menu with id: {}", menuId);
        menuService.deleteMenu(menuId);
        return ResponseEntity.noContent().build();
    }

    // ========== HARD DELETE ==========
    @DeleteMapping("/{menuId}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Permanently delete a menu",
            description = "Permanently removes a menu. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Menu permanently deleted"),
            @ApiResponse(responseCode = "404", description = "Menu not found")
    })
    public ResponseEntity<Void> hardDeleteMenu(
            @Parameter(description = "ID of the menu", required = true)
            @PathVariable Long menuId) {

        log.info("REST request to permanently delete menu with id: {}", menuId);
        menuService.hardDeleteMenu(menuId);
        return ResponseEntity.noContent().build();
    }

    // ========== RESTORE ==========
    @PatchMapping(value = "/{menuId}/restore", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Restore a deleted menu",
            description = "Restores a soft-deleted menu. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Menu restored successfully",
                    content = @Content(schema = @Schema(implementation = MenuResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Menu not found")
    })
    public ResponseEntity<MenuResponseDTO> restoreMenu(
            @Parameter(description = "ID of the menu", required = true)
            @PathVariable Long menuId) {

        log.info("REST request to restore menu with id: {}", menuId);
        MenuResponseDTO response = menuService.restoreMenu(menuId);
        return ResponseEntity.ok(response);
    }

    // ========== COUNT ==========
    @GetMapping(value = "/count", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Count all menus",
            description = "Returns the count of all active menus"
    )
    public ResponseEntity<Long> countMenus() {
        log.debug("REST request to count all menus");
        long count = menuService.countMenus();
        return ResponseEntity.ok(count);
    }

    @GetMapping(value = "/branch/{branchId}/count", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Count menus by branch",
            description = "Returns the count of active menus for a specific branch"
    )
    public ResponseEntity<Long> countMenusByBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.debug("REST request to count menus for branch ID: {}", branchId);
        long count = menuService.countMenusByBranch(branchId);
        return ResponseEntity.ok(count);
    }

    // ========== CHECK NAME EXISTS ==========
    @GetMapping(value = "/exists", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Check if menu name exists",
            description = "Checks if a menu name already exists for a branch"
    )
    public ResponseEntity<Boolean> checkNameExists(
            @Parameter(description = "Menu name to check", required = true)
            @RequestParam String menuName,

            @Parameter(description = "Branch ID", required = true)
            @RequestParam Long branchId) {

        log.debug("REST request to check if menu name exists: {}", menuName);
        boolean exists = menuService.existsByName(menuName, branchId);
        return ResponseEntity.ok(exists);
    }
}