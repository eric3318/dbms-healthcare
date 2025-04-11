package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class MedicalRecordRepository extends BaseMongoRepository<MedicalRecord> {

    public MedicalRecordRepository(MongoTemplateResolver mongoTemplateResolver) {
        super(mongoTemplateResolver, MedicalRecord.class);
    }

    public List<MedicalRecord> findByPatientId(String patientId) {
        return getMongoTemplate().find(Query.query(Criteria.where("patientId").is(patientId)), MedicalRecord.class);
    }

    public List<MedicalRecord> findByDoctorId(String doctorId) {
        return getMongoTemplate().find(Query.query(Criteria.where("doctorId").is(doctorId)), MedicalRecord.class);
    }
}
