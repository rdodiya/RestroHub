package com.restroly.qrmenu.notifications.controller;

import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.branch.service.BranchService;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.order.service.OrderNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardNotificationController {

  private final OrderNotificationService orderNotificationService;
  private final BranchService branchService;

  @GetMapping(value = "/subscribe/{branchId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  @PreAuthorize("@access.can('OPERATIONS_READ') and @access.branch(#branchId)")
  public SseEmitter subscribeToBranch(@PathVariable Long branchId) {
    BranchResponseDTO test = branchService.getBranchById(branchId);
    if (test == null) {
      throw new ResourceNotFoundException("Branch not found with id: " + branchId);
    }
    return orderNotificationService.subscribe(branchId);
  }

  @PostMapping(value = "/disconnect/{branchId}")
  @PreAuthorize("@access.can('OPERATIONS_READ') and @access.branch(#branchId)")
  public ResponseEntity<String> forceCloseConnection(@PathVariable Long branchId) {
    orderNotificationService.closeConnections(branchId);
    return ResponseEntity.ok("Connections closed by backend for branch: " + branchId);
  }
}
