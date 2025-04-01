package org.dbms.dbmshealthcare.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import org.dbms.dbmshealthcare.constants.Role;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "users")
public class User {

  @Id
  private String id;

  @NotBlank
  private String name;

  @Email(message = "Email should be valid")
  @NotBlank
  private String email;

  @Size(min = 8, message = "Password must be at least 8 characters long")
  @NotBlank
  private String password;

  @Past(message = "Date of birth must be in the past")
  @Field(name = "date_of_birth")
  private LocalDateTime dateOfBirth;

  @Size(min = 10, max = 12, message = "Phone number must be between 10 and 12 digits")
  @Field(name = "phone_number")
  private String phoneNumber;

  private List<Role> roles;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;
}
