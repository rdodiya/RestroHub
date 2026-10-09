package com.restroly.qrmenu.registration;

import com.restroly.qrmenu.audit.entity.AuditAction;
import com.restroly.qrmenu.audit.service.AuditLogService;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.notification.service.EmailService;
import com.restroly.qrmenu.restaurant.dto.RestaurantRequestDTO;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.restaurant.service.RestaurantService;
import com.restroly.qrmenu.security.AppRole;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Sign-up lifecycle: email verification, then superadmin approve/reject with role assignment. */
@Service
@RequiredArgsConstructor
public class RegistrationService {

  private static final int TOKEN_HOURS = 24;

  private final RegistrationRequestRepository requests;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final RestaurantRepository restaurantRepository;
  private final RestaurantService restaurantService;
  private final EmailService emailService;
  private final AuditLogService auditLog;

  /**
   * Opens a request for a new user and emails the verification link. An existing restaurant name
   * makes it a join request.
   */
  @Transactional
  public void open(User user, String restaurantName) {
    String name = restaurantName.trim();
    Long restId =
        restaurantRepository.findByNameIgnoreCase(name).map(Restaurant::getRestId).orElse(null);
    RegistrationRequest req =
        requests.save(
            RegistrationRequest.builder()
                .userId(user.getUserId())
                .requestedRestaurant(name)
                .restaurantId(restId)
                .status(RegistrationStatus.EMAIL_PENDING)
                .build());
    sendVerification(req, user);
  }

  /**
   * Issues a fresh token and re-sends the email. Silent no-op unless the request awaits
   * verification.
   */
  @Transactional
  public void resend(String email) {
    userRepository
        .findByEmail(email.trim())
        .ifPresent(
            u ->
                requests
                    .findByUserId(u.getUserId())
                    .filter(r -> r.getStatus() == RegistrationStatus.EMAIL_PENDING)
                    .ifPresent(r -> sendVerification(r, u)));
  }

  /** Confirms the email and moves the request to PENDING_APPROVAL. Never logs the user in. */
  @Transactional
  public RegistrationStatus verifyEmail(String token) {
    RegistrationRequest req =
        requests
            .findByVerificationToken(token)
            .orElseThrow(() -> new BusinessException("Invalid or expired verification link"));
    if (req.getTokenExpiry().isBefore(LocalDateTime.now())) {
      throw new BusinessException("Verification link has expired. Please request a new one.");
    }
    req.setStatus(RegistrationStatus.PENDING_APPROVAL);
    req.setVerificationToken(null);
    req.setTokenExpiry(null);
    User applicant = userOf(req);
    userRepository
        .findSuperAdminEmails()
        .forEach(
            to -> {
              try {
                emailService.sendRegistrationAlert(
                    to,
                    applicant.getName(),
                    applicant.getEmail(),
                    req.getRequestedRestaurant(),
                    req.getRestaurantId() == null);
              } catch (RuntimeException e) {
                // A mail failure must not undo the verification.
              }
            });
    return req.getStatus();
  }

  /** Login gate: throws unless the user has no request or an approved one. */
  @Transactional(readOnly = true)
  public void assertCanLogin(String email) {
    userRepository
        .findByEmail(email)
        .flatMap(u -> requests.findByUserId(u.getUserId()))
        .ifPresent(
            r -> {
              switch (r.getStatus()) {
                case EMAIL_PENDING -> throw new BusinessException("Please verify your email first");
                case PENDING_APPROVAL ->
                    throw new BusinessException("Your registration is pending approval");
                case REJECTED -> throw new BusinessException("Your registration was rejected");
                default -> {}
              }
            });
  }

  @Transactional(readOnly = true)
  public List<RegistrationRequestDto> listPending() {
    return requests.findByStatusOrderByCreatedAtAsc(RegistrationStatus.PENDING_APPROVAL).stream()
        .map(this::toDto)
        .toList();
  }

  /**
   * Approves a request. New restaurant: creates it and grants RESTAURANT_OWNER. Existing
   * restaurant: grants the role chosen by the superadmin (required).
   */
  @Transactional
  public RegistrationRequestDto approve(Long id, String roleName) {
    RegistrationRequest req = pending(id);
    User user = userOf(req);
    boolean isNew = req.getRestaurantId() == null;

    AppRole appRole =
        AppRole.from(isNew ? AppRole.RESTAURANT_OWNER.name() : roleName)
            .filter(r -> r != AppRole.SUPER_ADMIN)
            .orElseThrow(() -> new BusinessException("A valid roleName is required"));

    if (isNew) {
      Long newId =
          restaurantService
              .createRestaurant(
                  RestaurantRequestDTO.builder()
                      .name(req.getRequestedRestaurant())
                      .description(req.getRequestedRestaurant())
                      .build())
              .getRestId();
      req.setRestaurantId(newId);
    }

    user.addUserRoleRestaurant(
        findRole(appRole), restaurantRepository.getReferenceById(req.getRestaurantId()));
    userRepository.save(user);
    finish(req, RegistrationStatus.APPROVED, null);
    auditLog.record(
        AuditAction.ROLE_ASSIGNED,
        "USER",
        user.getUserId(),
        req.getRestaurantId(),
        Map.of("role", appRole.name(), "source", "REGISTRATION_APPROVAL"));
    emailService.sendRegistrationDecision(
        user.getEmail(), true, req.getRequestedRestaurant(), null);
    return toDto(req);
  }

  @Transactional
  public RegistrationRequestDto reject(Long id, String note) {
    RegistrationRequest req = pending(id);
    finish(req, RegistrationStatus.REJECTED, note);
    emailService.sendRegistrationDecision(
        userOf(req).getEmail(), false, req.getRequestedRestaurant(), note);
    return toDto(req);
  }

  private void sendVerification(RegistrationRequest req, User user) {
    req.setVerificationToken(UUID.randomUUID().toString().replace("-", ""));
    req.setTokenExpiry(LocalDateTime.now().plusHours(TOKEN_HOURS));
    requests.save(req);
    emailService.sendEmailVerification(user.getEmail(), req.getVerificationToken(), TOKEN_HOURS);
  }

  private RegistrationRequest pending(Long id) {
    RegistrationRequest req =
        requests
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Registration request not found: " + id));
    if (req.getStatus() != RegistrationStatus.PENDING_APPROVAL) {
      throw new BusinessException(
          "Request is not pending approval (status " + req.getStatus() + ")");
    }
    return req;
  }

  private User userOf(RegistrationRequest req) {
    return userRepository
        .findById(req.getUserId())
        .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
  }

  /** Stored role names are "ROLE_X" or "X"; AppRole.normalize makes both comparable. */
  private Role findRole(AppRole appRole) {
    return roleRepository.findAll().stream()
        .filter(r -> AppRole.normalize(r.getName()).equals(appRole.name()))
        .findFirst()
        .orElseThrow(() -> new BusinessException("Role not configured: " + appRole));
  }

  private void finish(RegistrationRequest req, RegistrationStatus status, String note) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    req.setStatus(status);
    req.setReviewNote(note);
    req.setReviewedBy(auth == null ? null : auth.getName());
    req.setReviewedAt(LocalDateTime.now());
  }

  private RegistrationRequestDto toDto(RegistrationRequest r) {
    User u = userOf(r);
    return new RegistrationRequestDto(
        r.getId(),
        u.getUserId(),
        u.getName(),
        u.getEmail(),
        r.getRequestedRestaurant(),
        r.getRestaurantId(),
        r.getRestaurantId() == null,
        r.getStatus(),
        r.getCreatedAt());
  }
}
