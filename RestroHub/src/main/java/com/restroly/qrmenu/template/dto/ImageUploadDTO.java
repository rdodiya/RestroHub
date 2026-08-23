package com.restroly.qrmenu.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUploadDTO {

    private String fileName;

    private String contentType;

    private String base64;
}
