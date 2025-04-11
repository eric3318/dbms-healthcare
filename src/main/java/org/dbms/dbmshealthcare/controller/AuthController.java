package org.dbms.dbmshealthcare.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.gson.JsonSerializer;
import com.nimbusds.jwt.JWT;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.IdentityCheckDto;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.dto.UserLoginDto;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.service.AuthService;
import org.dbms.dbmshealthcare.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Controller", description = "API endpoints for user authentication and authorization")
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "Register new user", description = "Creates a new user account in the system with the provided credentials")
  @PostMapping("/register")
  public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateDto userCreateDto,
      HttpServletRequest httpRequest) throws JsonProcessingException {
    Optional<Cookie> tokenCookie = Optional.ofNullable(httpRequest.getCookies())
        .flatMap(cookies -> Arrays.stream(cookies)
            .filter(cookie -> "verification_token".equals(cookie.getName()))
            .findFirst());

    if (tokenCookie.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    ObjectMapper objectMapper = new ObjectMapper();

    String json = new String(
        Base64.getDecoder().decode(tokenCookie.get().getValue()),
        StandardCharsets.UTF_8
    );

    JsonNode node = objectMapper.readTree(json);
    String identity = node.get("identity").asText();
    String id = node.get("id").asText();

    User user = authService.register(identity, id, userCreateDto);
    return ResponseEntity.ok(user);
  }

  @PostMapping("/identity")
  public ResponseEntity<?> verifyIdentity(
      @Valid @RequestBody IdentityCheckDto identityCheckDto) {
    String id = authService.verifyIdentity(identityCheckDto);

    if (id == null) {
      return ResponseEntity.badRequest().build();
    }

    String identityType = identityCheckDto.licenseNumber() != null ? "doctor" : "patient";

    String payload = String.format("{\"identity\":\"%s\", \"id\":\"%s\"}", identityType, id);

    String token = Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));

    ResponseCookie cookie = buildCookie("verification_token", token, 10 * 60);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .build();
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
