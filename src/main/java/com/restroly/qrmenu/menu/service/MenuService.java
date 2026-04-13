package com.restroly.qrmenu.menu.service;

import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.menu.dto.MenuRequestDTO;
import com.restroly.qrmenu.menu.dto.MenuResponseDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MenuService {

    // ========== CREATE ==========
    MenuResponseDTO createMenu(MenuRequestDTO requestDTO);

    // ========== READ ==========
    MenuResponseDTO getMenuById(Long menuId);

    PageResponseDTO<MenuResponseDTO> getAllMenus(Pageable pageable);

    List<MenuResponseDTO> getMenusByBranchId(Long branchId);

    // ========== UPDATE ==========
    MenuResponseDTO updateMenu(Long menuId, MenuRequestDTO requestDTO);

    // ========== DELETE ==========
    void deleteMenu(Long menuId);

    void hardDeleteMenu(Long menuId);

    // ========== RESTORE ==========
    MenuResponseDTO restoreMenu(Long menuId);

    // ========== SEARCH ==========
    PageResponseDTO<MenuResponseDTO> searchMenus(String keyword, Long branchId, Pageable pageable);

    // ========== COUNT ==========
    long countMenus();

    long countMenusByBranch(Long branchId);

    // ========== EXISTS ==========
    boolean existsByName(String menuName, Long branchId);
}