package org.dbms.dbmshealthcare.dto;

import java.math.BigDecimal;
import java.util.List;
import org.dbms.dbmshealthcare.model.pojo.Prescription;

public record MedicalRecordUpdateDto(String patientDescription, String doctorNotes,
                                     String finalDiagnosis,
                                     List<String> requisitionIds, List<Prescription> prescriptions,
                                     BigDecimal billingAmount) {

}
