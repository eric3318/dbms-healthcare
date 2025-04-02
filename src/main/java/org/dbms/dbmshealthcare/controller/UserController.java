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

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PreAuthorize("hasRole('Admin')")
  @GetMapping("/{id}")
  public ResponseEntity<User> getUser(@PathVariable String id) {
    User user = userService.getUserById(id);
    return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
  }
}
