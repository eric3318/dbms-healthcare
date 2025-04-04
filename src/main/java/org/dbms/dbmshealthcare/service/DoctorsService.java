package org.dbms.dbmshealthcare.service;

import java.util.List;
import org.dbms.dbmshealthcare.dto.DoctorCreateDto;
import org.dbms.dbmshealthcare.dto.DoctorUpdateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.repository.DoctorsRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class DoctorsService {
  
  private final DoctorsRepository doctorsRepository;
  
  public DoctorsService(DoctorsRepository doctorsRepository) {
    this.doctorsRepository = doctorsRepository;
  }
  
  // CREATE operation
  public Doctor createDoctor(DoctorCreateDto doctorCreateDto) {
    Doctor doctor = new Doctor();
    doctor.setUserId(doctorCreateDto.userId());
    doctor.setName(doctorCreateDto.name());
    doctor.setSpecialization(doctorCreateDto.specialization());
    
    return doctorsRepository.save(doctor);
  }
  
  // READ operations
  public List<Doctor> getAllDoctors() {
    return doctorsRepository.findAll();
  }
  
  public Doctor getDoctorById(String id) {
    return doctorsRepository.findById(id);
  }
  
  public Doctor getDoctorByUserId(String userId) {
    return doctorsRepository.findByUserId(userId);
  }
  
  // UPDATE operation
  public Doctor updateDoctor(String id, DoctorUpdateDto doctorUpdateDto) {
    Update update = new Update();
    
    if (doctorUpdateDto.name() != null) {
      update.set("name", doctorUpdateDto.name());
    }
    
    if (doctorUpdateDto.specialization() != null) {
      update.set("specialization", doctorUpdateDto.specialization());
    }
    
    return doctorsRepository.update(id, update);
  }
  
  // DELETE operation
  public Doctor deleteDoctor(String id) {
    return doctorsRepository.delete(id);
  }
}
