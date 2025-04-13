package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record MedicalRecordCreateDto(@NotBlank String appointmentId,
                                     @NotBlank String patientDescription,
                                     @NotBlank String doctorNotes, BigDecimal billingAmount) {

}
