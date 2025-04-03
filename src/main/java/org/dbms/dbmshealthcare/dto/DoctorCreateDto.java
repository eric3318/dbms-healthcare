package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record DoctorCreateDto(
    @NotBlank String userId,
    @NotBlank String specialization
) {
} 