package org.dbms.dbmshealthcare.dto;

import jakarta.validation.constraints.NotBlank;
import org.dbms.dbmshealthcare.constants.Role;


public record TestIdentityCheckDto(
    @NotBlank String userId,
    @NotBlank String roleId,
    Role role
    ){
}
