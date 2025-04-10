package org.dbms.dbmshealthcare.service;

import java.util.List;
import org.dbms.dbmshealthcare.dto.PatientCreateDto;
import org.dbms.dbmshealthcare.dto.PatientUpdateDto;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

  private final PatientRepository patientRepository;

  public PatientService(PatientRepository patientRepository) {
    this.patientRepository = patientRepository;
  }

  // CREATE operation
  public Patient createPatient(PatientCreateDto patientCreateDto) {
    Patient existingPatient = patientRepository.findByPersonalHealthNumber(
        patientCreateDto.personalHealthNumber());
    if (existingPatient != null) {
      return null;
    }

    Patient patient = new Patient(patientCreateDto.name(), patientCreateDto.personalHealthNumber(),
        patientCreateDto.address());

    return patientRepository.save(patient);
  }

  // READ operations
  public List<Patient> getAllPatients() {
    return patientRepository.findAll();
  }

  public Patient getPatientById(String id) {
    return patientRepository.findById(id);
  }

  // UPDATE operation
  public Patient updatePatient(String id, PatientUpdateDto patientUpdateDto) {
    Update updates = new Update();

    String address = patientUpdateDto.address();
    if (address != null) {
      updates.set("address", address);
    }

    return patientRepository.update(id, updates);
  }

  // DELETE operation
  public void deletePatient(String id) {
    patientRepository.delete(id);
  }
} 