package com.restroly.qrmenu.user.repository;

import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRoleRestaurantRepository extends JpaRepository<UserRoleRestaurant, Long> {

  @Query(
      """
      SELECT urr FROM UserRoleRestaurant urr
      JOIN FETCH urr.user JOIN FETCH urr.role JOIN FETCH urr.restaurant
      ORDER BY urr.id DESC
      """)
  List<UserRoleRestaurant> findAllWithDetails();

  boolean existsByUser_UserIdAndRole_IdAndRestaurant_RestId(
      long userId, Long roleId, long restaurantId);
}
