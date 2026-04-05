package com.restroly.qrmenu.config;


import com.restroly.qrmenu.user.repository.UserTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupScheduler {

    private final UserTokenRepository tokenRepository;

    /**
     * Every day at 2 AM — delete revoked/expired tokens
     * older than 7 days
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupExpiredTokens() {
        try {
            tokenRepository.deleteExpiredTokens(7);
            log.info("Expired token cleanup completed");
        } catch (Exception e) {
            log.error("Token cleanup failed: {}", e.getMessage());
        }
    }
}

