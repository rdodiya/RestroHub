package com.restroly.qrmenu.branch.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchRequestDTO {

    @NotBlank(message = "Branch name is required")
    @Size(min = 2, max = 100, message = "Branch name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotNull(message = "Address is required")
    @Valid
    private AddressDTO address;

    private Long menuId;

    private Boolean isDelete;

    // ========== NESTED ADDRESS DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressDTO {

        @NotBlank(message = "Address line 1 is required")
        @Size(max = 255, message = "Address line 1 cannot exceed 255 characters")
        private String add1;

        @Size(max = 255, message = "Address line 2 cannot exceed 255 characters")
        private String add2;

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City cannot exceed 100 characters")
        private String city;

        @NotBlank(message = "State is required")
        @Size(max = 100, message = "State cannot exceed 100 characters")
        private String state;

        @NotBlank(message = "Country is required")
        @Size(max = 100, message = "Country cannot exceed 100 characters")
        private String country;

        @NotBlank(message = "Postal code is required")
        @Size(max = 20, message = "Postal code cannot exceed 20 characters")
        private String postalCode;
    }
}