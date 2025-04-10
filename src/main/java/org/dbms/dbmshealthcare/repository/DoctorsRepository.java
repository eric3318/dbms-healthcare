package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.model.Doctor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class DoctorsRepository extends BaseMongoRepository<Doctor> {

  public DoctorsRepository(MongoTemplate template) {
    super(template, Doctor.class);
  }

  public Doctor findByUserId(String userId) {
    return mongoTemplate.findOne(Query.query(Criteria.where("user_id").is(userId)), Doctor.class);
  }

  public Doctor findByLicenseNumber(String licenseNumber) {
    return mongoTemplate.findOne(Query.query(Criteria.where("license_number").is(licenseNumber)),
        Doctor.class);
  }


} 