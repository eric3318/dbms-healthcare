package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByMedicalRecordId(String medicalRecordId);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByMedicalRecordIdAndStatus(String medicalRecordId, PaymentStatus status);
}
