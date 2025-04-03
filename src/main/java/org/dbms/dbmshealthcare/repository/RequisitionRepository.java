package org.dbms.dbmshealthcare.repository;

import java.util.List;
import org.dbms.dbmshealthcare.constants.RequisitionStatus;
import org.dbms.dbmshealthcare.model.Requisition;
import org.springframework.stereotype.Repository;

@Repository
public interface RequisitionRepository extends BaseMongoRepository<Requisition, String> {
    
    List<Requisition> findByMedicalRecordId(String medicalRecordId);
    
    List<Requisition> findByStatus(RequisitionStatus status);
    
    List<Requisition> findByMedicalRecordIdAndStatus(String medicalRecordId, RequisitionStatus status);
} 