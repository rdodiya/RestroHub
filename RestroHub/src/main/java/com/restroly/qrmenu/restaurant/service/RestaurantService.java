package com.restroly.qrmenu.restaurant.service;

import com.restroly.qrmenu.restaurant.dto.RestaurantRequestDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantResponseDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantUpdateDTO;

public interface RestaurantService {

    RestaurantResponseDTO createRestaurant(RestaurantRequestDTO requestDTO);

    RestaurantResponseDTO getRestaurantById(Long id);

    RestaurantResponseDTO getRestaurantByName(String name);

    RestaurantResponseDTO updateRestaurant(Long id, RestaurantUpdateDTO updateDTO);

    void deleteRestaurant(Long id);

}
