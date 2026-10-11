package com.restroly.qrmenu.config;

import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

  private final RestaurantRepository restaurantRepository;

  @Override
  public void run(String... args) throws Exception {
    log.info("Checking database initialization...");

    if (restaurantRepository.count() == 0) {
      log.info("No restaurants found. Initializing a default restaurant (Restroly Platform)...");
      Restaurant defaultRestaurant =
          Restaurant.builder()
              .name("Restroly Platform")
              .description("Platform tenant for the super admin account")
              .phoneNumber("")
              .isActive(true)
              .serviceRequestEnabled(true)
              .build();
      Restaurant saved = restaurantRepository.save(defaultRestaurant);
      log.info("Initialized default restaurant with ID: {}", saved.getRestId());
    } else {
      log.info("Database already contains restaurant data.");
    }
  }
}
