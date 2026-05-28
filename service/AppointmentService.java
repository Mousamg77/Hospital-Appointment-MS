package com.hospital.service;

import com.hospital.dto.AppointmentDTO;
import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.entity.User;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public AppointmentDTO bookAppointment(Long patientUserId, Long doctorId, String date, String timeSlot, String reason) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(LocalDate.parse(date))
                .timeSlot(timeSlot)
                .reason(reason)
                .status(Appointment.Status.PENDING)
                .build();

        appointmentRepository.save(appointment);
        return toDTO(appointment);
    }

    public List<AppointmentDTO> getPatientAppointments(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return appointmentRepository.findByPatient(patient).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorAppointments(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return appointmentRepository.findByDoctor(doctor).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public AppointmentDTO updateStatus(Long appointmentId, String status, String notes, User currentUser) {
        if (status == null || status.isBlank()) {
            throw new BadRequestException("status is required");
        }
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        if (currentUser.getRole() == User.Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new BadRequestException("Doctor profile not found"));
            if (!appointment.getDoctor().getId().equals(doctor.getId())) {
                throw new BadRequestException("You can only update appointments assigned to you");
            }
        } else if (currentUser.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("You are not allowed to update appointment status");
        }

        try {
            appointment.setStatus(Appointment.Status.valueOf(status.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status value: " + status);
        }
        if (notes != null && !notes.isBlank()) {
            appointment.setNotes(notes);
        }
        appointmentRepository.save(appointment);
        return toDTO(appointment);
    }

    public AppointmentDTO toDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getUser().getName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getUser().getName())
                .specialization(a.getDoctor().getSpecialization())
                .appointmentDate(a.getAppointmentDate())
                .timeSlot(a.getTimeSlot())
                .reason(a.getReason())
                .status(a.getStatus())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
