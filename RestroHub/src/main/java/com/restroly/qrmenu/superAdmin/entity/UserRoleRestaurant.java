package com.restroly.qrmenu.superAdmin.entity;

import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.user.entity.Role;
import com.restroly.qrmenu.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_role_restaurant", uniqueConstraints = {@UniqueConstraint(name = "uk_user_role_restaurant", columnNames = {"user_id", "role_id", "restaurant_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRoleRestaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_urr_user"))
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false, foreignKey = @ForeignKey(name = "fk_urr_role"))
    private Role role;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "restaurant_id", nullable = false, foreignKey = @ForeignKey(name = "fk_urr_restaurant"))
    private Restaurant restaurant;

    @PrePersist
    public void prePersist() {
        if (assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
        if (active == null) {
            active = true;
        }
    }
}

