package com.hospital.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Aligns PostgreSQL {@code appointments_status_check} with {@link com.hospital.entity.Appointment.Status}.
 * Older or hand-created schemas often omit APPROVED, which breaks doctor approve/reject.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class AppointmentStatusConstraintFix implements ApplicationRunner {

    private final DataSource dataSource;

    @Override
    public void run(ApplicationArguments args) {
        String sqlDrop = "ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check";
        String sqlAdd =
                "ALTER TABLE appointments ADD CONSTRAINT appointments_status_check "
                        + "CHECK (status::text IN ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'))";

        try (Connection c = dataSource.getConnection(); Statement s = c.createStatement()) {
            s.execute(sqlDrop);
            s.execute(sqlAdd);
            log.info("appointments_status_check updated to allow PENDING, APPROVED, COMPLETED, CANCELLED");
        } catch (Exception e) {
            log.warn("Could not refresh appointments_status_check (non-fatal): {}", e.getMessage());
        }
    }
}
