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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/requisitions")
@Tag(name = "Requisition Controller", description = "API endpoints for managing requisitions")
public class RequisitionController {

  private final RequisitionService requisitionService;

  public RequisitionController(RequisitionService requisitionService) {
    this.requisitionService = requisitionService;
  }

  @Operation(summary = "Create a new requisition", description = "Creates a new requisition in the system based on the provided data")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Requisition createRequisition(@RequestBody RequisitionCreateDto requisitionCreateDto) {
    return requisitionService.createRequisition(requisitionCreateDto);
  }

  @Operation(summary = "Get all requisitions", description = "Retrieves all requisitions with optional filtering by medical record ID and/or status")
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

  @Operation(summary = "Get requisition by ID", description = "Retrieves a specific requisition by its unique identifier")
  @GetMapping("/{id}")
  public Requisition getRequisitionById(@PathVariable String id) {
    return requisitionService.getRequisitionById(id);
  }

  @Operation(summary = "Delete requisition", description = "Removes a requisition from the system by its ID")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRequisition(@PathVariable String id) {
    requisitionService.deleteRequisition(id);
  }
  @Operation(summary = "Get requisitions by user ID", description = "Retrieves all requisitions for a given user via patient -> medicalRecord -> requisition chain")
  @GetMapping("/by-user/{userId}")
  public List<Requisition> getRequisitionsByUserId(@PathVariable String userId) {
    return requisitionService.getRequisitionsByUserId(userId);
  }
} 