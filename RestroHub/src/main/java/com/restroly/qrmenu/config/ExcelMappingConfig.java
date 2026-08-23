package com.restroly.qrmenu.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.Map;

@Getter
@Setter
@Configuration
@PropertySource("classpath:templateConfig.properties") 
@ConfigurationProperties(prefix = "restroly.excel")
public class ExcelMappingConfig {
    private String templatePath;
    private Map<String, String> foodMapping; 
}
