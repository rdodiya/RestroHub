package com.restroly.qrmenu.payment.service;

public interface PaymentService {
    String generatePaymentLink(double amount, Long orderId, String upiId);
    void generateUPIQR(double amount, String upiId, String description);
    boolean verifyPayment(String paymentId);
}
