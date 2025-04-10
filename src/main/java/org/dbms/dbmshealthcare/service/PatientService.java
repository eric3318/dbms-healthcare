package org.dbms.dbmshealthcare.service;

import java.util.List;
import org.dbms.dbmshealthcare.dto.PatientCreateDto;
import org.dbms.dbmshealthcare.dto.PatientUpdateDto;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
  
  private final PatientRepository patientRepository;
  
  public PatientService(PatientRepository patientRepository) {
    this.patientRepository = patientRepository;
  }
  
  // CREATE operation
  public Patient createPatient(PatientCreateDto patientCreateDto) {
//    // Check if PHN already exists
//    Patient existingPatient = patientRepository.findByPersonalHealthNumber(patientCreateDto.personalHealthNumber());
//    if (existingPatient != null) {
//      return null; // PHN already exists
//    }
//
//    Patient patient = new Patient();
//    patient.setPersonalHealthNumber(patientCreateDto.personalHealthNumber());
//    patient.setAddress(patientCreateDto.address());
//    patient.setUserId(patientCreateDto.userId());
//    patient.setDoctorId(patientCreateDto.doctorId());
    
//    return patientRepository.save(patient);
    return null;
  }
  
  // READ operations
  public List<Patient> getAllPatients() {
    return patientRepository.findAll();
  }
  
  public Patient getPatientById(String id) {
    return patientRepository.findById(id);
  }
  
  public List<Patient> getPatientsByDoctorId(String doctorId) {
    return patientRepository.findByDoctorId(doctorId);
  }
  
  public List<Patient> getPatientsByUserId(String userId) {
    return patientRepository.findByUserId(userId);
  }
  
  public Patient getPatientByPersonalHealthNumber(String phn) {
    return patientRepository.findByPersonalHealthNumber(phn);
  }
  
  // UPDATE operation
  public Patient updatePatient(String id, PatientUpdateDto patientUpdateDto) {
    Patient existingPatient = patientRepository.findById(id);
    if (existingPatient == null) {
      return null;
    }
    
    if (patientUpdateDto.address() != null) {
      existingPatient.setAddress(patientUpdateDto.address());
    }
    
    if (patientUpdateDto.doctorId() != null) {
      existingPatient.setDoctorId(patientUpdateDto.doctorId());
    }
    
    return patientRepository.save(existingPatient);
  }
  
  // DELETE operation
  public void deletePatient(String id) {
    patientRepository.delete(id);
  }
} 