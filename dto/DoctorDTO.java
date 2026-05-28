package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String specialization;
    private int experienceYears;
    private String phone;
    private String availableDays;
}
