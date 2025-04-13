package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import lombok.Data;
import org.dbms.dbmshealthcare.model.pojo.Prescription;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "medical_records")
@Data
public class MedicalRecord {
  @Id
  private String id;

  @Field(name = "patient_id")
  private final String patientId;

  @Field(name = "doctor_id")
  private final String doctorId;

  @Field(name = "appointment_id")
  private final String appointmentId;

  @Field(name = "visit_reason")
  private final String visitReason;

  @Field(name = "patient_description")
  private final String patientDescription;

  @Field(name = "doctor_notes")
  private final String doctorNotes;

  @Field(name = "final_diagnosis")
  private String finalDiagnosis;

  private List<String> requisitions;

  private List<Prescription> prescriptions;

  @Field(name = "billing_amount")
  private BigDecimal billingAmount;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
