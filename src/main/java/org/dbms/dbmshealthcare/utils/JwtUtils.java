package org.dbms.dbmshealthcare.utils;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.security.interfaces.RSAPrivateKey;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.JwtType;
import org.dbms.dbmshealthcare.model.pojo.TokenPair;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtUtils {

  private final RSAKey rsaKey;

  public TokenPair generateToken(String sub, Map<String, Object> claims, boolean rememberMe)
      throws Exception {
    Date accessTokenExpiration = Date.from(Instant.now().plusSeconds(5 * 60));

    Date refreshTokenExpiration;

    if (rememberMe) {
      refreshTokenExpiration = Date.from(Instant.now().plusSeconds(15 * 24 * 60 * 60));
    } else {
      refreshTokenExpiration = Date.from(Instant.now().plusSeconds(24 * 60 * 60));
    }

    String accessToken = generateToken(sub, claims, accessTokenExpiration, JwtType.ACCESS);
    String refreshToken = generateToken(sub, claims, refreshTokenExpiration, JwtType.REFRESH);

    return new TokenPair(accessToken, refreshToken);
  }

  public String generateToken(String sub, Map<String, Object> claims, Date expiration, JwtType type)
      throws Exception {
    RSAPrivateKey privateKey = rsaKey.toRSAPrivateKey();

    JWSSigner signer = new RSASSASigner(privateKey);

    JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder()
        .subject(sub)
        .issuer("dbms-healthcare")
        .audience("dbms-healthcare-web-app")
        .expirationTime(expiration)
        .claim("type", type);

    claims.forEach((key, value) -> builder.claim(key, value));

    if (JwtType.REFRESH.equals(type)) {
      builder.claim("jti", UUID.randomUUID().toString());
    }

    JWTClaimsSet claimsSet = builder.build();

    SignedJWT jwt = new SignedJWT(new JWSHeader.Builder(
        JWSAlgorithm.RS256
    ).keyID(rsaKey.getKeyID()).build(), claimsSet);

    jwt.sign(signer);

    return jwt.serialize();
  }

  public JWT decodeToken(String token) throws ParseException {
    SignedJWT signedJWT = SignedJWT.parse(token);
    return signedJWT;
  }
}
