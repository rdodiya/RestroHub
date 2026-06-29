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
import com.restroly.qrmenu.payment.service.PaymentService;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import static com.restroly.qrmenu.common.util.ApiConstants.*;

@RestController
@RequestMapping(SECURE_API_VERSION+"/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {
	
  @Autowired
	private final WhatsappOrderNotificationService whatsapp = null;

  private final PaymentService paymentService;
	private final OrderService orderService;
  
	@PostMapping
	public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
		OrderResponse response = orderService.createOrder(request);
		//Order tacking improvement needed
		//Response is used to carry the UPI Id out of instead of calling it from database again hence reducing the number of calls to database and improving the performance of the application
		String paymentUrl = paymentService.generatePaymentLink(response.getTotalAmount(), response.getOrderId(), response.getPaymentLink());
		//Genarated payment link is stored in response object to send it to client and use it for payment
		response.setPaymentLink(paymentUrl);
		//Sending whatsapp notification
		if(response.getCustomerName() == null) response.setCustomerName("Customer");
		if(response.getCustomerPhone() != null) whatsapp.sendOrderConfirmation(response);
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
				OrderResponse response = orderService.updateOrderStatus(orderId, request.getStatus());
				//Sending whatsapp notification
				if(response.getCustomerName() == null) response.setCustomerName("Customer");
		        if(response.getCustomerPhone() != null) whatsapp.sendOrderStatusUpdate(response);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/{orderId}/cancel")
	public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
		OrderResponse response=orderService.cancelOrder(orderId);
		//sending cancel message
		if(response.getCustomerName() == null) response.setCustomerName("Customer");
		if(response.getCustomerPhone() != null) whatsapp.sendOrderStatusUpdate(response);
		return ResponseEntity.noContent().build();
	}
}