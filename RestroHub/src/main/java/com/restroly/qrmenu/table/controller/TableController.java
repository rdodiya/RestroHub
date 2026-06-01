package com.restroly.qrmenu.table.controller;

import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.exception.ApiErrorResponse;
import com.restroly.qrmenu.table.dto.TableRequestDTO;
import com.restroly.qrmenu.table.dto.TableResponseDTO;
import com.restroly.qrmenu.table.service.TableService;
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
@RequestMapping(SECURE_API_VERSION)
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Table Management", description = "APIs for managing branch tables")
public class TableController {

    private final TableService tableService;

    @GetMapping(value = "/branches/{branchId}/tables", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get tables by branch", description = "Retrieves all tables for a branch")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved tables"),
            @ApiResponse(responseCode = "404", description = "Branch not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<List<TableResponseDTO>> getTablesByBranch(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId) {

        log.debug("REST request to get tables for branch id: {}", branchId);
        return ResponseEntity.ok(tableService.getTablesByBranch(branchId));
    }

    @PostMapping(value = "/branches/{branchId}/tables",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(
            summary = "Create a table",
            description = "Creates a new table for a branch. Requires ADMIN or RESTAURANT_OWNER authority.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Table created successfully",
                    content = @Content(schema = @Schema(implementation = TableResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Branch not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Duplicate table number",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<TableResponseDTO> createTable(
            @Parameter(description = "ID of the branch", required = true)
            @PathVariable Long branchId,
            @Valid @RequestBody TableRequestDTO requestDTO) {

        log.info("REST request to create table {} for branch {}", requestDTO.getTableNumber(), branchId);
        TableResponseDTO response = tableService.createTable(branchId, requestDTO);

        URI location = URI.create("/" + ApiConstants.APP_NAME + SECURE_API_VERSION + "/tables/" + response.getTableId());
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping(value = "/tables/{tableId}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(
            summary = "Update a table",
            description = "Updates table details, status, and active state. Requires ADMIN or RESTAURANT_OWNER authority.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<TableResponseDTO> updateTable(
            @Parameter(description = "ID of the table", required = true)
            @PathVariable Long tableId,
            @Valid @RequestBody TableRequestDTO requestDTO) {

        log.info("REST request to update table {}", tableId);
        return ResponseEntity.ok(tableService.updateTable(tableId, requestDTO));
    }

    @DeleteMapping("/tables/{tableId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete a table",
            description = "Permanently deletes a table. Requires ADMIN or RESTAURANT_OWNER authority.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Void> deleteTable(
            @Parameter(description = "ID of the table", required = true)
            @PathVariable Long tableId) {

        log.info("REST request to delete table {}", tableId);
        tableService.deleteTable(tableId);
        return ResponseEntity.noContent().build();
    }

}
