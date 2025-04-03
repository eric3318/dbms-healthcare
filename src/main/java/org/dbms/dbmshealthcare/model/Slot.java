package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDateTime;
import lombok.Data;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "slots")
@Data
public class Slot {
  @Id
  private String id;

  @NotBlank
  @Field(name = "doctor_id")
  private String doctorId;

  @Field(name = "patient_id")
  private String patientId;

  @NotBlank
  @Field(name = "start_time")
  private LocalDateTime startTime;

  @NotBlank
  @Field(name = "end_time")
  private LocalDateTime endTime;

  private SlotStatus status = SlotStatus.AVAILABLE;

  @Field(name = "is_reserved")
  private boolean isReserved = false;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
