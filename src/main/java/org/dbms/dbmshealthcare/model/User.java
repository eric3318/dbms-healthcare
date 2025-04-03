package org.dbms.dbmshealthcare.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.Role;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Document(collection = "users")
@Data
@RequiredArgsConstructor
public class User implements UserDetails {

  @Id
  private String id;

  private String name;

  @Indexed(unique = true)
  private String email;

  private String password;

  @Field(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Field(name = "phone_number")
  private String phoneNumber;

  private List<Role> roles;

  @Field(name = "jwt_id")
  private String jwtId;

  @Field(name = "created_at")
  @CreatedDate
  private Instant createdAt;

  @Field(name = "updated_at")
  @LastModifiedDate
  private Instant updatedAt;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  @Override
  public String getPassword() {
    return this.password;
  }

  @Override
  public String getUsername() {
    return this.email;
  }
}
