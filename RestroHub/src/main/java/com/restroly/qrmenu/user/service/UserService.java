package com.restroly.qrmenu.user.service;

import com.restroly.qrmenu.user.dto.UserRequest;
import com.restroly.qrmenu.user.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface UserService {

    public UserResponse registerUser(UserRequest request);
    public UserResponse getUserById(Long userId);
    public UserResponse getUserByEmail(String email);
    public Page<UserResponse> getAllUsers(Pageable pageable);
    public List<UserResponse> getAllUsers();
    public UserResponse updateUser(Long userId, UserRequest request);
    public UserResponse assignRolesToUser(Long userId, Set<Long> roleIds);
    public void deleteUser(Long userId);
    public UserResponse toggleUserStatus(Long userId);
    public UserResponse removeRolesFromUser(Long userId, Set<Long> roleIds);
    public boolean existsByEmail(String email);

}