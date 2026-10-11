package com.restroly.qrmenu.support;

import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.notification.service.EmailService;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Help &amp; Support: users send a title and message; superadmins are emailed and see it in their
 * bell.
 */
@Service
@RequiredArgsConstructor
public class SupportTicketService {

  private final SupportTicketRepository tickets;
  private final UserRepository userRepository;
  private final RestaurantRepository restaurantRepository;
  private final EmailService emailService;

  /** Saves a ticket from the current user and emails every superadmin. */
  @Transactional
  public SupportTicketDto create(String title, String message) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User user =
        userRepository
            .findByEmailWithUserRoleRestaurants(email)
            .orElseThrow(() -> new BusinessException("User not found"));
    Long restaurantId =
        user.getUserRoleRestaurants().stream()
            .map(UserRoleRestaurant::getRestaurant)
            .findFirst()
            .map(Restaurant::getRestId)
            .orElse(null);

    SupportTicket ticket =
        tickets.save(
            SupportTicket.builder()
                .userId(user.getUserId())
                .restaurantId(restaurantId)
                .title(title.trim())
                .message(message.trim())
                .status(SupportTicketStatus.OPEN)
                .build());

    SupportTicketDto dto = toDto(ticket);
    userRepository
        .findSuperAdminEmails()
        .forEach(
            to ->
                emailService.sendSupportTicketAlert(
                    to,
                    dto.userName(),
                    dto.userEmail(),
                    dto.restaurantName(),
                    dto.title(),
                    dto.message()));
    return dto;
  }

  /** Open tickets, newest first (the superadmin's notification feed). */
  @Transactional(readOnly = true)
  public List<SupportTicketDto> listOpen() {
    return tickets.findTop100ByStatusOrderByCreatedAtDesc(SupportTicketStatus.OPEN).stream()
        .map(this::toDto)
        .toList();
  }

  @Transactional
  public void resolve(Long id) {
    SupportTicket t =
        tickets
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Support ticket not found: " + id));
    t.setStatus(SupportTicketStatus.RESOLVED);
    t.setResolvedAt(LocalDateTime.now());
  }

  private SupportTicketDto toDto(SupportTicket t) {
    User u = userRepository.findById(t.getUserId()).orElse(null);
    String restaurant =
        t.getRestaurantId() == null
            ? null
            : restaurantRepository
                .findById(t.getRestaurantId())
                .map(Restaurant::getName)
                .orElse(null);
    return new SupportTicketDto(
        t.getId(),
        t.getTitle(),
        t.getMessage(),
        t.getStatus(),
        u == null ? null : u.getName(),
        u == null ? null : u.getEmail(),
        restaurant,
        t.getCreatedAt());
  }
}
