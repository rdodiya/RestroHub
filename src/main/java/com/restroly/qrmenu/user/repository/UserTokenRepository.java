package com.restroly.qrmenu.user.repository;

import com.restroly.qrmenu.user.entity.UserToken    ;
import com.restroly.qrmenu.user.entity.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    /**
     * Find all valid (non-revoked, non-expired) tokens for a user
     */
    @Query("""
        SELECT t FROM Token t
        WHERE t.user.id = :userId
          AND t.revoked = false
          AND t.expired = false
    """)
    List<UserToken> findAllValidTokensByUser(@Param("userId") Long userId);

    /**
     * Find all valid tokens of a specific type for a user
     */
    @Query("""
        SELECT t FROM Token t
        WHERE t.user.id = :userId
          AND t.tokenType = :tokenType
          AND t.revoked = false
          AND t.expired = false
    """)
    List<UserToken> findAllValidTokensByUserAndType(
            @Param("userId") Long userId,
            @Param("tokenType") TokenType tokenType
    );

    /**
     * Find a specific token string (for refresh-token lookup)
     */
    Optional<UserToken> findByToken(String token);

    /**
     * Revoke all tokens for a user (used on logout)
     */
    @Modifying
    @Transactional
    @Query("""
        UPDATE Token t
        SET t.revoked = true, t.expired = true
        WHERE t.user.id = :userId
          AND t.revoked = false
    """)
    void revokeAllTokensByUser(@Param("userId") Long userId);

    /**
     * Revoke all tokens of a specific type for a user
     */
    @Modifying
    @Transactional
    @Query("""
        UPDATE Token t
        SET t.revoked = true, t.expired = true
        WHERE t.user.id = :userId
          AND t.tokenType = :tokenType
          AND t.revoked = false
    """)
    void revokeAllTokensByUserAndType(
            @Param("userId") Long userId,
            @Param("tokenType") TokenType tokenType
    );

    /**
     * Cleanup: delete all expired/revoked tokens older than given days
     */
    @Modifying
    @Transactional
    @Query("""
        DELETE FROM Token t
        WHERE (t.revoked = true OR t.expired = true)
          AND t.createdAt < CURRENT_TIMESTAMP - :days DAY
    """)
    void deleteExpiredTokens(@Param("days") int days);
}