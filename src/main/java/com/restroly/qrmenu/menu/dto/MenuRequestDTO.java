package com.restroly.qrmenu.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuRequestDTO {

    @NotBlank(message = "Menu name is required")
    @Size(min = 2, max = 100, message = "Menu name must be between 2 and 100 characters")
    private String menuName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String menuDesc;

    private Long branchId;

    private List<Long> categoryIds;

    private Boolean isDeleted;
}