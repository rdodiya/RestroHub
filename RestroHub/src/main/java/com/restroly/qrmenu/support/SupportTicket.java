package com.restroly.qrmenu.support;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/**
 * A help request from a restaurant user to the superadmin. restaurantId is null if the user has
 * none.
 */
@Entity
@Table(name = "t_support_ticket_master")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "support_ticket_id")
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "rest_id")
  private Long restaurantId;

  @Column(nullable = false, length = 150)
  private String title;

  @Column(nullable = false, length = 2000)
  private String message;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private SupportTicketStatus status;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "resolved_at")
  private LocalDateTime resolvedAt;
}
