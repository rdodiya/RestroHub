package com.restroly.qrmenu.branch.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BranchResponseDTO {

    private Long branchId;

    private String name;

    private String description;

    private Boolean isDelete;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private RestaurantDTO restaurant;

    private AddressDTO address;

    private MenuDTO menu;

    private List<TableDTO> tables;

    private Integer tableCount;

    // ========== NESTED RESTAURANT DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RestaurantDTO {

        private Long restId;

        private String name;

        private String logo;
    }

    // ========== NESTED ADDRESS DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressDTO {

        private Long addId;

        private String add1;

        private String add2;

        private String city;

        private String state;

        private String country;

        private String postalCode;

        private String fullAddress;
    }

    // ========== NESTED MENU DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MenuDTO {

        private Long menuId;

        private String menuName;

        private String menuDesc;

        private Integer categoryCount;
    }

    // ========== NESTED TABLE DTO ==========
    // Inside BranchResponseDTO.java

    // ========== NESTED TABLE DTO ==========
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TableDTO {

        private Long tableId;

        private Integer tableNumber;

        private String qrCodeUrl;

        private Boolean isActive;
    }
}