package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import java.time.Instant;
public record PaymentCreateDto(
    @NotBlank(message = "Medical Record ID is required")
    String medicalRecordId,
    
    BigDecimal amount,
    
    PaymentStatus status
) {}