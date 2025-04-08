package org.dbms.dbmshealthcare.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

public class CustomAuthEntryPoint implements AuthenticationEntryPoint {

  private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException authException) throws IOException, ServletException {
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    Optional<Cookie> tokenCookie = Optional.ofNullable(request.getCookies())
        .flatMap(cookies -> Arrays.stream(cookies)
            .filter(cookie -> REFRESH_TOKEN_COOKIE.equals(cookie.getName()))
            .findFirst());

    if (tokenCookie.isPresent()) {
      response.getWriter().write("""
              {
                "status": "unauthorized",
                "code": 1
              }
          """);
    } else {
      response.getWriter().write("""
              {
                "status": "unauthorized",
                "code": 0
              }
          """);
    }
  }
}
