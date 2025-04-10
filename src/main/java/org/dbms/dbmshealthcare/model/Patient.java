package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "patients")
@Data
public class Patient {
  @Id
  private String id;

  private final String name;

  @Field(name = "personal_health_number")
  @Indexed(unique = true)
  private final String personalHealthNumber;

  private final String address;

  @Field(name = "user_id")
  private String userId;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
