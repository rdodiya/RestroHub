package com.restroly.qrmenu.whatsapp.service.impl;

import com.restroly.qrmenu.whatsapp.service.WhatsappService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public abstract class WhatsappServiceImpl implements WhatsappService {
    private final RestTemplate restTemplate;

    @Value("${whatsapp.api.url:https://graph.facebook.com/v25.0/}")
    private String apiUrl;

    @Value("${whatsapp.api.phone-number-id}")
    private String phoneNumberId;

    @Value("${whatsapp.api.token}")
    private String accessToken;

    @Autowired
    public WhatsappServiceImpl(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofMillis(5000)) // Time to establish connection
                .setReadTimeout(Duration.ofMillis(5000)) // Time to wait for data
                .build();
    }

    /**
     * Core method to execute the HTTP POST request to Meta's Cloud API.
     */
    public void sendTemplateMessage(String toPhoneNumber, String templateName,
            List<Map<String, String>> bodyParameters) {
        try {
            String url = apiUrl + phoneNumberId + "/messages";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            // Constructing the JSON payload for a Template Message
            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", formatPhoneNumber(toPhoneNumber),
                    "type", "template",
                    "template", Map.of(
                            "name", templateName,
                            "language", Map.of("code", "en_US"),
                            "components", List.of(
                                    Map.of(
                                            "type", "body",
                                            "parameters", bodyParameters))));

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("WhatsApp template '{}' sent successfully to {}", templateName, toPhoneNumber);
            } else {
                log.warn("Failed to send WhatsApp template. Status: {}, Response: {}",
                        response.getStatusCode(), response.getBody());
            }

        } catch (Exception e) {
            log.error("Exception occurred while sending WhatsApp template to {}: {}", toPhoneNumber, e.getMessage());
        }
    }

    /**
     * Utility to ensure the phone number doesn't have '+' or spaces,
     * as required by the WhatsApp API.
     */
    private String formatPhoneNumber(String phone) {
        if (phone == null)
            return "";
        return phone.replaceAll("[^0-9]", "");
    }
}