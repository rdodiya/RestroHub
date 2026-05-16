package com.restroly.qrmenu.payment.service;

import com.restroly.qrmenu.payment.entity.PaymentStatus;
import com.restroly.qrmenu.payment.entity.PaymentVerification;
import com.restroly.qrmenu.payment.repository.PaymentVerificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentVerificationRepository verificationRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        // Because @Value fields aren't injected in pure unit tests, we set it manually
        ReflectionTestUtils.setField(paymentService, "upiPayerName", "RestroHub");
    }

    @Test
    void newPayment_ShouldSaveAndReturnPaymentId() {
        // Given
        Long orderId = 123L;
        double amount = 500.00;

        // When
        String resultId = paymentService.newPayment(orderId, amount);

        // Then
        assertEquals("PAY123", resultId);
        // Verify that the repository's save method was called exactly once
        verify(verificationRepository, times(1)).save(any(PaymentVerification.class));
    }

    @Test
    void generatePaymentLink_ShouldReturnCorrectlyFormattedUpiString() {
        // Given
        double amount = 150.50;
        Long orderId = 456L;
        String upiId = "admin@bank";

        // When
        String link = paymentService.generatePaymentLink(amount, orderId, upiId);

        // Then
        assertTrue(link.startsWith("upi://pay"));
        assertTrue(link.contains("pa=admin%40bank")); // Checks URL encoding
        assertTrue(link.contains("pn=RestroHub"));
        assertTrue(link.contains("am=150.50"));
        assertTrue(link.contains("tr=ORD456"));
    }

    @Test
    void verifyPayment_WhenStatusIsSuccess_ShouldReturnTrue() {
        // Given
        String paymentId = "PAY789";
        PaymentVerification mockPayment = PaymentVerification.builder()
                .paymentId(paymentId)
                .status(PaymentStatus.SUCCESS)
                .build();

        // Tell Mockito: "When the repository is asked for this ID, return our mock payment"
        when(verificationRepository.findByPaymentId(paymentId))
                .thenReturn(Optional.of(mockPayment));

        // When
        boolean isVerified = paymentService.verifyPayment(paymentId);

        // Then
        assertTrue(isVerified);
    }

    @Test
    void verifyPayment_WhenStatusIsPending_ShouldReturnFalse() {
        // Given
        String paymentId = "PAY999";
        PaymentVerification mockPayment = PaymentVerification.builder()
                .paymentId(paymentId)
                .status(PaymentStatus.PENDING) // Not successful yet!
                .build();

        when(verificationRepository.findByPaymentId(paymentId))
                .thenReturn(Optional.of(mockPayment));

        // When
        boolean isVerified = paymentService.verifyPayment(paymentId);

        // Then
        assertFalse(isVerified);
    }
    @Test
    void markPaymentAsVerified_ShouldUpdateStatusAndTransactionId() {
        // Given
        String paymentId = "PAY123";
        String transactionId = "UTR987654321";
        PaymentVerification mockPayment = PaymentVerification.builder()
                .paymentId(paymentId)
                .status(PaymentStatus.PENDING)
                .build();

        when(verificationRepository.findByPaymentId(paymentId)).thenReturn(Optional.of(mockPayment));

        // When
        paymentService.markPaymentAsVerified(paymentId, transactionId);

        // Then
        assertEquals(PaymentStatus.SUCCESS, mockPayment.getStatus());
        assertEquals(transactionId, mockPayment.getTransactionId());
        verify(verificationRepository, times(1)).save(mockPayment);
    }

    @Test
    void markPaymentAsCancelled_ShouldUpdateStatusToCancelled() {
        // Given
        String paymentId = "PAY456";
        PaymentVerification mockPayment = PaymentVerification.builder()
                .paymentId(paymentId)
                .status(PaymentStatus.PENDING)
                .build();

        when(verificationRepository.findByPaymentId(paymentId)).thenReturn(Optional.of(mockPayment));

        // When
        paymentService.markPaymentAsCancelled(paymentId);

        // Then
        assertEquals(PaymentStatus.CANCELLED, mockPayment.getStatus());
        verify(verificationRepository, times(1)).save(mockPayment);
    }

    @Test
    void generateUPIQR_ShouldReturnResource() throws IOException {
        // Given
        double amount = 100.0;
        String upiId = "test@bank";
        String description = "Test QR";

        // When
        Resource qrResource = paymentService.generateUPIQR(amount, upiId, description);

        // Then
        assertNotNull(qrResource);
        assertTrue(qrResource.contentLength() > 0);
    }
}
