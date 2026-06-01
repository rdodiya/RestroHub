package com.restroly.qrmenu.payment.repository;

import com.restroly.qrmenu.payment.entity.PaymentVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentVerificationRepository extends JpaRepository<PaymentVerification, Long> {
    Optional<PaymentVerification> findByPaymentId(String paymentId);
}
