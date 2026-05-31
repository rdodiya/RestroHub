package com.restroly.qrmenu.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "cloudinary")
public record CloudinaryProperties(
        @NotBlank(message = "Cloudinary cloud name is required") String cloudName,
        @NotBlank(message = "Cloudinary API key is required") String apiKey,
        @NotBlank(message = "Cloudinary API secret is required") String apiSecret
) {
}
