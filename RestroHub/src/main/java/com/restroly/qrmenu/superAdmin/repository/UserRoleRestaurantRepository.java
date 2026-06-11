package com.restroly.qrmenu.superAdmin.repository;

import com.restroly.qrmenu.superAdmin.entity.UserRoleRestaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRestaurantRepository extends JpaRepository<UserRoleRestaurant, Long> {

    @Query("""
            SELECT urr
            FROM UserRoleRestaurant urr
            JOIN FETCH urr.user u
            JOIN FETCH urr.role r
            JOIN FETCH urr.restaurant rest
            WHERE r.name = 'CUSTOMER'
            AND u.isActive = false
            """)
    Page<UserRoleRestaurant> findPendingCustomers(Pageable pageable);

    Optional<UserRoleRestaurant> findByUserUserIdAndRestaurantRestId(Long userId, Long restaurantId);

    Optional<UserRoleRestaurant> findByUserUserId(Long userId);

}
