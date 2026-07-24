package com.restroly.qrmenu.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.restroly.qrmenu.exception.BusinessException;
import com.restroly.qrmenu.template.dto.ImageUploadDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload runs outside @Transactional so DB connection
     * is NOT held during the slow HTTP call to Cloudinary
     */
    public String uploadImage(MultipartFile image, String folder) {
        int maxRetries = 3;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.info("Upload attempt {}/{}", attempt, maxRetries);

                // Compress image before upload if large
                byte[] imageBytes = compressIfNeeded(image);

                Map<String, Object> result = cloudinary.uploader().upload(
                        imageBytes,
                        ObjectUtils.asMap(
                                "folder", folder,
                                "resource_type", "image"
                        )
                );
                return (String) result.get("secure_url");

            } catch (Exception e) {
                log.warn("Attempt {} failed: {}", attempt, e.getMessage());
                if (attempt == maxRetries) {
                    // FIXED: was RuntimeException — now BusinessException (503 SERVICE_UNAVAILABLE)
                    throw new BusinessException(
                            "Image upload failed after " + maxRetries + " attempts: " + e.getMessage(),
                            HttpStatus.SERVICE_UNAVAILABLE,
                            "IMAGE_UPLOAD_FAILED"
                    );
                }
                sleep(2000L * attempt);
            }
        }
        //FIXED: removed unreachable RuntimeException — loop above always returns or throws
        throw new BusinessException(
                "Image upload failed: all retries exhausted",
                HttpStatus.SERVICE_UNAVAILABLE,
                "IMAGE_UPLOAD_FAILED"
        );
    }

    private byte[] compressIfNeeded(MultipartFile file) throws Exception {
        byte[] bytes = file.getBytes();
        // If file > 2MB, you might want to compress
        if (bytes.length > 2 * 1024 * 1024) {
            log.info("Large file detected ({}KB), uploading as-is (Cloudinary will optimize)",
                    bytes.length / 1024);
        }
        return bytes;
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    public String uploadBase64(ImageUploadDTO image) {

        try {
            byte[] bytes = Base64.getDecoder().decode(image.getBase64());
            Map<?,?> upload = cloudinary.uploader().upload(
                    bytes,
                    ObjectUtils.emptyMap());
            return upload.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed",e);
        }
    }
}
