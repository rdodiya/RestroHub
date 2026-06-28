package com.restroly.qrmenu.notification.controller;

import com.restroly.qrmenu.notification.dto.ServiceRequestDTO;
import com.restroly.qrmenu.notification.dto.ServiceRequestResponseDTO;
import com.restroly.qrmenu.notification.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;
import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Service Requests", description = "APIs for real-time service requests (Call Waiter / Request Bill)")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    // ========== PUBLIC ENDPOINT (Customer / Guest) ==========

    @PostMapping(value = PUBLIC_API_VERSION + "/service-requests",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Create a service request",
            description = "Allows a customer to call a waiter or request a bill. "
                    + "This is a public endpoint — no authentication required. "
                    + "Table 0 (counter) is not allowed to make service requests."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Service request created and broadcast to admin"),
            @ApiResponse(responseCode = "400", description = "Invalid input (e.g., table 0)"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "409", description = "Service requests not enabled for this restaurant")
    })
    public ResponseEntity<ServiceRequestResponseDTO> createServiceRequest(
            @Valid @RequestBody ServiceRequestDTO requestDTO) {

        log.info("REST request to create service request: {}", requestDTO);
        ServiceRequestResponseDTO response = serviceRequestService.createServiceRequest(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ========== SECURE ENDPOINTS (Admin / Restaurant Owner) ==========

    @GetMapping(value = SECURE_API_VERSION + "/service-requests/branch/{branchId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get active service requests for a branch",
            description = "Returns all PENDING and ACKNOWLEDGED service requests for the given branch.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active service requests retrieved")
    })
    public ResponseEntity<List<ServiceRequestResponseDTO>> getActiveRequests(
            @Parameter(description = "Branch ID", required = true)
            @PathVariable Long branchId) {

        log.debug("REST request to get active service requests for branch: {}", branchId);
        List<ServiceRequestResponseDTO> requests = serviceRequestService.getActiveRequests(branchId);
        return ResponseEntity.ok(requests);
    }

    @PatchMapping(value = SECURE_API_VERSION + "/service-requests/{id}/acknowledge",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Acknowledge a service request",
            description = "Marks a service request as acknowledged by the admin.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Service request acknowledged"),
            @ApiResponse(responseCode = "404", description = "Service request not found")
    })
    public ResponseEntity<ServiceRequestResponseDTO> acknowledgeRequest(
            @Parameter(description = "Service request ID", required = true)
            @PathVariable Long id) {

        log.info("REST request to acknowledge service request: {}", id);
        ServiceRequestResponseDTO response = serviceRequestService.acknowledgeRequest(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping(value = SECURE_API_VERSION + "/service-requests/{id}/complete",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Complete a service request",
            description = "Marks a service request as completed (table has been served).",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Service request completed"),
            @ApiResponse(responseCode = "404", description = "Service request not found")
    })
    public ResponseEntity<ServiceRequestResponseDTO> completeRequest(
            @Parameter(description = "Service request ID", required = true)
            @PathVariable Long id) {

        log.info("REST request to complete service request: {}", id);
        ServiceRequestResponseDTO response = serviceRequestService.completeRequest(id);
        return ResponseEntity.ok(response);
    }
}
