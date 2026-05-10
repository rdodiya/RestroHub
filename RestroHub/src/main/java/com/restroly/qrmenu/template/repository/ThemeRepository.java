package com.restroly.qrmenu.template.repository;

import com.restroly.qrmenu.template.entity.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {

    List<Theme> findByIsActiveTrue();

    Optional<Theme> findByName(String name);

    Optional<Theme> findByIsDefaultTrue();

    List<Theme> findByIsDarkMode(Boolean isDarkMode);

    List<Theme> findByIsActiveTrueOrderByNameAsc();

    boolean existsByName(String name);
}