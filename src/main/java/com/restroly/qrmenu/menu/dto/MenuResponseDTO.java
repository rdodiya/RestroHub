package com.restroly.qrmenu.menu.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuResponseDTO {

    private Long menuId;

    private String menuName;

    private String menuDesc;

    @JsonProperty("isDeleted")
    private boolean isDeleted;

    private Date createdDate;

    private Date updatedDate;

    private BranchDTO branch;

    private List<CategoryDTO> categories;

    private Integer categoryCount;

    private Integer totalFoodCount;

    // ========== NESTED BRANCH DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BranchDTO {

        private Long branchId;

        private String name;

        private String description;

        private String phone;

        private AddressDTO address;
    }

    // ========== NESTED ADDRESS DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AddressDTO {

        private String city;

        private String state;

        private String fullAddress;
    }

    // ========== NESTED CATEGORY DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CategoryDTO {

        private Long categoryId;

        private String name;

        private String description;

        private List<FoodDTO> foods;

        private Integer foodCount;
    }

    // ========== NESTED FOOD DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FoodDTO {

        private Long foodId;

        private String name;

        private String description;

        private BigDecimal price;

        private BigDecimal discountedPrice;

        private String imageUrl;

        @JsonProperty("isAvailable")
        private boolean isAvailable;

        @JsonProperty("isVeg")
        private boolean isVeg;

        private String foodType;

        private Integer preparationTime;

        private String servingSize;
    }
}