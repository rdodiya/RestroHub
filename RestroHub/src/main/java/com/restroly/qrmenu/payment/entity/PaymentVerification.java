package com.restroly.qrmenu.payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "t_payment_verification_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "payment_id", nullable = false, unique = true)
  private String paymentId;

  @Column(name = "order_id", unique = true)
  private Long orderId;

  @Column(name = "amount")
  private BigDecimal amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "verified", nullable = false)
  private PaymentStatus status;

  @Column(name = "transaction_id", unique = true)
  private String transactionId;
}
