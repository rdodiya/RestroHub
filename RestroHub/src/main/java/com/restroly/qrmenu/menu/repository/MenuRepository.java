package com.restroly.qrmenu.menu.repository;

import com.restroly.qrmenu.menu.entity.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    // ========== FIND ALL (Non-Deleted) ==========
    List<Menu> findByIsDeletedFalse();

    Page<Menu> findByIsDeletedFalse(Pageable pageable);

    // ========== FIND BY ID (Non-Deleted) ==========
    Optional<Menu> findByMenuIdAndIsDeletedFalse(Long menuId);

    // ========== FIND BY BRANCH ==========
    List<Menu> findByBranch_BranchIdAndIsDeletedFalse(Long branchId);

    Optional<Menu> findByBranch_BranchId(Long branchId);

    // ========== EXISTS ==========
    boolean existsByMenuNameAndBranch_BranchId(String menuName, Long branchId);

    boolean existsByMenuNameAndBranch_BranchIdAndMenuIdNot(String menuName, Long branchId, Long menuId);

    // ========== SEARCH ==========
    @Query("SELECT m FROM Menu m WHERE m.isDeleted = false AND " +
            "(:keyword IS NULL OR LOWER(m.menuName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(m.menuDesc) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Menu> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT m FROM Menu m WHERE m.isDeleted = false AND " +
            "m.branch.branchId = :branchId AND " +
            "(:keyword IS NULL OR LOWER(m.menuName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(m.menuDesc) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Menu> searchByKeywordAndBranch(@Param("keyword") String keyword,
                                        @Param("branchId") Long branchId,
                                        Pageable pageable);

    // ========== COUNT ==========
    long countByIsDeletedFalse();

    long countByBranch_BranchIdAndIsDeletedFalse(Long branchId);

    // ========== FIND BY CATEGORY ==========
    @Query("SELECT m FROM Menu m JOIN m.categories c WHERE c.categoryId = :categoryId AND m.isDeleted = false")
    List<Menu> findByCategoryId(@Param("categoryId") Long categoryId);
}