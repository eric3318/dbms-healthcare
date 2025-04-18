package org.dbms.dbmshealthcare.constants;

public enum RequisitionStatus {
  PENDING("Pending"),
  PENDING_RESULT("Pending_result"),
  COMPLETED("Completed");

  private final String status;

  RequisitionStatus(String status) {
    this.status = status;
  }

  @Override
  public String toString() {
    return this.status;
  }
}
