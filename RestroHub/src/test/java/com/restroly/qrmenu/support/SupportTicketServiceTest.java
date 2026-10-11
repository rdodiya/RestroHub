package com.restroly.qrmenu.support;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.restroly.qrmenu.notification.service.EmailService;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import com.restroly.qrmenu.user.repository.UserRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class SupportTicketServiceTest {

  @Mock SupportTicketRepository tickets;
  @Mock UserRepository userRepository;
  @Mock RestaurantRepository restaurantRepository;
  @Mock EmailService emailService;

  SupportTicketService service;

  @BeforeEach
  void setUp() {
    service = new SupportTicketService(tickets, userRepository, restaurantRepository, emailService);
    SecurityContextHolder.getContext()
        .setAuthentication(new UsernamePasswordAuthenticationToken("owner@x.com", null));
  }

  @AfterEach
  void clear() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void createSavesOpenTicketAndEmailsEverySuperAdmin() {
    Restaurant restaurant = Restaurant.builder().restId(7L).name("Roy Test Kitchen").build();
    User user =
        User.builder()
            .userId(5L)
            .name("Roy")
            .email("owner@x.com")
            .userRoleRestaurants(new HashSet<>())
            .build();
    user.getUserRoleRestaurants().add(UserRoleRestaurant.builder().restaurant(restaurant).build());
    when(userRepository.findByEmailWithUserRoleRestaurants("owner@x.com"))
        .thenReturn(Optional.of(user));
    when(userRepository.findById(5L)).thenReturn(Optional.of(user));
    when(restaurantRepository.findById(7L)).thenReturn(Optional.of(restaurant));
    when(tickets.save(any(SupportTicket.class))).thenAnswer(i -> i.getArgument(0));
    when(userRepository.findSuperAdminEmails()).thenReturn(List.of("a@x.com", "b@x.com"));

    SupportTicketDto dto = service.create("  Printer issue ", " It does not print ");

    assertEquals(SupportTicketStatus.OPEN, dto.status());
    assertEquals("Printer issue", dto.title());
    assertEquals("Roy Test Kitchen", dto.restaurantName());
    verify(emailService, times(2))
        .sendSupportTicketAlert(
            any(),
            eq("Roy"),
            eq("owner@x.com"),
            eq("Roy Test Kitchen"),
            eq("Printer issue"),
            any());
  }
}
