package com.restroly.qrmenu.config;

import com.cloudinary.Cloudinary;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CloudinaryConfigTest {

    private static Validator validator;
    private static ValidatorFactory validatorFactory;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidatorFactory() {
        validatorFactory.close();
    }

    @Test
    void cloudinary_ShouldUseExternalizedProperties() {
        CloudinaryProperties properties = new CloudinaryProperties(
                "test-cloud",
                "test-api-key",
                "test-api-secret"
        );

        Cloudinary cloudinary = new CloudinaryConfig().cloudinary(properties);

        assertEquals("test-cloud", cloudinary.config.cloudName);
        assertEquals("test-api-key", cloudinary.config.apiKey);
        assertEquals("test-api-secret", cloudinary.config.apiSecret);
    }

    @Test
    void cloudinaryProperties_ShouldAcceptConfiguredValues() {
        CloudinaryProperties properties = new CloudinaryProperties(
                "test-cloud",
                "test-api-key",
                "test-api-secret"
        );

        assertTrue(validator.validate(properties).isEmpty());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   "})
    void cloudinaryProperties_ShouldRejectBlankCloudName(String cloudName) {
        CloudinaryProperties properties = new CloudinaryProperties(cloudName, "test-api-key", "test-api-secret");

        assertInvalidProperty(properties, "cloudName");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   "})
    void cloudinaryProperties_ShouldRejectBlankApiKey(String apiKey) {
        CloudinaryProperties properties = new CloudinaryProperties("test-cloud", apiKey, "test-api-secret");

        assertInvalidProperty(properties, "apiKey");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "   "})
    void cloudinaryProperties_ShouldRejectBlankApiSecret(String apiSecret) {
        CloudinaryProperties properties = new CloudinaryProperties("test-cloud", "test-api-key", apiSecret);

        assertInvalidProperty(properties, "apiSecret");
    }

    @Test
    void cloudinaryProperties_ShouldRejectAllMissingValues() {
        CloudinaryProperties properties = new CloudinaryProperties(null, "", " ");

        Set<ConstraintViolation<CloudinaryProperties>> violations = validator.validate(properties);
        Set<String> invalidProperties = violations.stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertEquals(3, violations.size());
        assertTrue(invalidProperties.contains("cloudName"));
        assertTrue(invalidProperties.contains("apiKey"));
        assertTrue(invalidProperties.contains("apiSecret"));
    }

    private void assertInvalidProperty(CloudinaryProperties properties, String propertyName) {
        Set<ConstraintViolation<CloudinaryProperties>> violations = validator.validate(properties);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(violation -> propertyName.equals(violation.getPropertyPath().toString())));
    }
}
