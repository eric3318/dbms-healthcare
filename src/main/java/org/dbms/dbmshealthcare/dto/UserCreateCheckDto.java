package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UserCreateCheckDto(
    String name,
    @Size(min = 10, max = 10) String personalHealthNumber,
    @Past LocalDate dateOfBirth) {
}
