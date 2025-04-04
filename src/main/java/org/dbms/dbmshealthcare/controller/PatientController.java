package org.dbms.dbmshealthcare.controller;

import java.util.List;
import org.dbms.dbmshealthcare.dto.PatientCreateDto;
import org.dbms.dbmshealthcare.dto.PatientUpdateDto;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patient Controller", description = "API endpoints for managing patients")
public class PatientController {

  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @Operation(summary = "Create a new patient", description = "Creates a new patient record in the system based on the provided data")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Patient createPatient(@RequestBody PatientCreateDto patientCreateDto) {
    return patientService.createPatient(patientCreateDto);
  }

  @Operation(summary = "Get all patients", description = "Retrieves a list of all patients in the system")
  @GetMapping
  public List<Patient> getAllPatients() {
    return patientService.getAllPatients();
  }

  @Operation(summary = "Get patient by ID", description = "Retrieves a specific patient by their unique identifier")
  @GetMapping("/{id}")
  public Patient getPatientById(@PathVariable String id) {
    return patientService.getPatientById(id);
  }

  @Operation(summary = "Update patient information", description = "Updates an existing patient's information based on the provided data")
  @PutMapping("/{id}")
  public Patient updatePatient(@PathVariable String id, @RequestBody PatientUpdateDto patientUpdateDto) {
    return patientService.updatePatient(id, patientUpdateDto);
  }

  @Operation(summary = "Delete patient", description = "Removes a patient record from the system by their ID")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletePatient(@PathVariable String id) {
    patientService.deletePatient(id);
  }
} 