package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;
import org.dbms.dbmshealthcare.model.pojo.Prescription;

public record MedicalRecordUpdateDto(
    String doctorNotes,
    String finalDiagnosis,
    List<Prescription> prescriptions,
    BigDecimal billingAmount
) {} 