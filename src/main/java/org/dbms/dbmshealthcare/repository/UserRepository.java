package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.dto.IdentityCheckDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.User;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.dbms.dbmshealthcare.constants.Role;

@Repository
public class UserRepository extends BaseMongoRepository<User> {

  private final PatientRepository patientRepository;
  private final DoctorRepository doctorRepository;

  public UserRepository(MongoTemplateResolver mongoTemplateResolver,
      PatientRepository patientRepository,
      DoctorRepository doctorRepository) {
    super(mongoTemplateResolver, User.class);
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
  }

  public User findByEmail(String email) {
    return getMongoTemplate().findOne(Query.query(Criteria.where("email").is(email)), User.class);
  }

  @Transactional
  public void authorize(String userId, IdentityCheckDto identityCheckDto){
    String name = identityCheckDto.name();
    String licenseNumber = identityCheckDto.licenseNumber();
    String personalHealthNumber = identityCheckDto.personalHealthNumber();
    String roleId = null;

    Update updates = new Update().set("user_id", userId);
    Update userUpdates = new Update().set("name", name);

    if (licenseNumber != null) {
      Doctor doctor = doctorRepository.findByLicenseNumber(licenseNumber);
      if (doctor != null && name.equals(doctor.getName()) && doctor.getUserId() == null) {
        roleId = doctor.getId();
        userUpdates.set("roles", List.of(Role.DOCTOR));
        doctorRepository.update(doctor.getId(), updates);
      }
    } else if (personalHealthNumber != null) {
      Patient patient = patientRepository.findByPersonalHealthNumber(personalHealthNumber);
      if (patient != null && name.equals(patient.getName()) && patient.getUserId() == null) {
        roleId = patient.getId();
        userUpdates.set("roles", List.of(Role.PATIENT));
        patientRepository.update(patient.getId(), updates);
      }
    }

    if (roleId == null) {
      throw new RuntimeException("Claimed identity not found");
    }

    userUpdates.set("role_id", roleId);

    User user = super.update(userId, userUpdates);

    if (user == null) {
      throw new RuntimeException("User not updated");
    }
  }

  @Transactional
  public void authorize(String userId, String roleId, Role role){
    Update updates = new Update().set("user_id", userId);
    Update userUpdates = new Update().set("role_id", roleId);

    if (role.equals(Role.DOCTOR)){
      Doctor doctor = doctorRepository.findById(roleId);
      userUpdates.set("name", doctor.getName()).set("roles", List.of(Role.DOCTOR));
      doctorRepository.update(roleId,updates);
    }

    if (role.equals(Role.PATIENT)){
      Patient patient = patientRepository.findById(roleId);
      userUpdates.set("name", patient.getName()).set("roles", List.of(Role.PATIENT));
      patientRepository.update(roleId,updates);
    }

    User user = super.update(userId, userUpdates);

    if (user == null) {
      throw new RuntimeException("User not updated");
    }
  }
}
