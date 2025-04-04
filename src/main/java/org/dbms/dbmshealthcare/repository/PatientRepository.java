package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.model.Patient;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class PatientRepository extends BaseMongoRepository<Patient> {

    public PatientRepository(MongoTemplate template) {
        super(template, Patient.class);
    }

    public List<Patient> findByUserId(String userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        return mongoTemplate.find(query, Patient.class);
    }

    public List<Patient> findByDoctorId(String doctorId) {
        Query query = new Query(Criteria.where("doctorId").is(doctorId));
        return mongoTemplate.find(query, Patient.class);
    }

    public Patient findByPersonalHealthNumber(String personalHealthNumber) {
        Query query = new Query(Criteria.where("personalHealthNumber").is(personalHealthNumber));
        return mongoTemplate.findOne(query, Patient.class);
    }
}