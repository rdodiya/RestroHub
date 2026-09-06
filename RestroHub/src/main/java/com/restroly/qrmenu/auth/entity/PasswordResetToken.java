package com.restroly.qrmenu.auth.entity;

import java.time.LocalDateTime;

import com.restroly.qrmenu.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "t_password_reset_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 6-digit numeric OTP code sent to user
    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    // Legacy 'token' column compatibility
    @Column(name = "token", length = 100)
    private String token;

    // Cryptographic UUID token issued ONLY AFTER successful OTP verification
    @Column(name = "reset_token", length = 100)
    private String resetToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    // Set to true once the OTP code is successfully verified
    @Column(name = "is_otp_verified")
    @Builder.Default
    private Boolean isOtpVerified = false;

    // Set to true once the password reset is finished with resetToken (prevents token reuse)
    @Column(name = "is_reset_completed")
    @Builder.Default
    private Boolean isResetCompleted = false;

    // Failed attempt counter to prevent brute-force attacks (max 5)
    @Column(name = "failed_attempts")
    @Builder.Default
    private Integer failedAttempts = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (token == null) token = otpCode;
        if (isOtpVerified == null) isOtpVerified = false;
        if (isResetCompleted == null) isResetCompleted = false;
        if (failedAttempts == null) failedAttempts = 0;
        if (expiryDate == null) {
            expiryDate = LocalDateTime.now().plusMinutes(10);
        }
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}
