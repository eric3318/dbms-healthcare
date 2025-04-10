package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record DoctorCreateDto(
    @NotBlank String name,
    @NotBlank String specialization,
    @NotBlank String licenseNumber
) {
} 