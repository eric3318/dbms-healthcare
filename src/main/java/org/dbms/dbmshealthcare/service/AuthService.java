package org.dbms.dbmshealthcare.service;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import java.sql.Date;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.JwtType;
import org.dbms.dbmshealthcare.dto.IdentityCheckDto;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.repository.DoctorRepository;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.dbms.dbmshealthcare.utils.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserService userService;
  private final UserRepository userRepository;
  private final PatientRepository patientRepository;
  private final DoctorRepository doctorRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;

  public User register(String identity, String roleId, UserCreateDto userCreateDto) {
    return userRepository.createUser(identity, roleId, userCreateDto);
  }

  public String verifyIdentity(IdentityCheckDto identityCheckDto) {
    String licenseNumber = identityCheckDto.licenseNumber();
    String personalHealthNumber = identityCheckDto.personalHealthNumber();
    String name = identityCheckDto.name();

    if (licenseNumber != null) {
      Doctor doctor = doctorRepository.findByLicenseNumber(licenseNumber);
      if (doctor != null && name.equals(doctor.getName())) {
        return doctor.getId();
      }
    } else if (personalHealthNumber != null) {
      Patient patient = patientRepository.findByPersonalHealthNumber(personalHealthNumber);
      if (patient != null && name.equals(patient.getName())) {
        return patient.getId();
      }
    }

    return null;
  }

  public TokenPair login(String email, String password, boolean rememberMe) throws Exception {
    User user = userService.loadUserByUsername(email);
    String hashedPassword = user.getPassword();

    if (!passwordEncoder.matches(password, hashedPassword)) {
      throw new RuntimeException("Invalid credentials");
    }

    Map<String, Object> claims = Map.of(
        "roles", user.getRoles(),
        "profile", Map.of(
            "id", user.getId(),
            "role_id", user.getRoleId(),
            "name", user.getName(),
            "date_of_birth", user.getDateOfBirth().toString()
        )
    );

    TokenPair tokens = jwtUtils.generateToken(email, claims, rememberMe);

    String jti = tokens.jti();

    userService.updateUser(user.getId(), jti);

    return tokens;
  }

  public JWT refreshToken(String refreshToken) {
    try {
      JWT jwt = jwtUtils.decodeToken(refreshToken);
      JWTClaimsSet claimsSet = jwt.getJWTClaimsSet();

      String jwtIdClaim = claimsSet.getJWTID();

      String email = claimsSet.getSubject();

      verifyJwtId(jwtIdClaim, email);

      Map<String, Object> claims = Map.of(
          "roles", claimsSet.getListClaim("roles"),
          "profile", claimsSet.getJSONObjectClaim("profile"));

      JWT accessToken = jwtUtils.generateToken(email, claims,
          Date.from(Instant.now().plusSeconds(5 * 60)), JwtType.ACCESS);

      return accessToken;
    } catch (Exception e) {
      throw new RuntimeException("Error refreshing token");
    }
  }

  private void verifyJwtId(String jwtId, String email) {
    User user = userService.loadUserByUsername(email);

    String jti = user.getJwtId();

    if (!jwtId.equals(jti)) {
      throw new RuntimeException("Invalidated refresh token present");
    }
  }

}
