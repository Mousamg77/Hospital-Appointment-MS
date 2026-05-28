package com.hospital.service;

import com.hospital.dto.AppointmentDTO;
import com.hospital.entity.Appointment;
import com.hospital.entity.Prescription;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PrescriptionRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    public Map<String, Object> addPrescription(Long appointmentId, String medicineDetails, String notes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (prescriptionRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new BadRequestException("Prescription already exists for this appointment");
        }

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .medicineDetails(medicineDetails)
                .notes(notes)
                .build();
        prescriptionRepository.save(prescription);

        // Mark appointment as COMPLETED
        appointment.setStatus(Appointment.Status.COMPLETED);
        appointmentRepository.save(appointment);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", prescription.getId());
        response.put("appointmentId", appointmentId);
        response.put("medicineDetails", medicineDetails);
        response.put("notes", notes != null ? notes : "");
        response.put("createdAt", prescription.getCreatedAt());
        return response;
    }

    public Map<String, Object> getPrescription(Long appointmentId) {
        Prescription p = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("No prescription for appointment: " + appointmentId));
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", p.getId());
        response.put("appointmentId", appointmentId);
        response.put("medicineDetails", p.getMedicineDetails());
        response.put("notes", p.getNotes() != null ? p.getNotes() : "");
        response.put("createdAt", p.getCreatedAt());
        return response;
    }
}
