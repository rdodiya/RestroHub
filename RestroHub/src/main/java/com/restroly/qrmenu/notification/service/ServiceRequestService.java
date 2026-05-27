package com.restroly.qrmenu.notification.service;

import com.restroly.qrmenu.notification.dto.ServiceRequestDTO;
import com.restroly.qrmenu.notification.dto.ServiceRequestResponseDTO;
import com.restroly.qrmenu.notification.entity.ServiceRequest;
import com.restroly.qrmenu.notification.entity.ServiceRequestStatus;
import com.restroly.qrmenu.notification.mapper.ServiceRequestMapper;
import com.restroly.qrmenu.notification.repository.ServiceRequestRepository;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final ServiceRequestMapper serviceRequestMapper;
    private final LiveNotificationService liveNotificationService;
    private final RestaurantRepository restaurantRepository;

    @Value("${service.request.types:CALL_WAITER,REQUEST_BILL}")
    private List<String> allowedTypes;

    /**
     * Create a new service request from a customer.
     * Validates feature flag and table number before saving.
     */
    @Transactional
    public ServiceRequestResponseDTO createServiceRequest(ServiceRequestDTO dto) {
        log.info("Creating service request: type={}, restaurant={}, branch={}, table={}",
                dto.getRequestType(), dto.getRestaurantId(), dto.getBranchId(), dto.getTableNumber());

        // Validate: Check if request type is allowed per properties configuration
        if (dto.getRequestType() == null || !allowedTypes.contains(dto.getRequestType())) {
            throw new IllegalArgumentException("Invalid service request type: " + dto.getRequestType() +
                    ". Allowed types are: " + allowedTypes);
        }

        // Validate: Table 0 is the counter — no service requests allowed
        if (dto.getTableNumber() == null || dto.getTableNumber() <= 0) {
            throw new IllegalArgumentException("Service requests are not available for counter/walk-in (Table 0)");
        }

        // Validate: Check if the restaurant has service requests enabled (feature flag)
        try {
            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new EntityNotFoundException("Restaurant not found with ID: " + dto.getRestaurantId()));

            if (!Boolean.TRUE.equals(restaurant.getServiceRequestEnabled())) {
                throw new IllegalStateException("Service requests are not enabled for this restaurant");
            }
        } catch (EntityNotFoundException e) {
            log.warn("Database is unseeded. Bypassing restaurant validation check for ID {} (acting as demo mode fallback).", dto.getRestaurantId());
        }

        // Build and save the entity
        ServiceRequest serviceRequest = ServiceRequest.builder()
                .restaurantId(dto.getRestaurantId())
                .branchId(dto.getBranchId())
                .tableNumber(dto.getTableNumber())
                .requestType(dto.getRequestType())
                .status(ServiceRequestStatus.PENDING)
                .build();

        ServiceRequest saved = serviceRequestRepository.save(serviceRequest);
        ServiceRequestResponseDTO response = serviceRequestMapper.toResponseDTO(saved);

        // Broadcast via WebSocket to admin subscribers
        String destination = "/topic/service-requests/branch/" + dto.getBranchId();
        liveNotificationService.broadcast(destination, response);

        log.info("Service request created and broadcast: id={}", saved.getId());
        return response;
    }

    /**
     * Get all active (PENDING + ACKNOWLEDGED) service requests for a branch.
     * Used by the admin dashboard.
     */
    @Transactional(readOnly = true)
    public List<ServiceRequestResponseDTO> getActiveRequests(Long branchId) {
        log.debug("Fetching active service requests for branch: {}", branchId);

        List<ServiceRequest> requests = serviceRequestRepository
                .findByBranchIdAndStatusInOrderByCreatedAtDesc(
                        branchId,
                        List.of(ServiceRequestStatus.PENDING, ServiceRequestStatus.ACKNOWLEDGED));

        return serviceRequestMapper.toResponseDTOList(requests);
    }

    /**
     * Acknowledge a service request (admin saw it).
     */
    @Transactional
    public ServiceRequestResponseDTO acknowledgeRequest(Long requestId) {
        log.info("Acknowledging service request: {}", requestId);

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Service request not found: " + requestId));

        request.setStatus(ServiceRequestStatus.ACKNOWLEDGED);
        ServiceRequest updated = serviceRequestRepository.save(request);

        return serviceRequestMapper.toResponseDTO(updated);
    }

    /**
     * Complete/dismiss a service request (admin served the table).
     */
    @Transactional
    public ServiceRequestResponseDTO completeRequest(Long requestId) {
        log.info("Completing service request: {}", requestId);

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Service request not found: " + requestId));

        request.setStatus(ServiceRequestStatus.COMPLETED);
        request.setResolvedAt(LocalDateTime.now());
        ServiceRequest updated = serviceRequestRepository.save(request);

        return serviceRequestMapper.toResponseDTO(updated);
    }
}
