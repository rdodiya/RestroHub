package com.restroly.qrmenu.menu.service;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.category.entity.Category;
import com.restroly.qrmenu.category.repository.CategoryRepository;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.menu.dto.MenuRequestDTO;
import com.restroly.qrmenu.menu.dto.MenuResponseDTO;
import com.restroly.qrmenu.menu.entity.Menu;
import com.restroly.qrmenu.menu.mapper.MenuMapper;
import com.restroly.qrmenu.menu.repository.MenuRepository;
import com.restroly.qrmenu.menu.service.MenuService;

import com.restroly.qrmenu.user.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final BranchRepository branchRepository;
    private final CategoryRepository categoryRepository;
    private final MenuMapper menuMapper;

    // ========== CREATE ==========
    @Override
    public MenuResponseDTO createMenu(MenuRequestDTO requestDTO) {
        log.info("Creating new menu: {}", requestDTO.getMenuName());

        // Validate branch if provided
        Branch branch = null;
        if (requestDTO.getBranchId() != null) {
            branch = branchRepository.findById(requestDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch not found with ID: " + requestDTO.getBranchId()));

            // Check duplicate name within same branch
            if (menuRepository.existsByMenuNameAndBranch_BranchId(
                    requestDTO.getMenuName(), requestDTO.getBranchId())) {
                throw new DuplicateResourceException(
                        "Menu with name '" + requestDTO.getMenuName() +
                                "' already exists for this branch");
            }
        }

        // Resolve categories
        List<Category> categories = resolveCategories(requestDTO.getCategoryIds());

        // Build entity
        Menu menu = menuMapper.toEntity(requestDTO, branch, categories);

        // Save
        Menu savedMenu = menuRepository.save(menu);
        log.info("Menu created successfully with ID: {}", savedMenu.getMenuId());

        return menuMapper.toResponseDTO(savedMenu);
    }

    // ========== GET BY ID ==========
    @Override
    @Transactional(readOnly = true)
    public MenuResponseDTO getMenuById(Long menuId) {
        log.debug("Fetching menu with ID: {}", menuId);

        Menu menu = menuRepository.findByMenuIdAndIsDeletedFalse(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Menu not found with ID: " + menuId));

        return menuMapper.toResponseDTO(menu);
    }

    // ========== GET ALL (Paginated) ==========
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<MenuResponseDTO> getAllMenus(Pageable pageable) {
        log.debug("Fetching all menus with pagination");

        Page<Menu> menuPage = menuRepository.findByIsDeletedFalse(pageable);

        List<MenuResponseDTO> content = menuMapper.toSummaryDTOList(menuPage.getContent());

        return PageResponseDTO.<MenuResponseDTO>builder()
                .content(content)
                .pageNumber(menuPage.getNumber())
                .pageSize(menuPage.getSize())
                .totalElements(menuPage.getTotalElements())
                .totalPages(menuPage.getTotalPages())
                .first(menuPage.isFirst())
                .last(menuPage.isLast())
                .build();
    }

    // ========== GET BY BRANCH ==========
    @Override
    @Transactional(readOnly = true)
    public List<MenuResponseDTO> getMenusByBranchId(Long branchId) {
        log.debug("Fetching menus for branch ID: {}", branchId);

        if (!branchRepository.existsById(branchId)) {
            throw new ResourceNotFoundException("Branch not found with ID: " + branchId);
        }

        List<Menu> menus = menuRepository.findByBranch_BranchIdAndIsDeletedFalse(branchId);

        return menuMapper.toResponseDTOList(menus);
    }

    // ========== UPDATE ==========
    @Override
    public MenuResponseDTO updateMenu(Long menuId, MenuRequestDTO requestDTO) {
        log.info("Updating menu with ID: {}", menuId);

        // Find existing menu
        Menu existingMenu = menuRepository.findByMenuIdAndIsDeletedFalse(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Menu not found with ID: " + menuId));

        // Validate branch if provided
        Branch branch = null;
        if (requestDTO.getBranchId() != null) {
            branch = branchRepository.findById(requestDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch not found with ID: " + requestDTO.getBranchId()));

            // Check duplicate name (excluding current menu)
            if (menuRepository.existsByMenuNameAndBranch_BranchIdAndMenuIdNot(
                    requestDTO.getMenuName(), requestDTO.getBranchId(), menuId)) {
                throw new DuplicateResourceException(
                        "Menu with name '" + requestDTO.getMenuName() +
                                "' already exists for this branch");
            }
        }

        // Resolve categories
        List<Category> categories = resolveCategories(requestDTO.getCategoryIds());

        // Update entity
        menuMapper.updateEntityFromDTO(existingMenu, requestDTO, branch, categories);

        // Save
        Menu updatedMenu = menuRepository.save(existingMenu);
        log.info("Menu updated successfully with ID: {}", updatedMenu.getMenuId());

        return menuMapper.toResponseDTO(updatedMenu);
    }

    // ========== SOFT DELETE ==========
    @Override
    public void deleteMenu(Long menuId) {
        log.info("Soft deleting menu with ID: {}", menuId);

        Menu menu = menuRepository.findByMenuIdAndIsDeletedFalse(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Menu not found with ID: " + menuId));

        menu.setDeleted(true);
        menuRepository.save(menu);

        log.info("Menu soft deleted successfully with ID: {}", menuId);
    }

    // ========== HARD DELETE ==========
    @Override
    public void hardDeleteMenu(Long menuId) {
        log.info("Hard deleting menu with ID: {}", menuId);

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Menu not found with ID: " + menuId));

        menuRepository.delete(menu);

        log.info("Menu hard deleted successfully with ID: {}", menuId);
    }

    // ========== RESTORE ==========
    @Override
    public MenuResponseDTO restoreMenu(Long menuId) {
        log.info("Restoring menu with ID: {}", menuId);

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Menu not found with ID: " + menuId));

        if (!menu.isDeleted()) {
            log.warn("Menu with ID: {} is already active", menuId);
            return menuMapper.toResponseDTO(menu);
        }

        menu.setDeleted(false);
        Menu restoredMenu = menuRepository.save(menu);

        log.info("Menu restored successfully with ID: {}", menuId);

        return menuMapper.toResponseDTO(restoredMenu);
    }

    // ========== SEARCH ==========
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<MenuResponseDTO> searchMenus(String keyword, Long branchId,
                                                        Pageable pageable) {
        log.debug("Searching menus - keyword: {}, branchId: {}", keyword, branchId);

        Page<Menu> menuPage;

        if (branchId != null) {
            menuPage = menuRepository.searchByKeywordAndBranch(keyword, branchId, pageable);
        } else {
            menuPage = menuRepository.searchByKeyword(keyword, pageable);
        }

        List<MenuResponseDTO> content = menuMapper.toSummaryDTOList(menuPage.getContent());

        return PageResponseDTO.<MenuResponseDTO>builder()
                .content(content)
                .pageNumber(menuPage.getNumber())
                .pageSize(menuPage.getSize())
                .totalElements(menuPage.getTotalElements())
                .totalPages(menuPage.getTotalPages())
                .first(menuPage.isFirst())
                .last(menuPage.isLast())
                .build();
    }

    // ========== COUNT ==========
    @Override
    @Transactional(readOnly = true)
    public long countMenus() {
        return menuRepository.countByIsDeletedFalse();
    }

    @Override
    @Transactional(readOnly = true)
    public long countMenusByBranch(Long branchId) {
        return menuRepository.countByBranch_BranchIdAndIsDeletedFalse(branchId);
    }

    // ========== EXISTS ==========
    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String menuName, Long branchId) {
        return menuRepository.existsByMenuNameAndBranch_BranchId(menuName, branchId);
    }

    // ========== PRIVATE HELPERS ==========

    private List<Category> resolveCategories(List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Category> categories = categoryRepository.findAllById(categoryIds);

        // Validate all IDs were found
        if (categories.size() != categoryIds.size()) {
            List<Long> foundIds = categories.stream()
                    .map(Category::getCategoryId)
                    .toList();
            List<Long> missingIds = categoryIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new ResourceNotFoundException(
                    "Categories not found with IDs: " + missingIds);
        }

        return categories;
    }
}
