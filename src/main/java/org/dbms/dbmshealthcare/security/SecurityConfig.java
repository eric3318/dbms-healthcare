package org.dbms.dbmshealthcare.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  @Order(1)
  public SecurityFilterChain protectedSecurityFilterChain(HttpSecurity http,
      JwtDecoder jwtDecoder)
      throws Exception {
    http
        .securityMatcher(new OrRequestMatcher(
            new AntPathRequestMatcher("/api/**"), // comment out when inserting data
            new AntPathRequestMatcher("/auth/me")
        ))
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(
            auth ->
                auth.anyRequest().authenticated()
        )
        .oauth2ResourceServer((oauth2) -> oauth2.jwt(
            jwt -> jwt.decoder(jwtDecoder).jwtAuthenticationConverter(new MyJwtAuthenticationConverter())
        ))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(ex -> {
          ex.authenticationEntryPoint(new CustomAuthEntryPoint());
          ex.accessDeniedHandler(new BearerTokenAccessDeniedHandler());
        })
        .addFilterBefore(JwtFilterFactory.create("access_token"), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  @Order(2)
  public SecurityFilterChain refreshTokenSecurityFilterChain(HttpSecurity http,
      JwtDecoder jwtDecoder)
      throws Exception {
    http
        .securityMatcher("/auth/refresh")
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(
            auth ->
                auth.anyRequest().authenticated()
        )
        .oauth2ResourceServer((oauth2) -> oauth2.jwt(
            jwt -> jwt.decoder(jwtDecoder).jwtAuthenticationConverter(new MyJwtAuthenticationConverter())
        ))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(ex -> {
          ex.authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint());
          ex.accessDeniedHandler(new BearerTokenAccessDeniedHandler());
        })
        .addFilterBefore(JwtFilterFactory.create("refresh_token"), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  @Order(3)
  public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(
            auth ->
                auth.anyRequest().permitAll())
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(ex -> ex
            .authenticationEntryPoint((request, response, authException) ->
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage()))
        );
    return http.build();
  }

  /* Not needed because JwtFilter is no longer a bean so it won't automatically register*/
//  @Bean
//  public FilterRegistrationBean<JwtFilter> accessTokenFilterRegistration(JwtFilter jwtFilter) {
//    FilterRegistrationBean<JwtFilter> registration = new FilterRegistrationBean<>(
//        jwtFilter);
//    registration.setEnabled(false);
//    return registration;
//  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  // warning: the public and private key are both stored as JWK in the file system and retrieved
  // in production the private key should be securely stored
  @Bean
  public RSAKey jwk() throws IOException, ParseException {
    JWKSet jwkSet = JWKSet.load(new File("src/main/resources/keys/jwks.json"));
    JWK jwk = jwkSet.getKeys().get(0);
    return jwk.toRSAKey();
  }

  @Bean
  public JwtDecoder jwtDecoder(RSAKey rsaKey) throws JOSEException {
    return NimbusJwtDecoder
        .withPublicKey(rsaKey.toRSAPublicKey()).build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

}
