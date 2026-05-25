package com.restroly.qrmenu.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "t_service_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long id;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @Column(name = "branch_id", nullable = false)
    private Long branchId;

    @Column(name = "table_number", nullable = false)
    private Integer tableNumber;

    @Column(name = "request_type", nullable = false)
    private String requestType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private ServiceRequestStatus status = ServiceRequestStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
