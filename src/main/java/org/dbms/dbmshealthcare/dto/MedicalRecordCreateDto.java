package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import org.dbms.dbmshealthcare.model.pojo.Prescription;

public record MedicalRecordCreateDto(
    @NotBlank(message = "Patient ID is required")
    String patientId,
    
    @NotBlank(message = "Visit reason is required")
    String visitReason,
    
    @NotBlank(message = "Patient description is required")
    String patientDescription,
    
    String doctorNotes,
    String finalDiagnosis,
    List<Prescription> prescriptions,
    
    @NotNull(message = "Billing amount is required")
    BigDecimal billingAmount
) {}