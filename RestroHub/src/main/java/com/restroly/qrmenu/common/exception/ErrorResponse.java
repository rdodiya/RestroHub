// src/main/java/com/Restroly/qrmenu/common/exception/ErrorResponse.java
package com.restroly.qrmenu.common.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standard error response structure")
public class ErrorResponse {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Timestamp of when the error occurred")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "404")
    private int status;

    @Schema(description = "HTTP status reason phrase", example = "Not Found")
    private String error;

    @Schema(description = "Detailed error message", example = "Food not found with id: 123")
    private String message;

    @Schema(description = "Request path that caused the error", example = "/api/v1/foods/123")
    private String path;

    @Schema(description = "Trace ID for request tracking")
    private String traceId;

    @Schema(description = "List of validation errors (for validation failures)")
    private List<ValidationError> validationErrors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Individual field validation error")
    public static class ValidationError {

        @Schema(description = "Field that failed validation", example = "name")
        private String field;

        @Schema(description = "Rejected value", example = "")
        private Object rejectedValue;

        @Schema(description = "Validation error message", example = "must not be blank")
        private String message;
    }
}