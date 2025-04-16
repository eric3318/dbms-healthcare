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

    // ✅ 添加这个方法，支持 List ID 查询
    public List<Requisition> findByMedicalRecordIdIn(List<String> medicalRecordIds) {
        System.out.println("Searching for requisitions with medicalRecordIds: " + String.join(", ", medicalRecordIds));
        
        // Debug: List all requisitions in the system to check what's actually there
        try {
            System.out.println("DEBUG: Listing all requisitions in database:");
            List<Requisition> allReqs = getMongoTemplate().findAll(Requisition.class);
            for (Requisition req : allReqs) {
                System.out.println("Found requisition: id=" + req.getId() + 
                                   ", medicalRecordId=" + req.getMedicalRecordId() +
                                   ", testName=" + req.getTestName() +
                                   ", status=" + req.getStatus() + 
                                   ", field type=" + (req.getMedicalRecordId() != null ? req.getMedicalRecordId().getClass().getName() : "null"));
            }
            
            if (allReqs.isEmpty()) {
                System.out.println("DEBUG: No requisitions found in the database at all!");
            }
        } catch (Exception e) {
            System.out.println("DEBUG: Error listing all requisitions: " + e.getMessage());
            e.printStackTrace();
        }
        
        try {
            System.out.println("Creating MongoDB query for field 'medicalRecordId' with values: " + medicalRecordIds);
            Query query = new Query(Criteria.where("medicalRecordId").in(medicalRecordIds));
            List<Requisition> results = getMongoTemplate().find(query, Requisition.class);
            System.out.println("Query with field 'medicalRecordId' returned " + (results != null ? results.size() : 0) + " results");
            
            if (results != null && !results.isEmpty()) {
                return results;
            }
        } catch (Exception e) {
            System.out.println("Error querying with field 'medicalRecordId': " + e.getMessage());
            e.printStackTrace();
        }
        
        // Also try alternative field name just in case
        if (medicalRecordIds != null && !medicalRecordIds.isEmpty()) {
            try {
                System.out.println("Creating MongoDB query for field 'medical_record_id' with values: " + medicalRecordIds);
                Query altQuery = new Query(Criteria.where("medical_record_id").in(medicalRecordIds));
                List<Requisition> altResults = getMongoTemplate().find(altQuery, Requisition.class);
                System.out.println("Query with field 'medical_record_id' returned " + (altResults != null ? altResults.size() : 0) + " results");
                
                if (altResults != null && !altResults.isEmpty()) {
                    System.out.println("Found requisitions using alternate field name 'medical_record_id': " + altResults.size());
                    return altResults;
                }
            } catch (Exception e) {
                System.out.println("Error trying alternate field name: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        System.out.println("No requisitions found using either field name. Returning empty list.");
        return List.of();
    }
}