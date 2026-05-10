package com.restroly.qrmenu.config;

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
			// Public api endpoints
			"/public/api/v1/**"
	};

	private static final String[] PUBLIC_GET_URLS = {
			"/api/v1/foods/**",
			"/api/v1/categories/**",
			"/api/v1/restaurants/**"
	};


	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(cors -> cors.configure(http))
				.sessionManagement(session ->
						session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(PUBLIC_URLS).permitAll()
						.requestMatchers(HttpMethod.GET, PUBLIC_GET_URLS).permitAll()
						.requestMatchers(HttpMethod.POST, "/secure/api/**").hasAnyRole("ADMIN", "RESTAURANT_OWNER")
						.requestMatchers(HttpMethod.PUT, "/secure/api/**").hasAnyRole("ADMIN", "RESTAURANT_OWNER")
						.requestMatchers(HttpMethod.DELETE, "/secure/api/**").hasAnyRole("ADMIN", "RESTAURANT_OWNER")
						// All other requests require authentication
						.anyRequest().authenticated()
				)
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
	public AuthenticationManager authenticationManager(
			AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}
}