package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.model.Patient;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends BaseMongoRepository<Patient, String> {
    
    List<Patient> findByUserId(String userId);
    
    List<Patient> findByDoctorId(String doctorId);
    
    @Query("{'personalHealthNumber': ?0}")
    Patient findByPersonalHealthNumber(String personalHealthNumber);
} 