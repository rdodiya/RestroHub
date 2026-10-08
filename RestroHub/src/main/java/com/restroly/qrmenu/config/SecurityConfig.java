package com.restroly.qrmenu.config;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

import com.restroly.qrmenu.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  private static final String[] PUBLIC_URLS = {
    // Swagger/OpenAPI
    "/v3/api-docs/**",
    "/swagger-ui/**",
    "/swagger-ui.html",
    // Actuator
    "/actuator/health",
    "/actuator/info",
    // H2 Console (dev only)
    "/h2-console/**",
    // Auth endpoints
    "/api/v1/auth/**",
    // User registration
    "/api/v1/users/register",
    // Public api endpoints
    "/public/api/v1/**",
    // WebSocket endpoint
    "/ws/**"
  };

  private static final String[] PUBLIC_GET_URLS = {
    "/api/v1/foods/**", "/api/v1/categories/**", "/api/v1/restaurants/**", "/api/v1/roles/**"
  };

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configure(http))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(PUBLIC_URLS)
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, PUBLIC_GET_URLS)
                    .permitAll()
                    // STAFF advances orders (Permission.ORDER_STATUS_UPDATE); must precede the
                    // generic write rules.
                    .requestMatchers(HttpMethod.PATCH, SECURE_API_VERSION + "/orders/*/status")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER", "STAFF")
                    .requestMatchers(HttpMethod.POST, SECURE_API_VERSION + "/orders/*/cancel")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER", "STAFF")
                    .requestMatchers(
                        HttpMethod.PUT, SECURE_API_VERSION + "/orders/branch/*/mark-all-ready")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER", "STAFF")
                    .requestMatchers(HttpMethod.POST, "/secure/api/**")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
                    .requestMatchers(HttpMethod.PUT, "/secure/api/**")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
                    .requestMatchers(HttpMethod.PATCH, "/secure/api/**")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
                    .requestMatchers(HttpMethod.DELETE, "/secure/api/**")
                    .hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
                    // All other requests require authentication
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    // For H2 console
    http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
      throws Exception {
    return authConfig.getAuthenticationManager();
  }
}
