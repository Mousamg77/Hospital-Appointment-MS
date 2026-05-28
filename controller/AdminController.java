package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.AppointmentDTO;
import com.hospital.dto.DoctorDTO;
import com.hospital.service.AppointmentService;
import com.hospital.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    // Add a doctor (Admin creates user + doctor profile)
    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<DoctorDTO>> addDoctor(@RequestBody Map<String, Object> body) {
        DoctorDTO dto = DoctorDTO.builder()
                .name((String) body.get("name"))
                .email((String) body.get("email"))
                .specialization((String) body.get("specialization"))
                .experienceYears(body.get("experienceYears") != null
                        ? Integer.parseInt(body.get("experienceYears").toString()) : 0)
                .phone((String) body.get("phone"))
                .availableDays((String) body.get("availableDays"))
                .build();
        String rawPassword = (String) body.getOrDefault("password", "Doctor@123");
        DoctorDTO saved = doctorService.addDoctor(dto, rawPassword);
        return ResponseEntity.ok(ApiResponse.success("Doctor added", saved));
    }

    // Edit a doctor
    @PutMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> updateDoctor(
            @PathVariable Long id, @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.updateDoctor(id, dto)));
    }

    // Delete a doctor
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted", null));
    }

    // View all appointments
    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success("All appointments", appointmentService.getAllAppointments()));
    }
}
