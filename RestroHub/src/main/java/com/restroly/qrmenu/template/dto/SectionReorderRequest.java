package com.restroly.qrmenu.template.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionReorderRequest {

    @NotEmpty(message = "Section order list cannot be empty")
    private List<SectionOrderItem> sections;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SectionOrderItem {
        private Long sectionId;
        private Integer displayOrder;
    }
}