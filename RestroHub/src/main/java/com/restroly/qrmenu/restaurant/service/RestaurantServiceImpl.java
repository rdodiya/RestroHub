package com.restroly.qrmenu.restaurant.service;

import com.restroly.qrmenu.common.exception.BusinessException;
import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.restaurant.dto.RestaurantRequestDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantResponseDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantUpdateDTO;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.mapper.RestaurantMapper;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;


import com.restroly.qrmenu.subscription.entity.RestaurantSubscription;
import com.restroly.qrmenu.subscription.entity.SubscriptionPlan;
import com.restroly.qrmenu.subscription.enums.SubscriptionType;
import com.restroly.qrmenu.subscription.repository.RestaurantSubscriptionRepository;
import com.restroly.qrmenu.subscription.repository.SubscriptionPlanRepository;
import lombok.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantServiceImpl implements  RestaurantService{

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final SubscriptionPlanRepository planRepository;
    private final RestaurantSubscriptionRepository restaurantSubscriptionRepository;    private static final String RESTAURANT_NOT_FOUND_MSG = "RESTAURANT not found with id: %s";
    private static final String RESTAURANT_EXISTS_MSG = "RESTAURANT already exists with name: %s";

    /**
     * @param requestDTO
     * @return
     */
    @Override
    @Transactional
    public RestaurantResponseDTO createRestaurant(RestaurantRequestDTO requestDTO) {
        log.info("Creating new restaurant: {}", requestDTO.getName());
        if (restaurantRepository.existsByNameIgnoreCase(requestDTO.getName())) {
            log.warn("Attempt to create duplicate food: {}", requestDTO.getName());
            throw new ResourceAlreadyExistsException(
                    String.format(RESTAURANT_EXISTS_MSG, requestDTO.getName()));
        }

        Restaurant restaurant = restaurantMapper.toEntity(requestDTO);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        SubscriptionPlan freePlan = planRepository
                .findByTypeAndActiveTrue(SubscriptionType.FREE)
                .orElseThrow(() -> new BusinessException("FREE plan not found in database.", HttpStatus.INTERNAL_SERVER_ERROR));
        RestaurantSubscription newSubscription = RestaurantSubscription.builder()
                .restId(savedRestaurant.getRestId())
                .plan(freePlan)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusYears(10)) // Free plan lasts 10 years
                .active(true)
                .build();

        restaurantSubscriptionRepository.save(newSubscription);

        log.info("Successfully created food item with id: {}", savedRestaurant.getRestId());
        return restaurantMapper.toResponseDTO(savedRestaurant);
    }

    /**
     * @param id
     * @return
     */
    @Override
    public RestaurantResponseDTO getRestaurantById(Long id) {
        log.debug("Fetching restaurant by id: {}", id);

        Restaurant restaurant = findRestaurantByIdOrThrow(id);
        return restaurantMapper.toResponseDTO(restaurant);
    }

    /**
     * @param name
     * @return
     */
    @Override
    public RestaurantResponseDTO getRestaurantByName(String name) {
        log.debug("Fetching restaurant by name: {}", name);

        Restaurant restaurant = restaurantRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> {
                    log.warn("Restaurant not found with name: {}", name);
                    return new ResourceNotFoundException("Restaurant not found with name: " + name);
                });

        return restaurantMapper.toResponseDTO(restaurant);
    }

    /**
     * @param id
     * @param updateDTO
     * @return
     */
    @Override
    public RestaurantResponseDTO updateRestaurant(Long id, RestaurantUpdateDTO updateDTO) {
        log.info("Updating restaurant with id: {}", id);

        Restaurant existingRestaurant = findRestaurantByIdOrThrow(id);

        // Check for duplicate name if name is being updated
        if (updateDTO.getName() != null &&
                !updateDTO.getName().equalsIgnoreCase(existingRestaurant.getName()) &&
                restaurantRepository.existsByNameIgnoreCase(updateDTO.getName())) {

            log.warn("Attempt to update food with duplicate name: {}", updateDTO.getName());
            throw new ResourceAlreadyExistsException(
                    String.format(RESTAURANT_EXISTS_MSG, updateDTO.getName()));
        }

        restaurantMapper.updateEntityFromDTO(updateDTO, existingRestaurant);
        Restaurant updatedRestaurant = restaurantRepository.save(existingRestaurant);

        log.info("Successfully updated restaurant with id: {}", id);
        return restaurantMapper.toResponseDTO(updatedRestaurant);
    }

    /**
     * @param id
     */
    @Override
    public void deleteRestaurant(Long id) {
        log.info("Deleting restaurant with id: {}", id);

        if (!restaurantRepository.existsById(id)) {
            log.warn("Attempt to delete non-existent restaurant with id: {}", id);
            throw new ResourceNotFoundException(String.format(RESTAURANT_NOT_FOUND_MSG, id));
        }

        restaurantRepository.deleteById(id);
        log.info("Successfully deleted food with id: {}", id);
    }

    private Restaurant findRestaurantByIdOrThrow(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Restaurant not found with id: {}", id);
                    return new ResourceNotFoundException(String.format(RESTAURANT_NOT_FOUND_MSG, id));
                });
    }
}
