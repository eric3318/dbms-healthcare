package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

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
    BigDecimal billingAmount
) {}