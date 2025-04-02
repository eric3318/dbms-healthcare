package org.dbms.dbmshealthcare.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleSomeSpecificException(Exception exception) {
    return new ResponseEntity<>(exception.getMessage() , HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
