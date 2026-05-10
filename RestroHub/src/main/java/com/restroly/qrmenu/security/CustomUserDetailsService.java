package com.restroly.qrmenu.security;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    // In-memory user store for demo purposes
    // TODO: Replace with actual database-backed implementation
    private final Map<String, UserDetails> users = new HashMap<>();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void init() {
        // Create sample users for testing
        // Password: admin123
        users.put("admin", User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_ADMIN"),
                        new SimpleGrantedAuthority("ROLE_USER")
                ))
                .build());

        // Password: owner123
        users.put("restaurant_owner", User.builder()
                .username("restaurant_owner")
                .password(passwordEncoder.encode("owner123"))
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_RESTAURANT_OWNER"),
                        new SimpleGrantedAuthority("ROLE_USER")
                ))
                .build());

        // Password: user123
        users.put("user", User.builder()
                .username("user")
                .password(passwordEncoder.encode("user123"))
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_USER")
                ))
                .build());

        log.info("Initialized {} sample users for authentication", users.size());
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        log.debug("Loading user by username: {}", username);

        UserDetails userDetails = users.get(username);

        if (userDetails == null) {
            log.warn("User not found: {}", username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        log.debug("User found: {} with roles: {}", username, userDetails.getAuthorities());
        return userDetails;
    }
}
