package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;


public record IdentityCheckDto(
    @NotBlank String name,
    String personalHealthNumber,
    String licenseNumber) {
}
