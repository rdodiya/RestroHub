package com.restroly.qrmenu.restaurant.controller;

import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.restaurant.dto.RestaurantResponseDTO;
import com.restroly.qrmenu.restaurant.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;

@RestController
@RequestMapping(PUBLIC_API_VERSION + "/restaurants")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Public Restaurant API", description = "Public APIs for fetching restaurant data")
public class PublicRestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping(value = "/{restaurantId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get public restaurant details by ID")
    public ResponseEntity<RestaurantResponseDTO> getRestaurantById(
            @Parameter(description = "Long Id of the restaurant", required = true)
            @PathVariable Long restaurantId) {
        log.debug("REST request to get public restaurant details by id: {}", restaurantId);
        RestaurantResponseDTO response = restaurantService.getRestaurantById(restaurantId);
        return ResponseEntity.ok(response);
    }
}
