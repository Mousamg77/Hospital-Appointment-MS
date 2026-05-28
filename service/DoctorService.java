package com.hospital.service;

import com.hospital.dto.DoctorDTO;
import com.hospital.entity.Doctor;
import com.hospital.entity.User;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return toDTO(doctor);
    }

    public DoctorDTO addDoctor(DoctorDTO dto, String rawPassword) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .role(User.Role.DOCTOR)
                .build();
        userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(user)
                .specialization(dto.getSpecialization())
                .experienceYears(dto.getExperienceYears())
                .phone(dto.getPhone())
                .availableDays(dto.getAvailableDays())
                .build();
        doctorRepository.save(doctor);
        return toDTO(doctor);
    }

    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setPhone(dto.getPhone());
        doctor.setAvailableDays(dto.getAvailableDays());

        User user = doctor.getUser();
        user.setName(dto.getName());
        userRepository.save(user);

        doctorRepository.save(doctor);
        return toDTO(doctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }

    public DoctorDTO toDTO(Doctor doctor) {
        return DoctorDTO.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .name(doctor.getUser().getName())
                .email(doctor.getUser().getEmail())
                .specialization(doctor.getSpecialization())
                .experienceYears(doctor.getExperienceYears())
                .phone(doctor.getPhone())
                .availableDays(doctor.getAvailableDays())
                .build();
    }
}
