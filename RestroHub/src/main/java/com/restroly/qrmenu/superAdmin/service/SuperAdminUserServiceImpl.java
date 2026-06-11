package com.restroly.qrmenu.superAdmin.service;

import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;
import com.restroly.qrmenu.superAdmin.dto.AssignRoleRequest;
import com.restroly.qrmenu.superAdmin.dto.AssignRoleResponse;
import com.restroly.qrmenu.superAdmin.dto.PendingCustomerResponse;
import com.restroly.qrmenu.superAdmin.dto.RestaurantInfo;
import com.restroly.qrmenu.superAdmin.entity.UserRoleRestaurant;
import com.restroly.qrmenu.superAdmin.repository.UserRoleRestaurantRepository;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import com.restroly.qrmenu.user.repository.RoleRepository;
import com.restroly.qrmenu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuperAdminUserServiceImpl implements SuperAdminUserService {

    private final UserRoleRestaurantRepository userRoleRestaurantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    public Page<PendingCustomerResponse> fetchAllPendingCustomers(Pageable pageable) {

        return userRoleRestaurantRepository.findPendingCustomers(pageable).map(this::mapToResponse);
    }

    private PendingCustomerResponse mapToResponse(UserRoleRestaurant urr) {

        User user = urr.getUser();
        Restaurant restaurant = urr.getRestaurant();

        return PendingCustomerResponse.builder().userId(user.getUserId()).fullName(user.getName()).email(user.getEmail()).phoneNumber(user.getPhoneNumber()).active(user.isActive()).locked(user.isLocked()).authProvider(user.getAuthProvider()).createdAt(user.getCreatedAt()).updatedDate(user.getUpdatedDate())

                .restaurant(RestaurantInfo.builder().restaurantId(restaurant.getRestId()).restaurantName(restaurant.getName()).restaurantDescription(restaurant.getDescription()).restaurantPhoneNumber(restaurant.getPhoneNumber()).restaurantActive(restaurant.getIsActive()).serviceRequestEnabled(restaurant.getServiceRequestEnabled()).build()).build();
    }

    @Override
    public AssignRoleResponse assignRole(AssignRoleRequest request) {

        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(request.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId()).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        UserRoleRestaurant assignment = userRoleRestaurantRepository.findByUserUserIdAndRestaurantRestId(user.getUserId(), restaurant.getRestId()).orElseThrow(() -> new ResourceNotFoundException("Pending assignment not found"));

        assignment.setRole(role);
        assignment.setActive(true);

        userRoleRestaurantRepository.save(assignment);

        user.setIsActive(request.getActivateUser());

        userRepository.save(user);

        return AssignRoleResponse.builder().userId(user.getUserId()).userName(user.getName()).roleName(role.getName()).restaurantName(restaurant.getName()).active(user.isActive()).build();
    }

    @Override
    public AssignRoleResponse updateRole(AssignRoleRequest request) {

        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(request.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId()).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        UserRoleRestaurant assignment = userRoleRestaurantRepository.findByUserUserIdAndRestaurantRestId(user.getUserId(), restaurant.getRestId()).orElseThrow(() -> new ResourceNotFoundException("Pending assignment not found"));

        assignment.setRole(role);
        assignment.setActive(true);

        user.setIsActive(request.getActivateUser());

        return AssignRoleResponse.builder().userId(user.getUserId()).userName(user.getName()).roleName(role.getName()).restaurantName(restaurant.getName()).active(user.isActive()).build();
    }

    @Override
    public AssignRoleResponse updateUserStatus(AssignRoleRequest request) {

        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserRoleRestaurant assignment = userRoleRestaurantRepository.findByUserUserId(user.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Pending assignment not found"));

        assignment.setActive(request.getActivateUser());
        user.setIsActive(request.getActivateUser());

        return AssignRoleResponse.builder().userId(user.getUserId()).userName(user.getName()).build();
    }
}