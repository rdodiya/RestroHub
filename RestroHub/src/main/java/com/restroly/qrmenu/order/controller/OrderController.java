//com/Restroly/qrmenu/order/controller/OrderController.java
package com.restroly.qrmenu.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.dto.UpdateOrderStatusRequest;
import com.restroly.qrmenu.order.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import static com.restroly.qrmenu.common.util.ApiConstants.*;

@RestController
@RequestMapping(SECURE_API_VERSION+"/orders")
@CrossOrigin(origins = "*")
public class OrderController {

	@Autowired
	private final OrderService orderService = null;

//private final OrderService orderService;
	@PostMapping
	public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
		OrderResponse response = orderService.createOrder(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
		return ResponseEntity.ok(orderService.getOrderById(orderId));
	}

	@GetMapping("/branch/{branchId}")
	public ResponseEntity<List<OrderResponse>> getOrdersByBranch(@PathVariable Long branchId) {
		return ResponseEntity.ok(orderService.getOrdersByBranch(branchId));
	}

	@GetMapping("/branch/{branchId}/active")
	public ResponseEntity<List<OrderResponse>> getActiveOrders(@PathVariable Long branchId) {
		return ResponseEntity.ok(orderService.getActiveOrdersByBranch(branchId));
	}

	@PatchMapping("/{orderId}/status")
	public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
			@Valid @RequestBody UpdateOrderStatusRequest request) {
		return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request.getStatus()));
	}

	@PostMapping("/{orderId}/cancel")
	public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
		orderService.cancelOrder(orderId);
		return ResponseEntity.noContent().build();
	}
}