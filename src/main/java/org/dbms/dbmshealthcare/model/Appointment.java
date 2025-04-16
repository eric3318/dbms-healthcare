package org.dbms.dbmshealthcare.model;

import java.time.Instant;
import lombok.Data;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.model.pojo.SlotDetails;
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

  @Field(name = "patient_id")
  private final String patientId;

  @Field(name = "doctor_id")
  private final String doctorId;

  @Field(name = "patient_name")
  private final String patientName;

  @Field(name = "doctor_name")
  private final String doctorName;

  private final SlotDetails slot;

  @Field(name = "visit_reason")
  private final String visitReason;

  private AppointmentStatus status = AppointmentStatus.PENDING_APPROVAL;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;

}
