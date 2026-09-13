package com.restroly.qrmenu.auth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.restroly.qrmenu.auth.entity.PasswordResetToken;
import com.restroly.qrmenu.user.entity.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Find the latest active unverified token for an email
    Optional<PasswordResetToken> findTopByUser_EmailAndIsOtpVerifiedFalseAndIsResetCompletedFalseOrderByCreatedAtDesc(String email);

    // Find token by resetToken (issued after OTP verification) for final password reset
    Optional<PasswordResetToken> findByResetTokenAndIsOtpVerifiedTrueAndIsResetCompletedFalse(String resetToken);

    // Find all active tokens for a user to invalidate on new request
    List<PasswordResetToken> findAllByUserAndIsResetCompletedFalse(User user);

    @Modifying
    @Query("UPDATE PasswordResetToken p SET p.isResetCompleted = true WHERE p.user = :user")
    void invalidateAllTokensForUser(@Param("user") User user);
}
