package com.restroly.qrmenu.menu.mapper;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.category.entity.Category;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.menu.dto.MenuRequestDTO;
import com.restroly.qrmenu.menu.dto.MenuResponseDTO;
import com.restroly.qrmenu.menu.entity.Menu;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MenuMapper {

    // ========== REQUEST DTO → ENTITY ==========
    public Menu toEntity(MenuRequestDTO dto, Branch branch, List<Category> categories) {
        if (dto == null) return null;

        return Menu.builder()
                .menuName(dto.getMenuName())
                .menuDesc(dto.getMenuDesc())
                .isDeleted(dto.getIsDeleted() != null ? dto.getIsDeleted() : false)
                .branch(branch)
                .categories(categories != null ? categories : new ArrayList<>())
                .createdDate(new Date(System.currentTimeMillis()))
                .updatedDate(new Date(System.currentTimeMillis()))
                .build();
    }

    // ========== ENTITY → RESPONSE DTO ==========
    public MenuResponseDTO toResponseDTO(Menu menu) {
        if (menu == null) return null;

        return MenuResponseDTO.builder()
                .menuId(menu.getMenuId())
                .menuName(menu.getMenuName())
                .menuDesc(menu.getMenuDesc())
                .isDeleted(menu.isDeleted())
                .createdDate(menu.getCreatedDate())
                .updatedDate(menu.getUpdatedDate())
                .branch(toBranchDTO(menu.getBranch()))
                .categories(toCategoryDTOList(menu.getCategories()))
                .categoryCount(menu.getCategories() != null ? menu.getCategories().size() : 0)
                .build();
    }

    // ========== ENTITY → SUMMARY DTO (lightweight) ==========
    public MenuResponseDTO toSummaryDTO(Menu menu) {
        if (menu == null) return null;

        return MenuResponseDTO.builder()
                .menuId(menu.getMenuId())
                .menuName(menu.getMenuName())
                .menuDesc(menu.getMenuDesc())
                .isDeleted(menu.isDeleted())
                .createdDate(menu.getCreatedDate())
                .branch(toBranchDTO(menu.getBranch()))
                .categoryCount(menu.getCategories() != null ? menu.getCategories().size() : 0)
                .build();
    }

    // ========== LIST CONVERSIONS ==========
    public List<MenuResponseDTO> toResponseDTOList(List<Menu> menus) {
        if (menus == null) return Collections.emptyList();
        return menus.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<MenuResponseDTO> toSummaryDTOList(List<Menu> menus) {
        if (menus == null) return Collections.emptyList();
        return menus.stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    // ========== UPDATE ENTITY FROM DTO ==========
    public void updateEntityFromDTO(Menu menu, MenuRequestDTO dto,
                                    Branch branch, List<Category> categories) {
        if (dto == null || menu == null) return;

        menu.setMenuName(dto.getMenuName());
        menu.setMenuDesc(dto.getMenuDesc());
        menu.setUpdatedDate(new Date(System.currentTimeMillis()));

        if (dto.getIsDeleted() != null) {
            menu.setDeleted(dto.getIsDeleted());
        }

        if (branch != null) {
            menu.setBranch(branch);
        }

        if (categories != null) {
            menu.setCategories(categories);
        }
    }

    // ========== PRIVATE HELPER METHODS ==========

    private MenuResponseDTO.BranchDTO toBranchDTO(Branch branch) {
        if (branch == null) return null;

        String city = null;
        String fullAddress = null;

        if (branch.getAddress() != null) {
            city = branch.getAddress().getCity();
            fullAddress = buildFullAddress(branch);
        }

        return MenuResponseDTO.BranchDTO.builder()
                .branchId(branch.getBranchId())
                .name(branch.getName())
                .description(branch.getDescription())
                .build();
    }

    private MenuResponseDTO.CategoryDTO toCategoryDTO(Category category) {
        if (category == null) return null;

        return MenuResponseDTO.CategoryDTO.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    private List<MenuResponseDTO.CategoryDTO> toCategoryDTOList(List<Category> categories) {
        if (categories == null) return Collections.emptyList();
        return categories.stream()
                .map(this::toCategoryDTO)
                .collect(Collectors.toList());
    }

    private String buildFullAddress(Branch branch) {
        if (branch.getAddress() == null) return null;

        StringBuilder sb = new StringBuilder();
        var address = branch.getAddress();

        if (address.getAdd1() != null && !address.getAdd1().isEmpty())
            sb.append(address.getAdd1());
        if (address.getAdd2() != null && !address.getAdd2().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getAdd2());
        }
        if (address.getCity() != null && !address.getCity().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCity());
        }
        if (address.getState() != null && !address.getState().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getState());
        }
        if (address.getPostalCode() != null && !address.getPostalCode().isEmpty()) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(address.getPostalCode());
        }

        return sb.length() > 0 ? sb.toString() : null;
    }

    // Inside your service/mapper where you build MenuResponseDTO

    public MenuResponseDTO buildMenuResponse(Menu menu) {

        // Map branch
        MenuResponseDTO.BranchDTO branchDTO = null;
        if (menu.getBranch() != null) {
            Branch branch = menu.getBranch();
            branchDTO = MenuResponseDTO.BranchDTO.builder()
                    .branchId(branch.getBranchId())
                    .name(branch.getName())
                    .description(branch.getDescription())
                    .address(MenuResponseDTO.AddressDTO.builder()
                            .city(branch.getAddress().getCity())
                            .state(branch.getAddress().getState())
                            .fullAddress(branch.getAddress().getAdd1()+branch.getAddress().getAdd2())
                            .build())
                    .build();
        }

        // Map categories with their food items
        List<MenuResponseDTO.CategoryDTO> categoryDTOs = new ArrayList<>();
        int totalFoodCount = 0;

        if (menu.getCategories() != null) {
            for (Category category : menu.getCategories()) {

                // Get foods for this category within this menu
                List<MenuResponseDTO.FoodDTO> foodDTOs = new ArrayList<>();
                if (category.getFoods() != null) {
                    for (Food food : category.getFoods()) {
                        foodDTOs.add(MenuResponseDTO.FoodDTO.builder()
                                .foodId(food.getFoodId())
                                .name(food.getName())
                                .description(food.getDescription())
                                .price(food.getPrice())
                                .imageUrl(food.getImageUrl())
                                .isAvailable(food.getIsAvailable())
                                .isVeg(food.getIsVeg())
                                .build());
                    }
                }

                totalFoodCount += foodDTOs.size();

                categoryDTOs.add(MenuResponseDTO.CategoryDTO.builder()
                        .categoryId(category.getCategoryId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .foods(foodDTOs)
                        .foodCount(foodDTOs.size())
                        .build());
            }
        }

        return MenuResponseDTO.builder()
                .menuId(menu.getMenuId())
                .menuName(menu.getMenuName())
                .menuDesc(menu.getMenuDesc())
                .isDeleted(menu.isDeleted())
                .createdDate(menu.getCreatedDate())
                .updatedDate(menu.getUpdatedDate())
                .branch(branchDTO)
                .categories(categoryDTOs)
                .categoryCount(categoryDTOs.size())
                .totalFoodCount(totalFoodCount)
                .build();
    }
}