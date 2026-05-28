package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.AppointmentDTO;
import com.hospital.entity.User;
import com.hospital.repository.UserRepository;
import com.hospital.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // Patient: Book an appointment
    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentDTO>> book(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        Long userId = getUserId(userDetails);
        AppointmentDTO dto = appointmentService.bookAppointment(
                userId,
                Long.parseLong(body.get("doctorId")),
                body.get("appointmentDate"),
                body.get("timeSlot"),
                body.get("reason")
        );
        return ResponseEntity.ok(ApiResponse.success("Appointment booked", dto));
    }

    // Patient: View own appointment history
    @GetMapping("/patient")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getPatientAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched",
                appointmentService.getPatientAppointments(userId)));
    }

    // Doctor: View own appointments
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getDoctorAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched",
                appointmentService.getDoctorAppointments(userId)));
    }

    // Doctor/Admin: Update appointment status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        AppointmentDTO dto = appointmentService.updateStatus(id, body.get("status"), body.get("notes"), user);
        return ResponseEntity.ok(ApiResponse.success("Status updated", dto));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
