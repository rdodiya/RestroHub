package com.restroly.qrmenu.notification.repository;

import com.restroly.qrmenu.notification.entity.ServiceRequest;
import com.restroly.qrmenu.notification.entity.ServiceRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByBranchIdAndStatusOrderByCreatedAtDesc(
            Long branchId, ServiceRequestStatus status);

    List<ServiceRequest> findByBranchIdAndStatusInOrderByCreatedAtDesc(
            Long branchId, List<ServiceRequestStatus> statuses);
}
