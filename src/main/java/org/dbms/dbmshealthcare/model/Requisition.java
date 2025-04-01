package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import lombok.Data;
import org.dbms.dbmshealthcare.constants.RequisitionStatus;
import org.dbms.dbmshealthcare.model.pojo.RequisitionResult;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "requisitions")
@Data
public class Requisition {
  @Id
  private String id;

  @NotBlank
  @Field(name = "medical_record_id")
  private String medicalRecordId;

  @NotBlank
  @Field(name = "test_name")
  private String testName;

  private RequisitionStatus status = RequisitionStatus.PENDING;

  private RequisitionResult result;

  @Field(name = "requested_at")
  @CreatedDate
  private Instant requestedAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
