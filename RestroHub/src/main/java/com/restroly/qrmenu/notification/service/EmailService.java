package com.restroly.qrmenu.notification.service;

public interface EmailService {

    /**
     * Sends a password reset verification email containing a 6-digit OTP code.
     *
     * @param toEmail recipient email address
     * @param otpCode 6-digit verification code
     * @param expiryMinutes expiration period in minutes
     */
    void sendPasswordResetOtp(String toEmail, String otpCode, int expiryMinutes);
}
