// src/main/java/com/Restroly/qrmenu/common/exception/ValidationException.java
package com.restroly.qrmenu.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class ValidationException extends BusinessException {

    private final List<ErrorResponse.ValidationError> validationErrors;

    public ValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        this.validationErrors = null;
    }

    public ValidationException(String message, List<ErrorResponse.ValidationError> errors) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        this.validationErrors = errors;
    }
}