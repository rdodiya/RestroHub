package com.restroly.qrmenu.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dtecxhy4m",
                "api_key", "985463517258456",
                "api_secret", "AnIeRp6AVNOqAGuS78DKFDIPoXc"
        ));
    }
}