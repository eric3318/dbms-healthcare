package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.model.Doctor;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class DoctorRepository extends BaseMongoRepository<Doctor> {

  public DoctorRepository(MongoTemplateResolver mongoTemplateResolver) {
    super(mongoTemplateResolver, Doctor.class);
  }

  public Doctor findByUserId(String userId) {
    return getMongoTemplate().findOne(Query.query(Criteria.where("user_id").is(userId)), Doctor.class);
  }

  public Doctor findByLicenseNumber(String licenseNumber) {
    return getMongoTemplate().findOne(Query.query(Criteria.where("license_number").is(licenseNumber)),
        Doctor.class);
  }

} 