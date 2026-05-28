package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // Doctor: Add prescription for an appointment
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> addPrescription(
            @RequestBody Map<String, String> body) {
        Long appointmentId = Long.parseLong(body.get("appointmentId"));
        String medicine = body.get("medicineDetails");
        String notes = body.get("notes");
        Map<String, Object> result = prescriptionService.addPrescription(appointmentId, medicine, notes);
        return ResponseEntity.ok(ApiResponse.success("Prescription added", result));
    }

    // Patient/Doctor: Get prescription by appointment ID
    @GetMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPrescription(
            @PathVariable Long appointmentId) {
        Map<String, Object> result = prescriptionService.getPrescription(appointmentId);
        return ResponseEntity.ok(ApiResponse.success("Prescription fetched", result));
    }
}
