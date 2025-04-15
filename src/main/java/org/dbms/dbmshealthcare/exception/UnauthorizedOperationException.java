package org.dbms.dbmshealthcare.exception;

public class UnauthorizedOperationException extends RuntimeException{

  public UnauthorizedOperationException(String message) {
    super(message);
  }
}
