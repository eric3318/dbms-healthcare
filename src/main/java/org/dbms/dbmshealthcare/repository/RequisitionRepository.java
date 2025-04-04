package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.constants.RequisitionStatus;
import org.dbms.dbmshealthcare.model.Requisition;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class RequisitionRepository extends BaseMongoRepository<Requisition> {

    public RequisitionRepository(MongoTemplate template) {
        super(template, Requisition.class);
    }

    public List<Requisition> findByMedicalRecordId(String medicalRecordId) {
        Query query = new Query(Criteria.where("medicalRecordId").is(medicalRecordId));
        return mongoTemplate.find(query, Requisition.class);
    }

    public List<Requisition> findByStatus(RequisitionStatus status) {
        Query query = new Query(Criteria.where("status").is(status));
        return mongoTemplate.find(query, Requisition.class);
    }

    public List<Requisition> findByMedicalRecordIdAndStatus(String medicalRecordId, RequisitionStatus status) {
        Query query = new Query(Criteria.where("medicalRecordId").is(medicalRecordId)
                .and("status").is(status));
        return mongoTemplate.find(query, Requisition.class);
    }
}