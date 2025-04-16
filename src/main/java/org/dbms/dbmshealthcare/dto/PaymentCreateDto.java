package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import java.time.Instant;
public record PaymentCreateDto(
    @NotBlank(message = "Medical Record ID is required")
    String medicalRecordId,
    
    @NotBlank(message = "amount is required")
    BigDecimal amount,
    
    @NotBlank(message = "status is required")
    PaymentStatus status,
    
    Instant requestedAt,

    Instant updatedAt
) {}