package com.restroly.qrmenu.security.spam;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class SpamProtectionFilterTest {
  private final TurnstileVerifier verifier = mock(TurnstileVerifier.class);
  private final FilterChain chain = mock(FilterChain.class);

  private SpamProtectionFilter filter(String mode, int max) {
    return new SpamProtectionFilter(mode, max, 60, verifier);
  }

  private MockHttpServletRequest post(String path) {
    MockHttpServletRequest r = new MockHttpServletRequest("POST", "/restroly" + path);
    r.setServletPath(path);
    r.setRemoteAddr("1.2.3.4");
    return r;
  }

  @Test
  void honeypotFilledIsRejectedWith400() throws Exception {
    MockHttpServletRequest r = post("/public/api/v1/auth/register");
    r.addHeader("X-Hp", "bot@spam.com");
    MockHttpServletResponse res = new MockHttpServletResponse();
    filter("honeypot", 10).doFilter(r, res, chain);
    assertEquals(400, res.getStatus());
    verify(chain, never()).doFilter(any(), any());
  }

  @Test
  void cleanRequestPassesAndExceedingLimitGets429() throws Exception {
    SpamProtectionFilter f = filter("honeypot", 2);
    for (int i = 0; i < 2; i++) {
      MockHttpServletResponse ok = new MockHttpServletResponse();
      f.doFilter(post("/public/api/v1/auth/login"), ok, chain);
      assertEquals(200, ok.getStatus());
    }
    MockHttpServletResponse limited = new MockHttpServletResponse();
    f.doFilter(post("/public/api/v1/auth/login"), limited, chain);
    assertEquals(429, limited.getStatus());
  }

  @Test
  void turnstileModeRequiresValidToken() throws Exception {
    when(verifier.verify("good", "1.2.3.4")).thenReturn(true);
    SpamProtectionFilter f = filter("turnstile", 10);

    MockHttpServletResponse missing = new MockHttpServletResponse();
    f.doFilter(post("/public/api/v1/auth/register"), missing, chain);
    assertEquals(400, missing.getStatus());

    MockHttpServletRequest r = post("/public/api/v1/auth/register");
    r.addHeader("X-Turnstile-Token", "good");
    MockHttpServletResponse ok = new MockHttpServletResponse();
    f.doFilter(r, ok, chain);
    assertEquals(200, ok.getStatus());
  }

  @Test
  void unprotectedPathsAreUntouched() throws Exception {
    MockHttpServletRequest get =
        new MockHttpServletRequest("GET", "/restroly/public/api/v1/auth/login");
    get.setServletPath("/public/api/v1/auth/login");
    get.addHeader("X-Hp", "x");
    MockHttpServletResponse res = new MockHttpServletResponse();
    filter("honeypot", 1).doFilter(get, res, chain);
    assertEquals(200, res.getStatus());
    verify(chain).doFilter(get, res);
  }
}
