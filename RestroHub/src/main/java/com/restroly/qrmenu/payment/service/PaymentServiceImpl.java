package com.restroly.qrmenu.payment.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.restroly.qrmenu.payment.entity.PaymentStatus;
import com.restroly.qrmenu.payment.entity.PaymentVerification;
import com.restroly.qrmenu.payment.repository.PaymentVerificationRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private static final int QR_CODE_SIZE = 250;

    @Value("${payment.payee.name:RestroHub}")
    private String upiPayerName;

    private final PaymentVerificationRepository verificationRepository;

    public String newPayment(Long orderId, BigDecimal amount) {
        log.info("Creating new payment record with manual verification flag set to false");
        PaymentVerification entity = PaymentVerification.builder()
                                    .paymentId("PAY" + orderId)
                                    .orderId(orderId)
                                    .amount(amount)
                                    .status(PaymentStatus.PENDING)
                                    .build();
        verificationRepository.save(entity);
        return entity.getPaymentId();
    }

    @Override
    public String generatePaymentLink(BigDecimal amount, Long orderId, String upiId) {
        log.info("Generating raw UPI payment link for orderId: {}, amount: {}, upiId: {}", orderId, amount, upiId);

        String description = (orderId != null && orderId > 0)
                ? "Payment for Order " + orderId
                : "RestroHub payment";

        // MUST use raw upi://pay to comply with library specs and avoid 404s
        return buildUri("upi://pay", amount, orderId, upiId, description);
    }

    @Override
    public Resource generateUPIQR(BigDecimal amount, String upiId, String description) {
        log.info("Generating raw UPI QR for amount: {}, upiId: {}, description: {}", amount, upiId, description);

        String desc = (description != null && !description.isBlank()) ? description : "RestroHub payment";

        // MUST use raw upi:// for QR codes so mobile scanners open payment apps
        // directly
        String rawUpiLink = buildUri("upi://pay", amount, null, upiId, desc);

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(rawUpiLink, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE);

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
                return new ByteArrayResource(outputStream.toByteArray());
            }
        } catch (WriterException | IOException ex) {
            log.error("Failed to generate UPI QR code", ex);
            throw new IllegalStateException("Unable to generate UPI QR code", ex);
        }
    }

    private String buildUri(
            String baseUrl,
            BigDecimal amount,
            Long orderId,
            String upiId,
            String description) {

        String formattedAmount = String.format(Locale.US, "%.2f", amount);

        String transactionRef = (orderId != null && orderId > 0)
                ? ("ORD" + orderId)
                : ("PAY" + System.currentTimeMillis());

        return baseUrl
                + "?pa=" + URLEncoder.encode(upiId.trim(), StandardCharsets.UTF_8)
                + "&pn=" + URLEncoder.encode(upiPayerName.trim(), StandardCharsets.UTF_8)
                + "&am=" + formattedAmount.trim()
                + "&cu=INR"
                + "&tr=" + URLEncoder.encode(transactionRef.trim(), StandardCharsets.UTF_8)
                + "&tn=" + URLEncoder.encode(description.trim(), StandardCharsets.UTF_8);
    }

    public void markPaymentAsVerified(String paymentId, String transactionId) {
        log.info("Marking paymentId: {} as verified with transactionId: {}", paymentId, transactionId);
        verificationRepository.findByPaymentId(paymentId).ifPresent(entity -> {
            entity.setStatus(PaymentStatus.SUCCESS);
            entity.setTransactionId(transactionId);
            verificationRepository.save(entity);
        });
    }

    public void markPaymentAsCancelled(String paymentId) {
        log.info("Marking paymentId: {} as cancelled", paymentId);
        verificationRepository.findByPaymentId(paymentId).ifPresent(entity -> {
            entity.setStatus(PaymentStatus.CANCELLED);
            verificationRepository.save(entity);
        });
    }

    @Override
    public boolean verifyPayment(String paymentId) {
        log.info("Verifying payment status for paymentId: {} using manual admin verification flag", paymentId);
        return verificationRepository.findByPaymentId(paymentId)
                .map(entity -> entity.getStatus() == PaymentStatus.SUCCESS)
                .orElse(false);
    }
}