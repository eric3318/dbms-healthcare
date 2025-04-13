package org.dbms.dbmshealthcare.dto;

import java.time.LocalDateTime;

public record MedicalRecordFilter(String patientId, String doctorId, LocalDateTime from,
                                  LocalDateTime to) {

}
