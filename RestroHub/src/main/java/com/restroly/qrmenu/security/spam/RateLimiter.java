package com.restroly.qrmenu.security.spam;

import java.util.ArrayDeque;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Sliding-window per-key limiter. ponytail: in-memory, per instance; use a shared store if the API
 * scales out.
 */
public class RateLimiter {
  private static final int PURGE_THRESHOLD = 10_000;

  private final int max;
  private final long windowMs;
  private final ConcurrentHashMap<String, ArrayDeque<Long>> hits = new ConcurrentHashMap<>();

  public RateLimiter(int max, long windowMs) {
    this.max = max;
    this.windowMs = windowMs;
  }

  /**
   * Records a hit for {@code key}.
   *
   * @return false when the key already used {@code max} hits inside the window
   */
  public boolean allow(String key, long nowMillis) {
    if (hits.size() > PURGE_THRESHOLD) {
      hits.entrySet().removeIf(e -> prune(e.getValue(), nowMillis));
    }
    ArrayDeque<Long> q = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
    synchronized (q) {
      prune(q, nowMillis);
      if (q.size() >= max) {
        return false;
      }
      q.addLast(nowMillis);
      return true;
    }
  }

  int size() {
    return hits.size();
  }

  private boolean prune(ArrayDeque<Long> q, long now) {
    synchronized (q) {
      while (!q.isEmpty() && now - q.peekFirst() >= windowMs) {
        q.pollFirst();
      }
      return q.isEmpty();
    }
  }
}
