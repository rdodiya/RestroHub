package com.restroly.qrmenu.user.controller;

import com.restroly.qrmenu.user.dto.UserProfileRequestDTO;
import com.restroly.qrmenu.user.dto.UserProfileResponseDTO;
import com.restroly.qrmenu.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> getCurrentUserProfile() {
        log.info("Fetching current authenticated user profile");
        UserProfileResponseDTO profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> updateUserProfile(
            @Valid @RequestBody UserProfileRequestDTO request) {
        log.info("Updating current authenticated user profile");
        UserProfileResponseDTO updatedProfile = userService.updateUserProfile(request);
        return ResponseEntity.ok(updatedProfile);
    }
}