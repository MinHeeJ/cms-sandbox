package com.example.cms.operations.health;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Map;

@Service
public class HealthService {
    private final JdbcTemplate jdbc;
    public HealthService(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public Map<String, Object> check() {
        String db = "UP";
        try { jdbc.queryForObject("select 1", Integer.class); } catch (Exception ex) { db = "DOWN"; }
        return Map.of("status", "UP".equals(db) ? "UP" : "PARTIAL", "database", db, "fileStorage", Files.isWritable(Path.of(System.getProperty("java.io.tmpdir"))) ? "UP" : "WARN", "checkedAt", Instant.now().toString());
    }
}
