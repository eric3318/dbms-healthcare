package org.dbms.dbmshealthcare.controller;

import com.nimbusds.jwt.JWT;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.IdentityCheckDto;
import org.dbms.dbmshealthcare.dto.TestIdentityCheckDto;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.dto.UserLoginDto;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.service.AuthService;
import org.dbms.dbmshealthcare.utils.AuthUtils;
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
@Tag(name = "Authentication Controller", description = "API endpoints for user authentication and authorization")
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "Register new user", description = "Creates a new user account in the system with the provided credentials")
  @PostMapping("/register")
  public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateDto userCreateDto
  ) {
    User user = authService.register(userCreateDto);
    return ResponseEntity.ok(user);
  }

  @PostMapping("/identity")
  public ResponseEntity<String> verifyIdentity(
      @Valid @RequestBody IdentityCheckDto identityCheckDto, HttpServletResponse httpResponse) {
    authService.verifyIdentity(AuthUtils.getAuthenticatedUserInfo().id(), identityCheckDto);

    ResponseCookie refreshTokenCookie = buildCookie("refresh_token", "", 0);
    ResponseCookie accessTokenCookie = buildCookie("access_token", "", 0);

    httpResponse.addHeader("Set-Cookie", refreshTokenCookie.toString());
    httpResponse.addHeader("Set-Cookie", accessTokenCookie.toString());

    return ResponseEntity.ok("Verification successful");
  }

  @PostMapping("/test-identity")
  public ResponseEntity<String> testVerify(
      @Valid @RequestBody TestIdentityCheckDto identityCheckDto) {
    authService.verifyIdentity(identityCheckDto);
    return ResponseEntity.ok("Verification successful");
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

  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpServletResponse httpResponse) {
    ResponseCookie refreshTokenCookie = buildCookie("refresh_token", "", 0);
    ResponseCookie accessTokenCookie = buildCookie("access_token", "", 0);

    httpResponse.addHeader("Set-Cookie", refreshTokenCookie.toString());
    httpResponse.addHeader("Set-Cookie", accessTokenCookie.toString());

    return ResponseEntity.ok("Logout successful");
  }


  @PreAuthorize("hasRole('Refresh_token')")
  @PostMapping("/refresh")
  public ResponseEntity<String> refreshToken(HttpServletResponse httpResponse) {
    Jwt refreshToken = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    JWT accessToken = authService.refreshToken(refreshToken.getTokenValue());

    ResponseCookie accessTokenCookie = buildCookie("access_token", accessToken.serialize(), 5 * 60);

    httpResponse.addHeader("Set-Cookie", accessTokenCookie.toString());

    return ResponseEntity.ok("Token refreshed");
  }

  @PostMapping("/me")
  public ResponseEntity<?> me() {
    Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Map<String, Object> claims =  jwt.getClaims();

    return ResponseEntity.ok(claims);
  }

  private ResponseCookie buildCookie(String name, String value, int maxAge) {
    ResponseCookie cookie = ResponseCookie.from(name, value)
        .httpOnly(true)
        .secure(true) // set to false when inserting data
        .sameSite("None")
        .path("/")
        .maxAge(maxAge).build();
    return cookie;
  }

}
