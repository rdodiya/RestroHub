package com.restroly.qrmenu.common.generic;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Paginated T items response")
public class PageResponseDTO<T> {

        @Schema(description = "List of T items")
        private List<T> content;

        @Schema(description = "Current page number (0-indexed)", example = "0")
        private int pageNumber;

        @Schema(description = "Number of items per page", example = "10")
        private int pageSize;

        @Schema(description = "Total number of elements", example = "100")
        private long totalElements;

        @Schema(description = "Total number of pages", example = "10")
        private int totalPages;

        @Schema(description = "Whether this is the first page", example = "true")
        private boolean first;

        @Schema(description = "Whether this is the last page", example = "false")
        private boolean last;

        @Schema(description = "Whether the response is empty", example = "false")
        private boolean empty;

}
