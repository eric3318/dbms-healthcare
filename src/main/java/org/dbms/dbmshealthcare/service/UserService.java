package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.dbms.dbmshealthcare.utils.JwtUtils;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public User loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email);

    if (user == null) {
      throw new UsernameNotFoundException("User not found with email: " + email);
    }

    return user;
  }

  public User getUserById(String id) {
    return userRepository.findById(id);
  }

  public List<User> getUsers() {
    return userRepository.findAll();
  }

  public void updateUser(String id, String jti) {
    Update updates = new Update();

    updates.set("jwt_id", jti);

    userRepository.update(id, updates);
  }


  public void deleteUser() {

  }

}
