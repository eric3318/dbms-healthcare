package org.dbms.dbmshealthcare.controller;

import java.util.List;
import org.dbms.dbmshealthcare.dto.DoctorCreateDto;
import org.dbms.dbmshealthcare.dto.DoctorUpdateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.service.DoctorsService;
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
import java.util.Map;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/doctors")
public class DoctorsController {

  private final DoctorsService doctorsService;

  public DoctorsController(DoctorsService doctorsService) {
    this.doctorsService = doctorsService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Doctor createDoctor(@RequestBody DoctorCreateDto doctorCreateDto) {
    return doctorsService.createDoctor(doctorCreateDto);
  }

  @GetMapping
  public List<Doctor> getAllDoctors() {
    return doctorsService.getAllDoctors();
  }

  @GetMapping("/{id}")
  public Doctor getDoctorById(@PathVariable String id) {
    return doctorsService.getDoctorById(id);
  }

  @GetMapping("/user/{userId}")
  public Doctor getDoctorByUserId(@PathVariable String userId) {
    return doctorsService.getDoctorByUserId(userId);
  }

  @PutMapping("/{id}")
  public Doctor updateDoctor(@PathVariable String id, @RequestBody DoctorUpdateDto doctorUpdateDto) {
    return doctorsService.updateDoctor(id, doctorUpdateDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteDoctor(@PathVariable String id) {
      boolean success = doctorsService.deleteDoctor(id);
      
      if (success) {
          return ResponseEntity.ok().body(Map.of(
              "message", "Doctor and associated slots deleted successfully",
              "doctorId", id
          ));
      } else {
          return ResponseEntity.status(HttpStatus.NOT_FOUND)
              .body(Map.of("message", "Doctor not found or deletion failed"));
      }
  }
}
