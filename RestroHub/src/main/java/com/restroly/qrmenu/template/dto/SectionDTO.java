package com.restroly.qrmenu.template.dto;

import com.restroly.qrmenu.template.entity.SectionType;
import com.restroly.qrmenu.template.entity.SiteConfig;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionDTO {

    private Long id;
    private SectionType sectionKey;
    private Integer displayOrder;
    private Boolean isVisible = true;
    private Map<String, Object> content;
    private Map<String, Object> styles;
    private SiteConfigDTO siteConfig;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}