package org.dbms.dbmshealthcare.controller;

import java.util.List;
import org.dbms.dbmshealthcare.constants.RequisitionStatus;
import org.dbms.dbmshealthcare.dto.RequisitionCreateDto;
import org.dbms.dbmshealthcare.dto.RequisitionResultDto;
import org.dbms.dbmshealthcare.dto.RequisitionUpdateDto;
import org.dbms.dbmshealthcare.model.Requisition;
import org.dbms.dbmshealthcare.service.RequisitionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requisitions")
public class RequisitionController {

  private final RequisitionService requisitionService;

  public RequisitionController(RequisitionService requisitionService) {
    this.requisitionService = requisitionService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Requisition createRequisition(@RequestBody RequisitionCreateDto requisitionCreateDto) {
    return requisitionService.createRequisition(requisitionCreateDto);
  }

  @GetMapping
  public List<Requisition> getAllRequisitions(
      @RequestParam(required = false) String medicalRecordId,
      @RequestParam(required = false) RequisitionStatus status) {
    
    if (medicalRecordId != null && status != null) {
      return requisitionService.getRequisitionsByMedicalRecordIdAndStatus(medicalRecordId, status);
    } else if (medicalRecordId != null) {
      return requisitionService.getRequisitionsByMedicalRecordId(medicalRecordId);
    } else if (status != null) {
      return requisitionService.getRequisitionsByStatus(status);
    } else {
      return requisitionService.getAllRequisitions();
    }
  }

  @GetMapping("/{id}")
  public Requisition getRequisitionById(@PathVariable String id) {
    return requisitionService.getRequisitionById(id);
  }

  @GetMapping("/medical-record/{medicalRecordId}")
  public List<Requisition> getRequisitionsByMedicalRecord(@PathVariable String medicalRecordId) {
    return requisitionService.getRequisitionsByMedicalRecordId(medicalRecordId);
  }

  @PutMapping("/{id}/status")
  public Requisition updateRequisitionStatus(
      @PathVariable String id,
      @RequestBody RequisitionUpdateDto requisitionUpdateDto) {
    return requisitionService.updateRequisitionStatus(id, requisitionUpdateDto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRequisition(@PathVariable String id) {
    requisitionService.deleteRequisition(id);
  }
} 