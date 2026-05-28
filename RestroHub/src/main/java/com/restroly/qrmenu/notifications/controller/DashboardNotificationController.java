package com.restroly.qrmenu.notifications.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.branch.service.BranchService;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.order.service.OrderNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardNotificationController {

    private final OrderNotificationService orderNotificationService;
    private final BranchService branchService;

    @GetMapping(value = "/subscribe/{branchId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeToBranch(@PathVariable Long branchId) {
        BranchResponseDTO test = branchService.getBranchById(branchId);
        if(test == null){
            throw new ResourceNotFoundException("Branch not found with id: " + branchId);
        }
        return orderNotificationService.subscribe(branchId);
    }
    
    @PostMapping(value = "/disconnect/{branchId}")
    public ResponseEntity<String> forceCloseConnection(@PathVariable Long branchId) {
        orderNotificationService.closeConnections(branchId);
        return ResponseEntity.ok("Connections closed by backend for branch: " + branchId);
    }
}
