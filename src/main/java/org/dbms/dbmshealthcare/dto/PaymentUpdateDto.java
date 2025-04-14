package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import java.time.Instant;

public record PaymentUpdateDto(
    PaymentStatus status,
    BigDecimal amount,
    Instant requestedAt,
    Instant updatedAt
) {} 