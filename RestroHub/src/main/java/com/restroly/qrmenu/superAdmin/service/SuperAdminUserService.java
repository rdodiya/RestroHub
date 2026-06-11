package com.restroly.qrmenu.superAdmin.service;

import com.restroly.qrmenu.superAdmin.dto.AssignRoleRequest;
import com.restroly.qrmenu.superAdmin.dto.AssignRoleResponse;
import com.restroly.qrmenu.superAdmin.dto.PendingCustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SuperAdminUserService {

    Page<PendingCustomerResponse> fetchAllPendingCustomers(
            Pageable pageable);

    AssignRoleResponse assignRole(
            AssignRoleRequest request);

    AssignRoleResponse updateRole(
            AssignRoleRequest request);

    AssignRoleResponse updateUserStatus(
            AssignRoleRequest request);
}
