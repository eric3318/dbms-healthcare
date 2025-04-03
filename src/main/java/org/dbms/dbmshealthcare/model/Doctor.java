package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "doctors")
public class Doctor {
  @Id
  private String id;

  @NotBlank
  private String specialization;

  @Field(name = "user_id")
  private String userId;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
