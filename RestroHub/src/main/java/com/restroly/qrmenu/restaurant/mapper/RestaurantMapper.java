package com.restroly.qrmenu.restaurant.mapper;

import com.restroly.qrmenu.common.generic.GenericMapper;
import com.restroly.qrmenu.restaurant.dto.RestaurantRequestDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantResponseDTO;
import com.restroly.qrmenu.restaurant.dto.RestaurantUpdateDTO;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface RestaurantMapper extends GenericMapper<Restaurant, RestaurantRequestDTO, RestaurantResponseDTO, RestaurantUpdateDTO> {
}
