package com.restroly.qrmenu.user.repository;

import com.restroly.qrmenu.user.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  boolean existsByEmailAndUserIdNot(String email, Long userId);

  Optional<User> findByPhoneNumber(String phoneNumber);

  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByPhoneNumberAndUserIdNot(String phoneNumber, Long userId);

  Page<User> findByIsActiveTrue(Pageable pageable);

  long countByIsActiveTrue();

  Optional<User> findByUserId(@Param("userId") Long userId);

  @Query(
      """
    SELECT DISTINCT u
    FROM User u
    LEFT JOIN FETCH u.userRoleRestaurants urr
    LEFT JOIN FETCH urr.role
    LEFT JOIN FETCH urr.restaurant
    WHERE u.email = :email
    """)
  Optional<User> findByEmailWithUserRoleRestaurants(String email);

  @Query(
      """
    SELECT DISTINCT u.email
    FROM UserRoleRestaurant urr
    JOIN urr.user u
    JOIN urr.role r
    WHERE upper(r.name) IN ('SUPER_ADMIN', 'ROLE_SUPER_ADMIN')
    """)
  java.util.List<String> findSuperAdminEmails();
}
