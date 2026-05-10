package com.restroly.qrmenu.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
                    throw new RuntimeException("Image upload failed", e);
                }
                sleep(2000L * attempt);
            }
        }
        throw new RuntimeException("Unreachable");
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
}
