package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "patients")
@Data
public class Patient {
  @Id
  private String id;

  @NotBlank
  @Size(min=10, max=10, message = "Personal Health Number must be 10 digits long")
  private String personalHealthNumber;

  @NotBlank
  private String address;

  @Field(name = "user_id")
  private String userId;

  @Field(name = "doctor_id")
  private String doctorId;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
