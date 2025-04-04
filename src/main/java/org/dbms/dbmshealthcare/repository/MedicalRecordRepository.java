package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public class MedicalRecordRepository extends BaseMongoRepository<MedicalRecord> {

    public MedicalRecordRepository(MongoTemplate template) {
        super(template, MedicalRecord.class);
    }

    public List<MedicalRecord> findByPatientId(String patientId) {
        Query query = new Query(Criteria.where("patientId").is(patientId));
        return mongoTemplate.find(query, MedicalRecord.class);
    }

    public List<Patient> findByDoctorId(String doctorId) {
        Query query = new Query(Criteria.where("doctorId").is(doctorId));
        return mongoTemplate.find(query, MedicalRecord.class);
    }
}
