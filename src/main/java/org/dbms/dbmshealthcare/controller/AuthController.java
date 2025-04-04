package org.dbms.dbmshealthcare.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.dto.UserLoginDto;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.service.AuthService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "Register a new user", description = "Creates a new user account with the provided information.")
  @PostMapping("/register")
  public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateDto userCreateDto) {

    User user = authService.register(userCreateDto);
    return ResponseEntity.ok(user);
  }

  @Operation(summary = "User login", description = "Authenticates a user and returns access and refresh tokens as HTTP-only cookies.")
  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody UserLoginDto loginDto,
      HttpServletResponse httpResponse) throws Exception {
    TokenPair tokens = authService.login(loginDto.email(), loginDto.password(),
        loginDto.rememberMe());
    String accessToken = tokens.accessToken();
    String refreshToken = tokens.refreshToken();

    ResponseCookie refreshTokenCookie = buildCookie("refresh_token", refreshToken,
        loginDto.rememberMe() ? 15 * 24 * 60 * 60 : 24 * 60 * 60);

    ResponseCookie accessTokenCookie = buildCookie("access_token", accessToken, 5 * 60);

    httpResponse.addHeader("Set-Cookie", refreshTokenCookie.toString());
    httpResponse.addHeader("Set-Cookie", accessTokenCookie.toString());

    return ResponseEntity.ok("Login successful");
  }

  @Operation(summary = "Refresh access token", description = "Uses a valid refresh token to issue a new access token.")
  @PreAuthorize("hasRole('refresh_token')")
  @PostMapping("/refresh")
  public ResponseEntity<String> refreshToken(HttpServletResponse httpResponse) {
    Jwt refreshToken = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    String accessToken = authService.refreshToken(refreshToken.getTokenValue());

    ResponseCookie accessTokenCookie = buildCookie("access_token", accessToken, 5 * 60);

    httpResponse.addHeader("Set-Cookie", accessTokenCookie.toString());

    return ResponseEntity.ok("Token refreshed");
  }

  @Operation(summary = "Get current user info", description = "Returns the currently authenticated user's JWT claims.")
  @PostMapping("/me")
  public ResponseEntity<?> me() {
    Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Map<String, Object> infoMap = jwt.getClaims();

    return ResponseEntity.ok(infoMap);
  }

  private ResponseCookie buildCookie(String name, String value, int maxAge) {
    ResponseCookie cookie = ResponseCookie.from(name, value)
        .httpOnly(true)
        .secure(true)
        .sameSite("None")
        .path("/")
        .maxAge(maxAge).build();
    return cookie;
  }
}
