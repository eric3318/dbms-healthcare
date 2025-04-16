package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.UserUpdateDto;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

  public void updateUser(String id, UserUpdateDto userUpdateDto) {
    Update updates = new Update();

    if (userUpdateDto.jwtId() != null) {
      updates.set("jwt_id", userUpdateDto.jwtId());
    }

    if (userUpdateDto.roles() != null) {
      updates.set("roles", userUpdateDto.roles());
    }

    if (userUpdateDto.name() != null) {
      updates.set("name", userUpdateDto.name());
    }

    if (userUpdateDto.phoneNumber() != null) {
      updates.set("phone_number", userUpdateDto.phoneNumber());
    }
    
    if (userUpdateDto.dateOfBirth() != null) {
      updates.set("date_of_birth", userUpdateDto.dateOfBirth());
    }

    User updatedUser = userRepository.update(id, updates);

    if (updatedUser == null) {
      throw new RuntimeException("User not updated");
    }
  }


  public void deleteUser(String id) {
    User deletedUser = userRepository.delete(id);

    if (deletedUser == null) {
      throw new RuntimeException("User not deleted");
    }
  }

}
