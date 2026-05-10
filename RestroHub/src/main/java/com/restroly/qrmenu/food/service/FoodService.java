// src/main/java/com/Restroly/qrmenu/food/service/FoodService.java
package com.restroly.qrmenu.food.service;

import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.food.dto.*;
import com.restroly.qrmenu.food.dto.FoodRequestDTO;
import com.restroly.qrmenu.food.dto.FoodResponseDTO;
import com.restroly.qrmenu.food.dto.FoodUpdateDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.lang.Long;
import java.math.BigDecimal;
import java.util.List;

public interface FoodService {

    FoodResponseDTO getFoodById(Long id);

    FoodResponseDTO createFood(FoodRequestDTO requestDTO, MultipartFile image);

    FoodResponseDTO getFoodByName(String name);

    PageResponseDTO<FoodResponseDTO> getAllFoods(Pageable pageable);

    PageResponseDTO<FoodResponseDTO> getAvailableFoods(Pageable pageable);

    PageResponseDTO<FoodResponseDTO> getFoodsByCategory(Long category, Pageable pageable);

    PageResponseDTO<FoodResponseDTO> searchFoods(
            String name,
            String category,
            Boolean isAvailable,
            Boolean isVegetarian,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable);

    FoodResponseDTO updateFood(Long id, FoodUpdateDTO updateDTO, MultipartFile image);

    FoodResponseDTO updateAvailability(Long id, Boolean isAvailable);

    void deleteFood(Long id);

    List<String> getAllCategories();

    boolean existsById(Long id);

    boolean existsByName(String name);
}