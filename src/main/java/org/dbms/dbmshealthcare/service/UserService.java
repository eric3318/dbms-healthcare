package org.dbms.dbmshealthcare.service;

import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.dbms.dbmshealthcare.utils.JwtUtils;
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
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    UserDetails user = userRepository.findByEmail(email);

    if (user == null) {
      throw new UsernameNotFoundException("User not found with email: " + email);
    }

    return user;
  }

  public User getUserByEmail(String email) {
    return(User) loadUserByUsername(email);
  }

  public User getUserById(String id) {
    return userRepository.findById(id);
  }

  public void updateUser() {

  }


  public void deleteUser() {

  }

}
