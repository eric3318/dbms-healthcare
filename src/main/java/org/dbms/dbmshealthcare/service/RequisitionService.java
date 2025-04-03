package org.dbms.dbmshealthcare.service;

import java.time.Instant;
import java.util.List;
import org.dbms.dbmshealthcare.constants.RequisitionStatus;
import org.dbms.dbmshealthcare.dto.RequisitionCreateDto;
import org.dbms.dbmshealthcare.dto.RequisitionResultDto;
import org.dbms.dbmshealthcare.dto.RequisitionUpdateDto;
import org.dbms.dbmshealthcare.model.Requisition;
import org.dbms.dbmshealthcare.model.pojo.RequisitionResult;
import org.dbms.dbmshealthcare.repository.RequisitionRepository;
import org.springframework.stereotype.Service;

@Service
public class RequisitionService {
  
  private final RequisitionRepository requisitionRepository;
  
  public RequisitionService(RequisitionRepository requisitionRepository) {
    this.requisitionRepository = requisitionRepository;
  }
  
  // CREATE operation
  public Requisition createRequisition(RequisitionCreateDto requisitionCreateDto) {
    Requisition requisition = new Requisition();
    requisition.setMedicalRecordId(requisitionCreateDto.medicalRecordId());
    requisition.setTestName(requisitionCreateDto.testName());
    requisition.setStatus(RequisitionStatus.PENDING);
    
    return requisitionRepository.save(requisition);
  }
  
  // READ operations
  public List<Requisition> getAllRequisitions() {
    return requisitionRepository.findAll();
  }
  
  public Requisition getRequisitionById(String id) {
    return requisitionRepository.findById(id).orElse(null);
  }
  
  public List<Requisition> getRequisitionsByMedicalRecordId(String medicalRecordId) {
    return requisitionRepository.findByMedicalRecordId(medicalRecordId);
  }
  
  public List<Requisition> getRequisitionsByStatus(RequisitionStatus status) {
    return requisitionRepository.findByStatus(status);
  }
  
  public List<Requisition> getRequisitionsByMedicalRecordIdAndStatus(String medicalRecordId, RequisitionStatus status) {
    return requisitionRepository.findByMedicalRecordIdAndStatus(medicalRecordId, status);
  }
  
  // UPDATE operations
  public Requisition updateRequisitionStatus(String id, RequisitionUpdateDto requisitionUpdateDto) {
    Requisition existingRequisition = requisitionRepository.findById(id).orElse(null);
    if (existingRequisition == null) {
      return null;
    }
    
    existingRequisition.setStatus(requisitionUpdateDto.status());
    
    return requisitionRepository.save(existingRequisition);
  }
  
  public Requisition submitRequisitionResult(String id, RequisitionResultDto resultDto) {
    Requisition existingRequisition = requisitionRepository.findById(id).orElse(null);
    if (existingRequisition == null) {
      return null;
    }
    
    // Create and set the result
    RequisitionResult result = new RequisitionResult(
        resultDto.description(),
        resultDto.conclusion(),
        Instant.now()
    );
    
    existingRequisition.setResult(result);
    existingRequisition.setStatus(RequisitionStatus.COMPLETED);
    
    return requisitionRepository.save(existingRequisition);
  }
  
  // DELETE operation
  public void deleteRequisition(String id) {
    requisitionRepository.deleteById(id);
  }
} 