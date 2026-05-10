package com.restroly.qrmenu.admin.dashboard.service;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;

import java.util.List;

public interface DashboardService {

    List<DashboardStatDTO> getDashboardStats();
}
