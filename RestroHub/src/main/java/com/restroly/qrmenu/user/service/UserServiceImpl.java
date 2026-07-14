package com.restroly.qrmenu.user.service;

import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.restroly.qrmenu.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.user.dto.RoleResponse;
import com.restroly.qrmenu.user.dto.UserProfileRequestDTO;
import com.restroly.qrmenu.user.dto.UserProfileResponseDTO;
import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.exception.DuplicateResourceException;
import com.restroly.qrmenu.exception.UserNotFoundException;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;

    // =============================
    // REGISTER USER
    // =============================
//    @Override
//    public UserResponse registerUser(UserRequest request) {
//
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new DuplicateResourceException(
//                    "User with email '" + request.getEmail() + "' already exists");
//        }
//
//        if (request.getPhone() != null &&
//                userRepository.existsByPhoneNumber(request.getPhone())) {
//            throw new DuplicateResourceException(
//                    "User with phone '" + request.getPhone() + "' already exists");
//        }
//
//        User user = User.builder()
//                .name(request.getFirstName() + " " + request.getLastName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .phoneNumber(request.getPhone())
//                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
//                .isLocked(false)
//                .build();
//
//        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
//
//            List<Role> roles = roleRepository.findByIdIn(request.getRoleIds())
//                    .stream()
//                    .toList(); // Java 16+
//            // .collect(Collectors.toList()); // Java 8+
//
//            user.setRoles(roles);
//
//        } else {
//            // Default to the CUSTOMER role which is used across auth flows
//            Role customerRole = roleRepository.findByName("CUSTOMER")
//        .orElseThrow(() ->
//                new IllegalStateException("Default CUSTOMER role not found"));
//
//        user.setRoles(
//                new ArrayList<>(Collections.singletonList(customerRole)));
//        }
//
//        User savedUser = userRepository.save(user);
//        createRestaurantIfRequested(request);
//
//        return mapToResponse(savedUser);
//    }

    private void createRestaurantIfRequested(UserRequest request) {
        if (request.getRestaurantName() == null || request.getRestaurantName().isBlank()) {
            return;
        }

        String restaurantName = request.getRestaurantName().trim();
        if (restaurantRepository.existsByNameIgnoreCase(restaurantName)) {
            throw new ResourceAlreadyExistsException(
                    "Restaurant already exists with name: " + restaurantName);
        }

        Restaurant restaurant = Restaurant.builder()
                .name(restaurantName)
                .description(normalizeRestaurantDescription(request, restaurantName))
                .phoneNumber(normalizeOptionalText(request.getRestaurantPhoneNumber()))
                .isActive(true)
                .build();

        restaurantRepository.save(restaurant);
    }

    private String normalizeRestaurantDescription(UserRequest request, String restaurantName) {
        String description = normalizeOptionalText(request.getRestaurantDescription());
        return description != null ? description : restaurantName;
    }

    private String normalizeOptionalText(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    // =============================
    // GET USER BY ID
    // =============================
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return mapToResponse(user);
    }

    // =============================
    // GET USER BY EMAIL
    // =============================
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with email: " + email));

        return mapToResponse(user);
    }

    // =============================
    // GET ALL USERS
    // =============================
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // =============================
    // UPDATE USER
    // =============================
    @Override
    public UserResponse updateUser(Long userId, UserRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (request.getEmail() != null &&
                !request.getEmail().equals(user.getEmail())) {

            if (userRepository.existsByEmailAndUserIdNot(request.getEmail(), userId)) {
                throw new DuplicateResourceException(
                        "User with email '" + request.getEmail() + "' already exists");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null &&
                !request.getPhone().equals(user.getPhoneNumber())) {

            if (userRepository.existsByPhoneNumberAndUserIdNot(request.getPhone(), userId)) {
                throw new DuplicateResourceException(
                        "User with phone '" + request.getPhone() + "' already exists");
            }
            user.setPhoneNumber(request.getPhone());
        }

        if (request.getFirstName() != null || request.getLastName() != null) {
            user.setName(
                    (request.getFirstName() != null ? request.getFirstName() : "") +
                            " " +
                            (request.getLastName() != null ? request.getLastName() : "")
            );
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

//        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
//            List<Role> roles = roleRepository.findByIdIn(request.getRoleIds())
//                    .stream()
//                    .collect(Collectors.toList());
//            user.setRoles(roles);
//        }
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Restaurant restaurant = restaurantRepository.findByNameIgnoreCase(request.getRestaurantName())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
            List<Role> roles = roleRepository.findByIdIn(request.getRoleIds());
            user.clearUserRoleRestaurants();
            for (Role role : roles) {
                user.addUserRoleRestaurant(role, restaurant);
            }
        }

        return mapToResponse(userRepository.save(user));
    }

    // =============================
    // DELETE USER
    // =============================
    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse assignRolesToUser(
            Long userId,
            Set<Long> roleIds) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        UserRoleRestaurant existingAssignment = user.getUserRoleRestaurants()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User has no restaurant assigned"));

        Restaurant restaurant = existingAssignment.getRestaurant();

        List<Role> roles = roleRepository.findByIdIn(roleIds);

        for (Role role : roles) {

            boolean alreadyAssigned = user.getUserRoleRestaurants()
                    .stream()
                    .anyMatch(urr ->
                            urr.getRole().getId().equals(role.getId()) &&
                                    urr.getRestaurant().getRestId() == restaurant.getRestId()
                    );

            if (!alreadyAssigned) {

                UserRoleRestaurant urr = UserRoleRestaurant.builder()
                        .user(user)
                        .role(role)
                        .restaurant(restaurant)
                        .build();

                user.getUserRoleRestaurants().add(urr);
            }
        }

        return mapToResponse(userRepository.save(user));
    }

    // =============================
    // REMOVE ROLES
    // =============================
    @Transactional
    public UserResponse removeRolesFromUser(
            Long userId,
            Set<Long> roleIds) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.getUserRoleRestaurants().removeIf(urr ->
                roleIds.contains(urr.getRole().getId())
        );

        return mapToResponse(userRepository.save(user));
    }

    // =============================
    // TOGGLE STATUS
    // =============================
    @Override
    public UserResponse toggleUserStatus(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setIsActive(!user.isActive());

        return mapToResponse(userRepository.save(user));
    }

    public boolean existsByEmail(String email) {

        return userRepository.existsByEmail(email);
    }

    // =============================
    // ENTITY → RESPONSE
    // =============================
    private UserResponse mapToResponse(User user) {

        Set<RoleResponse> roles =
                user.getUserRoleRestaurants() == null ? null :
                        user.getUserRoleRestaurants().stream()
                                .map(UserRoleRestaurant::getRole)
                                .distinct()
                                .map(role -> RoleResponse.builder()
                                        .id(role.getId())
                                        .name(role.getName())
                                        .description(role.getDescription())
                                        .isActive(role.getIsActive())
                                        .build())
                                .collect(Collectors.toSet());

        String[] names = user.getName() != null
                ? user.getName().split(" ", 2)
                : new String[]{"", ""};

        return UserResponse.builder()
                .id(user.getUserId())
                .firstName(names[0])
                .lastName(names.length > 1 ? names[1] : "")
                .fullName(user.getName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .isActive(user.isActive())
                .roles(roles)
                .build();
    }

@Override
public UserProfileResponseDTO getCurrentUserProfile() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new UserNotFoundException(
                    "User not found with email: " + email));

    return UserProfileResponseDTO.builder()
            .userId(user.getUserId())
            .name(user.getName())
            .email(user.getEmail())
            .phoneNumber(user.getPhoneNumber())
            .profileImage(encodeProfileImage(user.getUserProfile()))
            .build();
}

private String encodeProfileImage(byte[] imageBytes) {
    if (imageBytes == null || imageBytes.length == 0) {
        return null;
    }
    return Base64.getEncoder().encodeToString(imageBytes);
}

    @Override
    @Transactional
    public UserProfileResponseDTO updateUserProfile(UserProfileRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmailWithUserRoleRestaurants(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        log.info("Updating profile for user: {}", email);
        log.info("Incoming request: {}", request);

        // Update name
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        // Update phone
        if (request.getPhoneNumber() != null &&
                !request.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        // Update profile image
        if (request.getProfileImageBytes() != null &&
                request.getProfileImageBytes().length > 0) {

            log.info("Updating profile image for user: {}", email);

            user.setUserProfile(request.getProfileImageBytes());
        }

        // Validate email
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalStateException(
                    "User email became null during profile update");
        }

        // Validate role assignments
        if (user.getUserRoleRestaurants() == null ||
                user.getUserRoleRestaurants().isEmpty()) {

            throw new IllegalStateException(
                    "User role assignments became empty during profile update");
        }

        User updatedUser = userRepository.save(user);

        log.info("Profile updated successfully for user: {}", email);

        return UserProfileResponseDTO.builder()
                .userId(updatedUser.getUserId())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .phoneNumber(updatedUser.getPhoneNumber())
                .profileImage(encodeProfileImage(updatedUser.getUserProfile()))
                .build();
    }
}