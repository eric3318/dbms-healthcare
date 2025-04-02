package org.dbms.dbmshealthcare.service;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.sql.Date;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.JwtType;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.dbms.dbmshealthcare.utils.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserService userService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;

  public User register(UserCreateDto userCreateDto) {
    // todo: add check if user is doctor or patient from database
    User user = new User();
    user.setName(userCreateDto.name());
    user.setEmail(userCreateDto.email());
    user.setPassword(passwordEncoder.encode(userCreateDto.password()));
    user.setDateOfBirth(userCreateDto.dateOfBirth());
    user.setPhoneNumber(userCreateDto.phoneNumber());
    user.setRoles(List.of(Role.PATIENT));
    return userRepository.save(user);
  }

  public TokenPair login(String email, String password, boolean rememberMe) throws Exception {
    User user = userService.getUserByEmail(email);
    String hashedPassword = user.getPassword();

    if (!passwordEncoder.matches(password, hashedPassword)) {
      throw new RuntimeException("Invalid credentials");
    }

    List<Role> roles = user.getRoles();

    TokenPair tokens = jwtUtils.generateToken(email, roles, rememberMe);

    return tokens;
  }

  public String refreshToken(String refreshToken) {
    try {
      JWT jwt = jwtUtils.decodeToken(refreshToken);
      JWTClaimsSet claimsSet = jwt.getJWTClaimsSet();

      List<Object> rolesClaim = claimsSet.getListClaim("roles");

      List<Role> roles = rolesClaim.stream().map(role -> Role.valueOf((String) role)).toList();

      String email = claimsSet.getSubject();

      String accessToken = jwtUtils.generateToken(email, roles,
          Date.from(Instant.now().plusSeconds(5 * 60)), JwtType.ACCESS);

      return accessToken;
    } catch (Exception e) {
      throw new RuntimeException("Error refreshing token");
    }
  }

}
