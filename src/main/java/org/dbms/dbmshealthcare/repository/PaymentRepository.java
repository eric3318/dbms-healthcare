package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class PaymentRepository extends BaseMongoRepository<Payment> {

    public PaymentRepository(MongoTemplateResolver mongoTemplateResolver) {
        super(mongoTemplateResolver, Payment.class);
    }

    public List<Payment> findByMedicalRecordId(String medicalRecordId) {
        return getMongoTemplate().find(Query.query(Criteria.where("medicalRecordId").is(medicalRecordId)), Payment.class);
    }
}