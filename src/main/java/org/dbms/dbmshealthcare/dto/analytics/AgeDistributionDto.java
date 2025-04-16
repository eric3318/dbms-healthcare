package org.dbms.dbmshealthcare.dto.analytics;

public record AgeDistributionDto(
    String ageGroup,
    long patientCount
) {} 