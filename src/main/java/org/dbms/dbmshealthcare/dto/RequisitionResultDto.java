package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record RequisitionResultDto(
    @NotBlank
    String description,
    
    @NotBlank
    String conclusion
) {
} 