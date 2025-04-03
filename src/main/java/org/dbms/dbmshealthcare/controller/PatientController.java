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

@RestController
@RequestMapping("/api/patients")
public class PatientController {

  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Patient createPatient(@RequestBody PatientCreateDto patientCreateDto) {
    return patientService.createPatient(patientCreateDto);
  }

  @GetMapping
  public List<Patient> getAllPatients() {
    return patientService.getAllPatients();
  }

  @GetMapping("/{id}")
  public Patient getPatientById(@PathVariable String id) {
    return patientService.getPatientById(id);
  }

  @GetMapping("/phn/{phn}")
  public Patient getPatientByPhn(@PathVariable String phn) {
    return patientService.getPatientByPersonalHealthNumber(phn);
  }

  @GetMapping("/user/{userId}")
  public List<Patient> getPatientsByUserId(@PathVariable String userId) {
    return patientService.getPatientsByUserId(userId);
  }

  @GetMapping("/doctor/{doctorId}")
  public List<Patient> getPatientsByDoctorId(@PathVariable String doctorId) {
    return patientService.getPatientsByDoctorId(doctorId);
  }

  @PutMapping("/{id}")
  public Patient updatePatient(@PathVariable String id, @RequestBody PatientUpdateDto patientUpdateDto) {
    return patientService.updatePatient(id, patientUpdateDto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletePatient(@PathVariable String id) {
    patientService.deletePatient(id);
  }
} 