package com.restroly.qrmenu.payment.service;

import org.springframework.core.io.Resource;

import jakarta.transaction.Transactional;

public interface PaymentService {
    @Transactional
    String newPayment(Long orderId, double amount);
    String generatePaymentLink(double amount, Long orderId, String upiId);
    Resource generateUPIQR(double amount, String upiId, String description);
    @Transactional
    void markPaymentAsVerified(String paymentId, String transactionId);
    @Transactional
    void markPaymentAsCancelled(String paymentId);
    boolean verifyPayment(String paymentId);
}
