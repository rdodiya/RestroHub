package com.restroly.qrmenu.security.spam;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Rate-limits abuse-prone public auth endpoints and checks a honeypot or Turnstile token. */
@Component
public class SpamProtectionFilter extends OncePerRequestFilter {
  private static final String BASE = "/public/api/v1/auth/";
  private static final Set<String> PROTECTED =
      Set.of(
          BASE + "login",
          BASE + "register",
          BASE + "forgot-password",
          BASE + "verify-reset-code",
          BASE + "reset-password",
          BASE + "resend-verification");

  private final boolean turnstile;
  private final RateLimiter limiter;
  private final TurnstileVerifier verifier;

  public SpamProtectionFilter(
      @Value("${app.spam-protection.mode:honeypot}") String mode,
      @Value("${app.spam-protection.rate-limit.max:10}") int max,
      @Value("${app.spam-protection.rate-limit.window-seconds:60}") int windowSeconds,
      TurnstileVerifier verifier) {
    this.turnstile = "turnstile".equalsIgnoreCase(mode);
    this.limiter = new RateLimiter(max, windowSeconds * 1000L);
    this.verifier = verifier;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return !"POST".equals(request.getMethod()) || !PROTECTED.contains(request.getServletPath());
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String ip = request.getRemoteAddr();
    if (!limiter.allow(ip, System.currentTimeMillis())) {
      reject(response, 429, "Too many requests. Please try again later.");
      return;
    }
    boolean human =
        turnstile
            ? verifier.verify(request.getHeader("X-Turnstile-Token"), ip)
            : isBlank(request.getHeader("X-Hp"));
    if (!human) {
      reject(response, 400, "Request rejected.");
      return;
    }
    chain.doFilter(request, response);
  }

  private static boolean isBlank(String s) {
    return s == null || s.isBlank();
  }

  private static void reject(HttpServletResponse response, int status, String message)
      throws IOException {
    response.setStatus(status);
    response.setContentType("application/json");
    response.getWriter().write("{\"message\":\"" + message + "\"}");
  }
}
