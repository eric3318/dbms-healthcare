package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record MedicalRecordUpdateDto(
    String doctorNotes,
    String finalDiagnosis,
    // String requisitions,
    // Prescription prescriptions,
    BigDecimal billingAmount
) {} 