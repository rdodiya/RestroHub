package com.restroly.qrmenu.template.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSiteConfigRequest {

  /**
   * Optional template switch; non-default templates need the CUSTOM_WEBSITE_TEMPLATES plan feature.
   */
  private String templateKey;

  private ThemeDTO theme;

  private List<SectionDTO> sections;
}
