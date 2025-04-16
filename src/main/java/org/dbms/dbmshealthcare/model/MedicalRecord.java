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
  private String patientId;

  @Field(name = "doctor_id")
  private String doctorId;

  @NotBlank
  @Field(name = "visit_reason")
  private String visitReason;

  @NotBlank
  @Field(name = "patient_description")
  private String patientDescription;

  @Field(name = "doctor_notes")
  private String doctorNotes;

  private String finalDiagnosis;

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