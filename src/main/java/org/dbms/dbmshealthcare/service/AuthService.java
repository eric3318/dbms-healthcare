package org.dbms.dbmshealthcare.service;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import java.sql.Date;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.TestIdentityCheckDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.dbms.dbmshealthcare.constants.JwtType;
import org.dbms.dbmshealthcare.dto.IdentityCheckDto;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.dto.UserUpdateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.repository.DoctorRepository;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.dbms.dbmshealthcare.utils.JwtUtils;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

  private final UserService userService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;

  public User register(UserCreateDto userCreateDto) {
    User user = new User(
        userCreateDto.name(),
        userCreateDto.email(),
        passwordEncoder.encode(userCreateDto.password()),
        userCreateDto.dateOfBirth(),
        userCreateDto.phoneNumber()
    );
    return userRepository.save(user);
  }

  public void verifyIdentity(String userId, IdentityCheckDto identityCheckDto) {
    userRepository.authorize(userId, identityCheckDto);
  }

  public void verifyIdentity(TestIdentityCheckDto identityCheckDto) {
    userRepository.authorize(identityCheckDto.userId(), identityCheckDto.roleId(),
        identityCheckDto.role());
  }

  public TokenPair login(String email, String password, boolean rememberMe) throws Exception {
    User user = userService.loadUserByUsername(email);
    String hashedPassword = user.getPassword();

    if (!passwordEncoder.matches(password, hashedPassword)) {
      throw new RuntimeException("Invalid credentials");
    }

    String roleId = user.getRoleId();
    String name = user.getName();

    Map<String, Object> claims = Map.of(
        "roles", user.getRoles(),
        "profile", Map.of(
            "id", user.getId(),
            "role_id", roleId == null ? "" : roleId,
            "name", name == null ? "" : name,
            "date_of_birth", user.getDateOfBirth().toString()
        )
    );

    TokenPair tokens = jwtUtils.generateToken(email, claims, rememberMe);

    String jti = tokens.jti();

    Update update = new Update().set("jwt_id", jti);

    userRepository.update(user.getId(), update);

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
