package com.restroly.qrmenu.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSiteConfigRequest {

    private ThemeDTO theme;

    private List<SectionDTO> sections;

}
