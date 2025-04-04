package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatientCreateDto(
    @NotBlank
    @Size(min=10, max=10, message = "Personal Health Number must be 10 digits long")
    String personalHealthNumber,
    
    @NotBlank
    String address,
    
    @NotBlank
    String userId,
    
    String doctorId
) {
} 