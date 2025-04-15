package org.dbms.dbmshealthcare.dto.analytics;

public record TopDoctorsDto(
    String doctorId,
    String doctorName,
    String specialization,
    int appointmentCount
) {} 