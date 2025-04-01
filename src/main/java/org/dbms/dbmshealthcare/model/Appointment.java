package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDateTime;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "appointments")
@Data
public class Appointment {
  @Id
  private String id;

  @NotBlank
  @Field(name = "doctor_id")
  private String doctorId;

  @NotBlank
  @Field(name = "patient_id")
  private String patientId;

  @NotBlank
  @Field(name = "start_time")
  private LocalDateTime startTime;

  @NotBlank
  @Field(name = "end_time")
  private LocalDateTime endTime;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
