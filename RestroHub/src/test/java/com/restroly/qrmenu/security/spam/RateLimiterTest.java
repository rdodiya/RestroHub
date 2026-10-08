package com.restroly.qrmenu.security.spam;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class RateLimiterTest {
  @Test
  void blocksAfterMaxWithinWindowAndRecoversAfter() {
    RateLimiter rl = new RateLimiter(2, 1000);
    assertTrue(rl.allow("ip", 0));
    assertTrue(rl.allow("ip", 10));
    assertFalse(rl.allow("ip", 20));
    assertTrue(rl.allow("other", 20));
    assertTrue(rl.allow("ip", 1001));
  }

  @Test
  void purgesIdleKeysSoMemoryStaysBounded() {
    RateLimiter rl = new RateLimiter(1, 10);
    for (int i = 0; i < 10_050; i++) rl.allow("k" + i, 0);
    rl.allow("trigger", 1_000);
    assertTrue(rl.size() < 10_050);
  }
}
