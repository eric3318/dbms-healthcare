package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record RequisitionCreateDto(
    @NotBlank
    String medicalRecordId,
    
    @NotBlank
    String testName
) {
} 