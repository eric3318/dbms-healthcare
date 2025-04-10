package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record MedicalRecordCreateDto(
    @NotBlank String id,
    @NotBlank String patientId,
    @NotBlank String doctorId,
    @NotBlank String visitReason,
    @NotBlank String patientDescription,
    String doctorNotes,
    String finalDiagnosis,
    // String requisitions,
    // Prescription prescriptions,
    BigDecimal billingAmount,
) 