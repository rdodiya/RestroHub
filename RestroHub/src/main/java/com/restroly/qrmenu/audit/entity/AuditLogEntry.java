package com.restroly.qrmenu.audit.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Append-only record of a sensitive action. IDs are plain columns (no FKs) so entries survive
 * deletes of the things they describe. Table created by Flyway V2__create_audit_log.sql.
 */
@Entity
@Table(name = "t_audit_log")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogEntry {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "actor_user_id")
  private Long actorUserId;

  @Column(name = "actor_email", length = 255)
  private String actorEmail;

  @Enumerated(EnumType.STRING)
  @Column(name = "action", nullable = false, length = 64)
  private AuditAction action;

  @Column(name = "target_type", nullable = false, length = 64)
  private String targetType;

  @Column(name = "target_id", length = 64)
  private String targetId;

  @Column(name = "restaurant_id")
  private Long restaurantId;

  @Column(name = "metadata", columnDefinition = "TEXT")
  private String metadata;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @PrePersist
  void onCreate() {
    createdAt = LocalDateTime.now();
  }
}
