package com.restroly.qrmenu.restaurant.controller;


import com.restroly.qrmenu.common.exception.ErrorResponse;
import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.restaurant.dto.RestaurantRequestDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantResponseDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantUpdateDTO;
import com.restroly.qrmenu.restaurant.service.RestaurantService;

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

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION +"/restaurants")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Restaurant Management", description = "APIs for managing restaurant details")
public class RestaurantController {

    private final RestaurantService restaurantService;


    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
//    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Add a new restaurant",
            description = "Add a new Restaurant. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Restaurant added successfully",
                    content = @Content(schema = @Schema(implementation = RestaurantResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Restaurant already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<RestaurantResponseDTO> createRestaurant(
            @Valid @RequestBody RestaurantRequestDTO requestDTO) {

        log.info("REST request to create restaurant: {}", requestDTO.getName());
        RestaurantResponseDTO response = restaurantService.createRestaurant(requestDTO);

        URI location = URI.create("/"+ApiConstants.APP_NAME+SECURE_API_VERSION +"/restaurant/" + response.getRestId());
        return ResponseEntity.created(location).body(response);
    }

    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Restaurant found",
                    content = @Content(schema = @Schema(implementation = RestaurantResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Restaurant not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<RestaurantResponseDTO> getRestaurantById(
            @Parameter(description = "Long Id of the restaurant", required = true)
            @PathVariable Long restaurantId) {

        log.debug("REST request to get restaurant by id: {}", restaurantId);
        RestaurantResponseDTO response = restaurantService.getRestaurantById(restaurantId);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{restaurantId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(
            summary = "Update a restaurant",
            description = "Updates an existing restaurant. Requires ADMIN or MANAGER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Restaurant updated successfully",
                    content = @Content(schema = @Schema(implementation = RestaurantResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Restaurant not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Restaurant name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<RestaurantResponseDTO> updateRestaurant(
            @Parameter(description = "UUID of the restaurant item", required = true)
            @PathVariable Long restaurantId,
            @Valid @RequestBody RestaurantUpdateDTO updateDTO) {

        log.info("REST request to update restaurant with id: {}", restaurantId);
        RestaurantResponseDTO response = restaurantService.updateRestaurant(restaurantId, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{restaurantId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete a restaurant",
            description = "Deletes a restaurant. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Restaurant deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    public ResponseEntity<Void> deleteRestaurant(
            @Parameter(description = "UUID of the restaurant item", required = true)
            @PathVariable Long restaurantId) {

        log.info("REST request to delete restaurant with id: {}", restaurantId);
        restaurantService.deleteRestaurant(restaurantId);
        return ResponseEntity.noContent().build();
    }

}
