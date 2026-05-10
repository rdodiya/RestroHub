package com.restroly.qrmenu.branch.repository;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.restaurant.entity.Restaurant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    // ========== FIND ALL (Non-Deleted) ==========
    List<Branch> findByIsDeleteFalse();

    Page<Branch> findByIsDeleteFalse(Pageable pageable);

    // ========== FIND BY ID (Non-Deleted) ==========
    Optional<Branch> findByBranchIdAndIsDeleteFalse(Long branchId);

    // ========== FIND BY RESTAURANT ==========
    List<Branch> findByRestaurant(Restaurant restaurant);

    List<Branch> findByRestaurant_RestId(Long restId);

    List<Branch> findByRestaurant_RestIdAndIsDeleteFalse(Long restId);

    Page<Branch> findByRestaurant_RestIdAndIsDeleteFalse(Long restId, Pageable pageable);

    // ========== COUNT ==========
    long countByRestaurant_RestId(Long restId);

    long countByRestaurant_RestIdAndIsDeleteFalse(Long restId);

    // ========== EXISTS ==========
    boolean existsByNameAndRestaurant_RestId(String branchName, Long restId);

    boolean existsByNameAndRestaurant_RestIdAndBranchIdNot(String branchName, Long restId, Long branchId);

    // ========== SEARCH (with Pageable) ==========
    @Query("SELECT b FROM Branch b " +
            "WHERE b.isDelete = false " +
            "AND (:keyword IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:restId IS NULL OR b.restaurant.restId = :restId) " +
            "AND (:city IS NULL OR LOWER(b.address.city) = LOWER(:city)) " +
            "AND (:state IS NULL OR LOWER(b.address.state) = LOWER(:state))")
    Page<Branch> searchBranches(@Param("keyword") String keyword,
                                @Param("restId") Long restId,
                                @Param("city") String city,
                                @Param("state") String state,
                                Pageable pageable);

    // ========== SIMPLE KEYWORD SEARCH ==========
    @Query("SELECT b FROM Branch b WHERE b.isDelete = false AND " +
            "(LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Branch> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT b FROM Branch b WHERE b.restaurant.restId = :restId AND b.isDelete = false AND " +
            "(LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Branch> searchByKeywordAndRestaurant(@Param("keyword") String keyword, @Param("restId") Long restId);
}