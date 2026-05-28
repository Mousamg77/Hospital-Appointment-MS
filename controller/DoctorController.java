package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.DoctorDTO;
import com.hospital.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched", doctorService.getAllDoctors()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Doctor fetched", doctorService.getDoctorById(id)));
    }
}
