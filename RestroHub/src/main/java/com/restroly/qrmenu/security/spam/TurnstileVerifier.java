package com.restroly.qrmenu.security.spam;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/** Verifies Cloudflare Turnstile tokens server-side. */
@Component
public class TurnstileVerifier {
  private static final String URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  private final String secret;
  private final RestClient client = RestClient.create();

  public TurnstileVerifier(@Value("${app.spam-protection.turnstile.secret:}") String secret) {
    this.secret = secret;
  }

  /**
   * @return true only when Cloudflare confirms the token; false on any error or missing secret
   */
  public boolean verify(String token, String ip) {
    if (secret.isBlank() || token == null || token.isBlank()) {
      return false;
    }
    MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
    form.add("secret", secret);
    form.add("response", token);
    form.add("remoteip", ip);
    try {
      Map<?, ?> body =
          client
              .post()
              .uri(URL)
              .contentType(MediaType.APPLICATION_FORM_URLENCODED)
              .body(form)
              .retrieve()
              .body(Map.class);
      return body != null && Boolean.TRUE.equals(body.get("success"));
    } catch (RuntimeException e) {
      return false;
    }
  }
}
