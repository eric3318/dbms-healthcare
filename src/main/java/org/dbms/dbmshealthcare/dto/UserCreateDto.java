package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UserCreateDto(
    @NotBlank @Email String email,
    @Size(min = 8) @NotBlank String password,
    @Size(min = 10, max = 12) @NotBlank String phoneNumber,
    @Past LocalDate dateOfBirth
) {

}
