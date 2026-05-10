package com.restroly.qrmenu.template.service;

import com.restroly.qrmenu.template.dto.ThemeCreateRequest;
import com.restroly.qrmenu.template.dto.ThemeDTO;
import com.restroly.qrmenu.template.dto.ThemeUpdateRequest;

import java.util.List;

public interface ThemeService {

    ThemeDTO createTheme(ThemeCreateRequest request);

    ThemeDTO getThemeById(Long id);

    ThemeDTO getThemeByName(String name);

    ThemeDTO getDefaultTheme();

    List<ThemeDTO> getAllThemes();

    List<ThemeDTO> getActiveThemes();

    List<ThemeDTO> getThemesByDarkMode(Boolean isDarkMode);

    ThemeDTO updateTheme(Long id, ThemeUpdateRequest request);

    void deleteTheme(Long id);

    ThemeDTO setDefaultTheme(Long id);

    boolean existsByName(String name);
}