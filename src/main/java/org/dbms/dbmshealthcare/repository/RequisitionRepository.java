package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.constants.RequisitionStatus;
import org.dbms.dbmshealthcare.model.Requisition;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class RequisitionRepository extends BaseMongoRepository<Requisition> {

    public RequisitionRepository(MongoTemplateResolver mongoTemplateResolver) {
        super(mongoTemplateResolver, Requisition.class);
    }

    public List<Requisition> findByMedicalRecordId(String medicalRecordId) {
        Query query = new Query(Criteria.where("medicalRecordId").is(medicalRecordId));
        return getMongoTemplate().find(query, Requisition.class);
    }

    public List<Requisition> findByStatus(RequisitionStatus status) {
        Query query = new Query(Criteria.where("status").is(status));
        return getMongoTemplate().find(query, Requisition.class);
    }

    public List<Requisition> findByMedicalRecordIdAndStatus(String medicalRecordId, RequisitionStatus status) {
        Query query = new Query(Criteria.where("medicalRecordId").is(medicalRecordId)
                .and("status").is(status));
        return getMongoTemplate().find(query, Requisition.class);
    }
}