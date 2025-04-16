package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;

public record AppointmentCreateDto(@NotBlank String slotId, @NotBlank String visitReason) {

}
