package com.community.member.config;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ObservabilityConfig {
    @Bean
    MeterRegistryCustomizer<MeterRegistry> memberManagementMetrics() {
        return registry -> registry.config().commonTags("domain", "member-management");
    }
}
