package org.dbms.dbmshealthcare.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.dto.UserLoginDto;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.service.AuthService;
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

  @PostMapping("/register")
  public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateDto userCreateDto) {

    User user = authService.register(userCreateDto);
    return ResponseEntity.ok(user);
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody UserLoginDto loginDto,
      HttpServletResponse httpResponse) throws Exception {
    TokenPair tokens = authService.login(loginDto.email(), loginDto.password(),
        loginDto.rememberMe());
    String accessToken = tokens.accessToken();
    String refreshToken = tokens.refreshToken();

    Cookie refreshTokenCookie = buildCookie("refresh_token", refreshToken,
        loginDto.rememberMe() ? 15 * 24 * 60 * 60 : 24 * 60 * 60);

    Cookie accessTokenCookie = buildCookie("access_token", accessToken, 5 * 60);

    httpResponse.addCookie(refreshTokenCookie);
    httpResponse.addCookie(accessTokenCookie);

    return ResponseEntity.ok("Login successful");
  }

  @PreAuthorize("hasRole('refresh_token')")
  @PostMapping("/refresh")
  public ResponseEntity<String> refreshToken(HttpServletResponse httpResponse) {
    Jwt refreshToken = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    String accessToken = authService.refreshToken(refreshToken.getTokenValue());

    Cookie accessTokenCookie = buildCookie("access_token", accessToken, 5 * 60);

    httpResponse.addCookie(accessTokenCookie);

    return ResponseEntity.ok("Token refreshed");
  }

  @PostMapping("/me")
  public ResponseEntity<?> me() {
    Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Map<String, Object> infoMap = jwt.getClaims();

    return ResponseEntity.ok(infoMap);
  }

  private Cookie buildCookie(String name, String value, int maxAge) {
    Cookie cookie = new Cookie(name, value);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setMaxAge(maxAge);
    return cookie;
  }
}
