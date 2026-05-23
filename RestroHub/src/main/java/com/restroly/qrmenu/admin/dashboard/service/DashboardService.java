package com.restroly.qrmenu.admin.dashboard.service;

import com.restroly.qrmenu.admin.dashboard.dto.DashboardStatDTO;

import java.util.List;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface DashboardService {

    List<DashboardStatDTO> getDashboardStats();

}
