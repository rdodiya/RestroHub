package com.restroly.qrmenu.food.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.restroly.qrmenu.food.entity.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

    // ─────────────────────────────────────────────
    // Find by IDs (soft-delete aware)
    // ─────────────────────────────────────────────
    @Query("SELECT f FROM Food f WHERE f.foodId IN :ids AND f.isDelete = false")
    List<Food> findByFoodIdInAndIsDeleteFalse(@Param("ids") List<Long> ids);

    // ─────────────────────────────────────────────
    // Find by Category ID
    // ✅ FIXED: f.categories → f.category
    // ─────────────────────────────────────────────
    @Query("""
        SELECT f FROM Food f 
        JOIN f.category c 
        WHERE c.categoryId = :categoryId 
          AND f.isDelete = false
    """)
    Page<Food> findByCategoryId(
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    // ─────────────────────────────────────────────
    // Find by name (case-insensitive)
    // ─────────────────────────────────────────────
    Optional<Food> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    // ─────────────────────────────────────────────
    // Find by Category name
    // ✅ FIXED: f.categories → f.category
    // ─────────────────────────────────────────────
    @Query("""
        SELECT f FROM Food f 
        JOIN f.category c 
        WHERE c.name = :category
    """)
    Page<Food> findByCategory(
            @Param("category") String category,
            Pageable pageable
    );

    // ─────────────────────────────────────────────
    // Find by availability
    // ─────────────────────────────────────────────
    Page<Food> findByIsAvailable(Boolean isAvailable, Pageable pageable);

    @Query("SELECT f FROM Food f WHERE f.isAvailable = true AND f.isDelete = false")
    Page<Food> findAllAvailable(Pageable pageable);

    // ─────────────────────────────────────────────
    // Find available by category name
    // ✅ FIXED: f.categories → f.category
    // ─────────────────────────────────────────────
    @Query("""
        SELECT f FROM Food f 
        JOIN f.category c 
        WHERE c.name = :category 
          AND f.isAvailable = true 
          AND f.isDelete = false
    """)
    Page<Food> findAvailableByCategory(
            @Param("category") String category,
            Pageable pageable
    );

    // ─────────────────────────────────────────────
    // Find by price range
    // ─────────────────────────────────────────────
    @Query("""
        SELECT f FROM Food f 
        WHERE f.price BETWEEN :minPrice AND :maxPrice 
          AND f.isDelete = false
    """)
    Page<Food> findByPriceRange(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    // ─────────────────────────────────────────────
    // Find all veg items
    // ─────────────────────────────────────────────
    @Query("""
        SELECT f FROM Food f 
        WHERE f.isVeg = true 
          AND f.isAvailable = true 
          AND f.isDelete = false
    """)
    Page<Food> findAllVeg(Pageable pageable);

    // ─────────────────────────────────────────────
    // Get all distinct category names
    // ✅ FIXED: f.categories → f.category
    // ─────────────────────────────────────────────
    @Query("""
        SELECT DISTINCT c.name 
        FROM Food f 
        JOIN f.category c 
        WHERE f.isDelete = false 
        ORDER BY c.name
    """)
    List<String> findAllCategories();

    // ─────────────────────────────────────────────
    // Search with multiple optional filters
    // ✅ FIXED: f.categories → f.category
    // ─────────────────────────────────────────────
    @Query("""
        SELECT DISTINCT f FROM Food f
        LEFT JOIN f.category c
        WHERE (:name IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%')))
          AND (:category IS NULL OR c.name = :category)
          AND (:isAvailable IS NULL OR f.isAvailable = :isAvailable)
          AND (:isVegetarian IS NULL OR f.isVeg = :isVegetarian)
          AND (:minPrice IS NULL OR f.price >= :minPrice)
          AND (:maxPrice IS NULL OR f.price <= :maxPrice)
          AND f.isDelete = false
    """)
    Page<Food> searchFoods(
            @Param("name") String name,
            @Param("category") String category,
            @Param("isAvailable") Boolean isAvailable,
            @Param("isVegetarian") Boolean isVegetarian,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    // ─────────────────────────────────────────────
    // Update availability
    // ✅ FIXED: f.id → f.foodId
    // ─────────────────────────────────────────────
    @Modifying
    @Query("UPDATE Food f SET f.isAvailable = :available WHERE f.foodId = :id")
    int updateAvailability(
            @Param("id") Long id,
            @Param("available") Boolean available
    );
}