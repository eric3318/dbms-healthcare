package org.dbms.dbmshealthcare.dto;

public record DoctorUpdateDto(
    String name,
    String specialization,
    String email,
    String phoneNumber 
) {
} 