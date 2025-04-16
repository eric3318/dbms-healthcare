package org.dbms.dbmshealthcare.utils;

import java.util.List;
import java.util.Map;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.pojo.AuthenticatedUserInfo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class AuthUtils {

  public static AuthenticatedUserInfo getAuthenticatedUserInfo() {
    Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Map<String, Object> claims = jwt.getClaims();

    Map<String, Object> profileClaim = (Map<String, Object>) claims.get("profile");
    String roleClaim = ((List<String>) claims.get("roles")).get(0);

    Role role = null;

    switch (roleClaim) {
      case "PATIENT":
        role = Role.PATIENT;
        break;
      case "ADMIN":
        role = Role.ADMIN;
        break;
      case "DOCTOR":
        role = Role.DOCTOR;
        break;
      case "GUEST":
        role = Role.GUEST;
        break;
    }

    return new AuthenticatedUserInfo((String) profileClaim.get("id"), role, (String) profileClaim.get("role_id"));
  }
}
