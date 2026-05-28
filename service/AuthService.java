package com.hospital.service;

import com.hospital.dto.AuthResponse;
import com.hospital.dto.LoginRequest;
import com.hospital.dto.RegisterRequest;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.entity.User;
import com.hospital.exception.BadRequestException;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User.Role role = request.getRole() != null ? request.getRole() : User.Role.PATIENT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        userRepository.save(user);

        // Auto-create patient/doctor profile
        if (role == User.Role.PATIENT) {
            Patient patient = Patient.builder().user(user).build();
            patientRepository.save(patient);
        } else if (role == User.Role.DOCTOR) {
            Doctor doctor = Doctor.builder().user(user).specialization("General").build();
            doctorRepository.save(doctor);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .userId(user.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .userId(user.getId())
                .build();
    }
}

