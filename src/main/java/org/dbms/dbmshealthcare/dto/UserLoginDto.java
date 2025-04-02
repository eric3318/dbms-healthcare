package org.dbms.dbmshealthcare.dto;

public record UserLoginDto(String email, String password, boolean rememberMe) {
}
