package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "payments")
public class Payment {
  @Id
  private String id;

  @Field(name="medical_record_id")
  private String medicalRecordId;

  private BigDecimal amount;

  private String status;

}
