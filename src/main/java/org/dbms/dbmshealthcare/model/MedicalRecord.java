package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.dbms.dbmshealthcare.model.pojo.Prescription;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "medical_records")
public class MedicalRecord {
  @Id
  private String id;

  @NotBlank
  @Field(name = "patient_id")
  private String patientId;

  @NotBlank
  @Field(name = "visit_reason")
  private String visitReason;

  @NotBlank
  @Field(name = "patient_description")
  private String patientDescription;

  @Field(name = "doctor_notes")
  private String doctorNotes;

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
