package com.restroly.qrmenu.user.service;

import com.restroly.qrmenu.user.dto.RoleResponse;
import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.exception.DuplicateResourceException;
import com.restroly.qrmenu.user.exception.UserNotFoundException;
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

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // =============================
    // REGISTER USER
    // =============================
    @Override
    public UserResponse registerUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "User with email '" + request.getEmail() + "' already exists");
        }

        if (request.getPhone() != null &&
                userRepository.existsByPhoneNumber(request.getPhone())) {
            throw new DuplicateResourceException(
                    "User with phone '" + request.getPhone() + "' already exists");
        }

        User user = User.builder()
                .name(request.getFirstName() + " " + request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhone())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isLocked(false)
                .build();

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {

            List<Role> roles = roleRepository.findByIdIn(request.getRoleIds())
                    .stream()
                    .toList(); // Java 16+
            // .collect(Collectors.toList()); // Java 8+

            user.setRoles(roles);

        } else {
            roleRepository.findByName("ROLE_USER")
                    .ifPresent(role -> user.setRoles(List.of(role)));
        }

        return mapToResponse(userRepository.save(user));
    }

    // =============================
    // GET USER BY ID
    // =============================
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {

        User user = userRepository.findByUserIdWithRoles(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return mapToResponse(user);
    }

    // =============================
    // GET USER BY EMAIL
    // =============================
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmailWithRoles(email)
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

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            List<Role> roles = roleRepository.findByIdIn(request.getRoleIds())
                    .stream()
                    .collect(Collectors.toList());
            user.setRoles(roles);
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

    // =============================
    // ASSIGN ROLES
    // =============================
    @Override
    public UserResponse assignRolesToUser(Long userId, Set<Long> roleIds) {

        User user = userRepository.findByUserIdWithRoles(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.getRoles().addAll(roleRepository.findByIdIn(roleIds));

        return mapToResponse(userRepository.save(user));
    }

    // =============================
    // REMOVE ROLES
    // =============================
    @Override
    public UserResponse removeRolesFromUser(Long userId, Set<Long> roleIds) {

        User user = userRepository.findByUserIdWithRoles(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.getRoles().removeIf(role -> roleIds.contains(role.getId()));

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
                user.getRoles() == null ? null :
                        user.getRoles().stream()
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
}
