package org.dbms.dbmshealthcare.constants;

public enum JwtType {
  ACCESS("Access"),
  REFRESH("Refresh");

  private final String type;

  JwtType(String type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return this.type;
  }
}
