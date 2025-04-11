package org.dbms.dbmshealthcare.repository;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.dto.UserCreateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.User;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class UserRepository extends BaseMongoRepository<User> {

  private final PatientRepository patientRepository;
  private final DoctorsRepository doctorRepository;
  private final PasswordEncoder passwordEncoder;

  public UserRepository(MongoTemplateResolver mongoTemplateResolver, PatientRepository patientRepository,
      DoctorsRepository doctorsRepository, PasswordEncoder passwordEncoder) {
    super(mongoTemplateResolver, User.class);
    this.doctorRepository = doctorsRepository;
    this.patientRepository = patientRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User findByEmail(String email) {
    return getMongoTemplate().findOne(Query.query(Criteria.where("email").is(email)), User.class);
  }

  @Transactional
  public User createUser(String identity, String roleId, UserCreateDto userCreateDto) {
    String name = "";
    List<Role> roles = new ArrayList<>();

    if (identity.equals("doctor")) {
      Doctor doctor = doctorRepository.findById(roleId);
      if (doctor == null) {
        throw new RuntimeException("Doctor not found");
      }
      name = doctor.getName();
      roles.add(Role.DOCTOR);

    } else if (identity.equals("patient")) {
      Patient patient = patientRepository.findById(roleId);
      if (patient == null) {
        throw new RuntimeException("Patient not found");
      }
      name = patient.getName();
      roles.add(Role.PATIENT);
    }

    User user = new User(
        roleId,
        name,
        userCreateDto.email(),
        passwordEncoder.encode(userCreateDto.password()),
        userCreateDto.dateOfBirth(),
        userCreateDto.phoneNumber(),
        roles
    );

    save(user);

    Update update = new Update().set("userId", user.getId());
    Criteria condition = Criteria.where("userId").exists(false);

    if (identity.equals("doctor")) {
      Doctor updatedDoctor = doctorRepository.update(roleId, condition, update);
      if (updatedDoctor == null) {
        throw new RuntimeException("Doctor already linked to a user or not found");
      }
    } else if (identity.equals("patient")) {
      Patient updatedPatient = patientRepository.update(roleId, condition, update);
      if (updatedPatient == null) {
        throw new RuntimeException("Patient already linked to a user or not found");
      }
    }

    return user;
  }

}