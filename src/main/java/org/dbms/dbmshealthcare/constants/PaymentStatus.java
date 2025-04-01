package org.dbms.dbmshealthcare.constants;

public enum PaymentStatus {
  PENDING("Pending"),
  PROCESSING("Processing"),
  COMPLETED("Completed"),
  FAILED("Failed");

  private final String status;

  PaymentStatus(String status) {
    this.status = status;
  }


  @Override
  public String toString() {
    return this.status;
  }
}
