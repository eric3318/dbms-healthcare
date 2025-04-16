package org.dbms.dbmshealthcare.dto.analytics;

public record DoctorCountBySpecialtyDto(
  String specialty, int doctorCount
) {}
