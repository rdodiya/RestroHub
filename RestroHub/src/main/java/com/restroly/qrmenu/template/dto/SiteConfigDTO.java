package com.restroly.qrmenu.template.dto;

import com.restroly.qrmenu.menu.dto.MenuResponseDTO;
import com.restroly.qrmenu.template.entity.Section;
import com.restroly.qrmenu.template.entity.Theme;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteConfigDTO {

    private Long id;
    private String siteId;
    private Long restaurantId;
    private String siteName;
    private String pageSlug;
    private String templateKey;
    private ThemeDTO theme;
    private MenuResponseDTO menu;
    private List<SectionDTO> sections = new ArrayList<>();
    private Boolean isPublished = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}