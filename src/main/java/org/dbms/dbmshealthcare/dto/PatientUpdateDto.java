package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record PatientUpdateDto(
    @NotBlank
    String address
) {
} 