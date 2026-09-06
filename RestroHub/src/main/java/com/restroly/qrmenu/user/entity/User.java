package com.restroly.qrmenu.user.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.restroly.qrmenu.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "t_usr_master")
public class User {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long userId;

    @Column(name = "user_name", nullable = false)
    private String name;

    @Column(name = "user_email", nullable = false, unique = true)
    private String email;

    @Column(name = "user_password", nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "is_locked")
    private boolean isLocked;

    // OAuth2 fields for Google login integration
    @Column(name = "google_sub", unique = true)
    private String googleSub;  // Google's unique user identifier

    @Column(name = "auth_provider")
    private String authProvider;  // e.g., "GOOGLE", "LOCAL", "FACEBOOK" (future)

    
    @Column(name = "user_profile")
    private byte[] userProfile; // BLOB for storing profile image bytes

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "bio", length = 500)
    private String bio;

    // NEW: User-Role-Restaurant relationship
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserRoleRestaurant> userRoleRestaurants = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate  // this automaticatically update updatedDate when existing entity update
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void addUserRoleRestaurant(Role role, Restaurant restaurant) {
        UserRoleRestaurant urr = UserRoleRestaurant.builder()
                .user(this)
                .role(role)
                .restaurant(restaurant)
                .build();

        userRoleRestaurants.add(urr);
    }

    public void clearUserRoleRestaurants() {
        userRoleRestaurants.clear();
    }
}
