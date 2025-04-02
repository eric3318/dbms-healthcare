package org.dbms.dbmshealthcare.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.dbms.dbmshealthcare.constants.JwtType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class MyJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  @Override
  public AbstractAuthenticationToken convert(Jwt source) {
    return new JwtAuthenticationToken(source, extractResourceRoles(source));
  }

  private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
    List<String> roleClaims = jwt.getClaimAsStringList("roles");
    String typeClaim = jwt.getClaimAsString("type");

    JwtType tokenType = JwtType.valueOf(typeClaim);

    List<SimpleGrantedAuthority> authorities = new ArrayList<>();

    roleClaims.forEach(r -> {
      authorities.add(new SimpleGrantedAuthority("ROLE_" + r));
    });

    authorities.add(new SimpleGrantedAuthority("ROLE_" + tokenType + "_token"));

    return authorities;
  }
}
