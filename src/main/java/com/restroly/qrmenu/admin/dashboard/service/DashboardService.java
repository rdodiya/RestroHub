package com.restroly.qrmenu.admin.dashboard.service;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;

import java.util.List;

@FunctionalInterface
public interface DashboardService {

    List<DashboardStatDTO> getDashboardStats();
}
