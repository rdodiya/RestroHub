package com.restroly.qrmenu.user.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.restroly.qrmenu.superAdmin.entity.UserRoleRestaurant;
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

    @OneToMany(mappedBy = "user")
    private Set<UserRoleRestaurant> userAssignments = new HashSet<>();

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
}
