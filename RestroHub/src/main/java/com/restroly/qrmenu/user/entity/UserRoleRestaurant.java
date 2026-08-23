package com.restroly.qrmenu.user.entity;

import com.restroly.qrmenu.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(
        name = "user_role_restaurant",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "user_id",
                        "role_id",
                        "restaurant_id"
                }
        )
)
public class UserRoleRestaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

}
