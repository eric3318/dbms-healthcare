package org.dbms.dbmshealthcare.model;

import java.math.BigDecimal;
import java.time.Instant;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;

@Document(collection = "payments")
@Data
public class Payment {
  @Id
  private String id;

  @Field(name="medical_record_id")
  private String medicalRecordId;

  private BigDecimal amount;

  private PaymentStatus status = PaymentStatus.PENDING;

  @Field(name = "requested_at")
  @CreatedDate
  private Instant requestedAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
