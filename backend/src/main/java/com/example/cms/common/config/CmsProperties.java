package com.example.cms.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cms")
public record CmsProperties(Cors cors, Storage storage) {
    public record Cors(String allowedOrigins) {}
    public record Storage(String localPath, long maxFileSizeBytes) {}
}
