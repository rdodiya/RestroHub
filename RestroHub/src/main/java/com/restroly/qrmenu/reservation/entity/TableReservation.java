package com.restroly.qrmenu.reservation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

// 2026-11-08 - Table reservation entity - Store website reservation details and table link
@Entity
@Table(name = "t_table_reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableReservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "branch_id", nullable = false)
  private Long branchId;

  @Column(name = "table_id")
  private Long tableId;

  @Column(name = "table_number")
  private Integer tableNumber;

  @Column(name = "customer_name", nullable = false, length = 100)
  private String customerName;

  @Column(name = "customer_email", length = 150)
  private String customerEmail;

  @Column(name = "customer_phone", length = 50)
  private String customerPhone;

  @Column(name = "reservation_date", nullable = false, length = 30)
  private String reservationDate;

  @Column(name = "time_slot", nullable = false, length = 50)
  private String timeSlot;

  @Column(name = "guests_count", nullable = false)
  private Integer guestsCount;

  @Column(name = "special_requests", columnDefinition = "TEXT")
  private String specialRequests;

  @Column(name = "status", nullable = false, length = 30)
  @Builder.Default
  private String status = "CONFIRMED";

  @Column(name = "confirmation_number", nullable = false, unique = true, length = 64)
  private String confirmationNumber;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
    if (status == null || status.isBlank()) {
      status = "CONFIRMED";
    }
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
