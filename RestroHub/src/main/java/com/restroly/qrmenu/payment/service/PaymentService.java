package com.restroly.qrmenu.payment.service;

import java.math.BigDecimal;

import org.springframework.core.io.Resource;

import jakarta.transaction.Transactional;

public interface PaymentService {
    @Transactional
    String newPayment(Long orderId, BigDecimal amount);
    String generatePaymentLink(BigDecimal amount, Long orderId, String upiId);
    Resource generateUPIQR(BigDecimal amount, String upiId, String description);
    @Transactional
    void markPaymentAsVerified(String paymentId, String transactionId);
    @Transactional
    void markPaymentAsCancelled(String paymentId);
    boolean verifyPayment(String paymentId);
}
