package com.restroly.qrmenu.config;

import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking database initialization...");

        // Ensure columns in t_password_reset_token exist
        try {
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS t_password_reset_token (
                    id BIGSERIAL PRIMARY KEY,
                    otp_code VARCHAR(10) NOT NULL,
                    reset_token VARCHAR(100),
                    user_id BIGINT NOT NULL,
                    expiry_date TIMESTAMP NOT NULL,
                    is_otp_verified BOOLEAN DEFAULT FALSE,
                    is_reset_completed BOOLEAN DEFAULT FALSE,
                    failed_attempts INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """);

            // If table existed previously with old columns, add missing columns safely
            jdbcTemplate.execute("ALTER TABLE t_password_reset_token ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10)");
            jdbcTemplate.execute("ALTER TABLE t_password_reset_token ADD COLUMN IF NOT EXISTS reset_token VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE t_password_reset_token ADD COLUMN IF NOT EXISTS is_otp_verified BOOLEAN DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE t_password_reset_token ADD COLUMN IF NOT EXISTS is_reset_completed BOOLEAN DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE t_password_reset_token ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0");

            // Drop NOT NULL constraint on old 'token' column if it exists from earlier version
            jdbcTemplate.execute("ALTER TABLE t_password_reset_token ALTER COLUMN token DROP NOT NULL");

            log.info("t_password_reset_token table structure verified.");
        } catch (Exception e) {
            log.warn("Migration for t_password_reset_token noted: {}", e.getMessage());
        }

        // Ensure personal details columns in t_usr_master exist
        try {
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS gender VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS address VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS city VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS state VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS pincode VARCHAR(20)");
            jdbcTemplate.execute("ALTER TABLE t_usr_master ADD COLUMN IF NOT EXISTS bio VARCHAR(500)");
            log.info("t_usr_master personal columns verified.");
        } catch (Exception e) {
            log.warn("Migration for t_usr_master noted: {}", e.getMessage());
        }

        if (restaurantRepository.count() == 0) {
            log.info("No restaurants found. Initializing a default restaurant (Rajkot Dhaba)...");
            Restaurant defaultRestaurant = Restaurant.builder()
                    .name("Rajkot Dhaba")
                    .description("Taste of Tradition")
                    .phoneNumber("+91-9876543210")
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
