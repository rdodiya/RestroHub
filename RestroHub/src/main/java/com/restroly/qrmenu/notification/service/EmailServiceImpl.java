package com.restroly.qrmenu.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.restroly.qrmenu.exception.BusinessException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Override
    public void sendPasswordResetOtp(String toEmail, String otpCode, int expiryMinutes) {
        log.info("Sending password reset verification email to: {}", toEmail);

        if (mailSender == null || fromEmail == null || fromEmail.isBlank() || "smtp.example.com".equalsIgnoreCase(mailHost)) {
            log.warn("SMTP email server is not fully configured (mailSender={}, fromEmail={}). " +
                     "Logging verification code for development / test verification: [{}]", 
                     mailSender != null ? "available" : "null", fromEmail, otpCode);
            // In dev without SMTP credentials, we gracefully log and allow flow to continue
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RestroHub Support");
            helper.setTo(toEmail);
            helper.setSubject("RestroHub - Password Reset Verification Code");

            String htmlContent = buildOtpHtmlTemplate(otpCode, expiryMinutes);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset verification email sent successfully to {}", toEmail);

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to compose or send password reset email to {}: {}", toEmail, e.getMessage(), e);
            throw new BusinessException("Unable to send verification email. Please check your email configuration and try again.");
        } catch (Exception e) {
            log.error("Unexpected error during mail dispatch to {}: {}", toEmail, e.getMessage(), e);
            throw new BusinessException("Email dispatch failed: " + e.getMessage());
        }
    }

    private String buildOtpHtmlTemplate(String otpCode, int expiryMinutes) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset Verification</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                .container { max-width: 540px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 24px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .content { padding: 36px 32px; color: #334155; }
                .otp-box { background-color: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; text-align: center; padding: 20px; margin: 28px 0; }
                .otp-code { font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; margin: 0; }
                .timer-note { font-size: 13px; color: #64748b; margin-top: 8px; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                p { line-height: 1.6; margin: 0 0 16px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>RestroHub</h1>
                </div>
                <div class="content">
                  <p>Hello,</p>
                  <p>We received a request to reset the password for your RestroHub account. Please use the verification code below to proceed:</p>
                  
                  <div class="otp-box">
                    <p class="otp-code">%s</p>
                    <p class="timer-note">Expires in %d minutes &bull; Single-use only</p>
                  </div>
                  
                  <p>If you did not request a password reset, please ignore this email or contact support if you have security concerns.</p>
                  <p>Best regards,<br>The RestroHub Security Team</p>
                </div>
                <div class="footer">
                  &copy; 2026 RestroHub. All rights reserved.
                </div>
              </div>
            </body>
            </html>
            """.formatted(otpCode, expiryMinutes);
    }
}
