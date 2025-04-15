package org.dbms.dbmshealthcare.constants;

public enum Role {
  ADMIN("Admin"),
  DOCTOR("Doctor"),
  PATIENT("Patient"),
  GUEST("Guest");

  private final String role;

  Role(String role) {
    this.role = role;
  }

  @Override
  public String toString() {
    return this.role;
  }
}
