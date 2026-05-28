package com.hospital.config;

import com.hospital.entity.*;
import com.hospital.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DepartmentRepository departmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            if (userRepository.count() > 0) {
                System.out.println("Database already seeded. Skipping...");
                return;
            }

            System.out.println("Starting database seeding...");

            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@hospital.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);

            List<Department> depts = new ArrayList<>();
            depts.add(Department.builder().name("General Medicine").description("Primary care").build());
            List<Department> savedDepts = departmentRepository.saveAllAndFlush(depts);

            User doctorUser = User.builder()
                    .name("Dr. Demo Doctor")
                    .email("doctor@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .role(User.Role.DOCTOR)
                    .build();
            userRepository.save(doctorUser);

            Doctor doctor = Doctor.builder()
                    .user(doctorUser)
                    .department(savedDepts.get(0))
                    .specialization("General Practitioner")
                    .experienceYears(10)
                    .phone("9876543210")
                    .availableDays("Mon,Tue,Wed,Thu,Fri")
                    .build();
            doctorRepository.save(doctor);

            User patientUser = User.builder()
                    .name("Demo Patient")
                    .email("patient@hospital.com")
                    .password(passwordEncoder.encode("Patient@123"))
                    .role(User.Role.PATIENT)
                    .build();
            userRepository.save(patientUser);

            Patient patient = Patient.builder()
                    .user(patientUser)
                    .dateOfBirth("1990-01-01")
                    .gender("Other")
                    .contact("1234567890")
                    .address("123 Demo Street")
                    .build();
            patientRepository.save(patient);

            for (int i = 0; i < 3; i++) {
                Appointment appointment = Appointment.builder()
                        .patient(patient)
                        .doctor(doctor)
                        .appointmentDate(LocalDate.now().plusDays(i - 1))
                        .timeSlot("10:00 AM")
                        .reason("Sample checkup " + (i + 1))
                        .status(i == 0 ? Appointment.Status.COMPLETED : Appointment.Status.PENDING)
                        .notes(i == 0 ? "Visit completed." : "")
                        .build();
                Appointment savedAppt = appointmentRepository.save(appointment);

                if (i == 0) {
                    MedicalRecord record = MedicalRecord.builder()
                            .patient(patient)
                            .doctor(doctor)
                            .recordDate(savedAppt.getAppointmentDate())
                            .diagnosis("Routine wellness")
                            .treatment("General guidance")
                            .notes("Follow up as needed.")
                            .build();
                    medicalRecordRepository.save(record);

                    Prescription rx = Prescription.builder()
                            .appointment(savedAppt)
                            .medicineDetails("Demo Medicine 500mg — twice daily")
                            .notes("Take after meals.")
                            .build();
                    prescriptionRepository.save(rx);
                }
            }

            System.out.println("Database seeded successfully!");
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR DURING SEEDING: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
