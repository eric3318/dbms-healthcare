package org.dbms.dbmshealthcare.controller;

import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Controller", description = "API endpoints for user management")
public class UserController {

  private final UserService userService;

  @Operation(summary = "Get user by ID", description = "Retrieves user information by their unique identifier (Admin only)")
  @GetMapping("/{id}")
  public ResponseEntity<User> getUser(@PathVariable String id) {
    User user = userService.getUserById(id);
    return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
  }
}
