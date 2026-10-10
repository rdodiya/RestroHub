package com.restroly.qrmenu.registration;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/**
 * A sign-up awaiting email verification and superadmin approval. restaurantId is null for a new
 * restaurant.
 */
@Entity
@Table(name = "t_registration_request_master")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "registration_request_id")
  private Long id;

  @Column(name = "user_id", nullable = false, unique = true)
  private Long userId;

  @Column(name = "requested_restaurant", nullable = false)
  private String requestedRestaurant;

  @Column(name = "rest_id")
  private Long restaurantId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private RegistrationStatus status;

  @Column(name = "verification_token", unique = true, length = 64)
  private String verificationToken;

  @Column(name = "token_expiry")
  private LocalDateTime tokenExpiry;

  @Column(name = "review_note", length = 500)
  private String reviewNote;

  @Column(name = "reviewed_by")
  private String reviewedBy;

  @Column(name = "reviewed_at")
  private LocalDateTime reviewedAt;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();
}
