package com.restroly.qrmenu.security;

import com.restroly.qrmenu.security.exception.UserDisabledException;
import com.restroly.qrmenu.security.exception.UserLockedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final com.restroly.qrmenu.user.repository.UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);

        com.restroly.qrmenu.user.entity.User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> {
                    log.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
        // Check if the user account is active
        if (!user.isActive()) {
            log.warn("User account is inactive: {}", email);
            throw new UserDisabledException("User account is inactive");
        }

        // Check if the user account is locked
        if (user.isLocked()) {
            log.warn("User account is locked: {}", email);
            throw new UserLockedException("User account is locked");
        }

//        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority(role.getName()))
//                .collect(Collectors.toList());
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        log.debug("User found: {} with roles: {}", email, authorities);

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .disabled(!user.isActive())
                .accountLocked(user.isLocked())
                .authorities(authorities)
                .build();
    }
}
