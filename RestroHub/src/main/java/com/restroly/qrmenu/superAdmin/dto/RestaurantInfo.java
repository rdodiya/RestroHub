package com.restroly.qrmenu.superAdmin.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantInfo {

    private Long restaurantId;

    private String restaurantName;

    private String restaurantDescription;

    private String restaurantPhoneNumber;

    private Boolean restaurantActive;

    private Boolean serviceRequestEnabled;
}
