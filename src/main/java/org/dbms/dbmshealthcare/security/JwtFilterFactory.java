package org.dbms.dbmshealthcare.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtFilterFactory {

  public static OncePerRequestFilter create(String cookieName) {
    return new OncePerRequestFilter() {
      @Override
      protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
          FilterChain filterChain) throws ServletException, IOException {
        Optional<Cookie> tokenCookie = Optional.ofNullable(request.getCookies())
            .flatMap(cookies -> Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .findFirst());

        if (tokenCookie.isEmpty()) {
          filterChain.doFilter(request, response);
          return;
        }

        String token = tokenCookie.get().getValue();

        HttpServletRequest wrapper = new HttpServletRequestWrapper(request) {
          @Override
          public String getHeader(String name) {
            if ("Authorization".equalsIgnoreCase(name)) {
              return "Bearer " + token;
            }
            return super.getHeader(name);
          }

          @Override
          public Enumeration<String> getHeaders(String name) {
            if ("Authorization".equalsIgnoreCase(name)) {
              return Collections.enumeration(List.of("Bearer " + token));
            }
            return super.getHeaders(name);
          }

          @Override
          public Enumeration<String> getHeaderNames() {
            List<String> names = Collections.list(super.getHeaderNames());
            if (!names.contains("Authorization")) {
              names.add("Authorization");
            }
            return Collections.enumeration(names);
          }
        };

        filterChain.doFilter(wrapper, response);
      }
    };
  }
}
