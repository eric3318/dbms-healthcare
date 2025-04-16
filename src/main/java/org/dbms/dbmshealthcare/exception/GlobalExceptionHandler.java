package org.dbms.dbmshealthcare.exception;

import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(UnauthorizedOperationException.class)
  public ResponseEntity<String> handleUnauthorized(UnauthorizedOperationException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }

  @ExceptionHandler(UncategorizedMongoDbException.class)
  public ResponseEntity<String> handleMongoAccessError(UncategorizedMongoDbException ex) {
    if (ex.getMessage().contains("Unauthorized")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to database operation.");
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("MongoDB error occurred.");
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleException(Exception exception) {
    return new ResponseEntity<>(exception.getMessage() , HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
