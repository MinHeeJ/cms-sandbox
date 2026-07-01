package com.example.cms.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.List;

@Component
public class SequenceSynchronizer implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(SequenceSynchronizer.class);
    private static final List<String> TABLES = List.of(
            "folders",
            "documents",
            "attachments",
            "audit_logs",
            "deployment_records",
            "software_components",
            "vulnerability_records",
            "backup_records",
            "migration_records",
            "project_schedules",
            "requirement_traces",
            "project_members",
            "risk_issues",
            "deliverables",
            "change_requests"
    );

    private final JdbcTemplate jdbc;
    private final DataSource dataSource;

    public SequenceSynchronizer(JdbcTemplate jdbc, DataSource dataSource) {
        this.jdbc = jdbc;
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            String productName = metaData.getDatabaseProductName();
            if (productName == null || !productName.toLowerCase().contains("postgresql")) {
                return;
            }
        }

        for (String table : TABLES) {
            syncTableSequence(table);
        }
    }

    private void syncTableSequence(String tableName) {
        String sql = "select setval(pg_get_serial_sequence(?, 'id'), "
                + "coalesce((select max(id) from " + tableName + "), 0) + 1, false)";
        try {
            jdbc.queryForObject(sql, Long.class, tableName);
        } catch (Exception ex) {
            log.debug("Skipping sequence synchronization for {}: {}", tableName, ex.getMessage());
        }
    }
}
