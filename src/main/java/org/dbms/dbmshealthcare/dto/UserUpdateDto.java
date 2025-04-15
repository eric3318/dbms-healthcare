package org.dbms.dbmshealthcare.dto;

import java.time.LocalDate;
import java.util.List;
import org.dbms.dbmshealthcare.constants.Role;

public record UserUpdateDto(String jwtId, List<Role> roles, String name, String phoneNumber, LocalDate dateOfBirth){
    
}
