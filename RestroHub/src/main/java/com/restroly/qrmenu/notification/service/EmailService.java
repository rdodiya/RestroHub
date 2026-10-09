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

  /** Sends the sign-up email verification link. */
  void sendEmailVerification(String toEmail, String token, int expiryHours);

  /** Tells the user whether their registration was approved or rejected (note may be null). */
  void sendRegistrationDecision(
      String toEmail, boolean approved, String restaurantName, String note);

  /** Informs a superadmin that a verified sign-up awaits review in the app. Informational only. */
  void sendRegistrationAlert(
      String toEmail,
      String applicantName,
      String applicantEmail,
      String restaurantName,
      boolean newRestaurant);
}
