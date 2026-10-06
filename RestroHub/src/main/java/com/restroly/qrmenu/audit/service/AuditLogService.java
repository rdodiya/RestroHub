package com.restroly.qrmenu.audit.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restroly.qrmenu.audit.entity.AuditAction;
import com.restroly.qrmenu.audit.entity.AuditLogEntry;
import com.restroly.qrmenu.audit.repository.AuditLogRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Writes audit entries for sensitive actions. Runs inside the caller's transaction, so an entry is
 * kept only when the action itself commits.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;
  private final UserRepository userRepository;
  private final ObjectMapper objectMapper;

  /**
   * Records an action by the current user.
   *
   * @param action what happened
   * @param targetType kind of thing affected, e.g. "USER", "RESTAURANT", "UPI_LINK"
   * @param targetId ID of the thing affected
   * @param restaurantId tenant the action belongs to, or null for platform-level actions
   * @param metadata extra details (stored as JSON); may be empty
   */
  @Transactional
  public void record(
      AuditAction action,
      String targetType,
      Object targetId,
      Long restaurantId,
      Map<String, ?> metadata) {
    String email = currentEmail();
    Long actorId =
        email == null
            ? null
            : userRepository.findByEmail(email).map(u -> u.getUserId()).orElse(null);
    auditLogRepository.save(
        AuditLogEntry.builder()
            .actorUserId(actorId)
            .actorEmail(email)
            .action(action)
            .targetType(targetType)
            .targetId(targetId == null ? null : String.valueOf(targetId))
            .restaurantId(restaurantId)
            .metadata(toJson(metadata))
            .build());
    log.info(
        "AUDIT {} {}={} restaurantId={} by={}", action, targetType, targetId, restaurantId, email);
  }

  private String toJson(Map<String, ?> metadata) {
    if (metadata == null || metadata.isEmpty()) {
      return null;
    }
    try {
      return objectMapper.writeValueAsString(metadata);
    } catch (JsonProcessingException ex) {
      return String.valueOf(metadata);
    }
  }

  private static String currentEmail() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth == null || !auth.isAuthenticated() ? null : auth.getName();
  }
}
