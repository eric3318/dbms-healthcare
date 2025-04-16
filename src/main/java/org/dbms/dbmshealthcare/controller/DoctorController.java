package org.dbms.dbmshealthcare.controller;

import java.util.List;
import java.util.Map;
import org.dbms.dbmshealthcare.dto.DoctorCreateDto;
import org.dbms.dbmshealthcare.dto.DoctorUpdateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/doctors")
public class DoctorController {

  private final DoctorService doctorService;

  public DoctorController(DoctorService doctorService) {
    this.doctorService = doctorService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Doctor createDoctor(@RequestBody DoctorCreateDto doctorCreateDto) {
    return doctorService.createDoctor(doctorCreateDto);
  }

  @GetMapping
  public List<Doctor> getAllDoctors() {
    return doctorService.getAllDoctors();
  }

  @GetMapping("/{id}")
  public Doctor getDoctorById(@PathVariable String id) {
    return doctorService.getDoctorById(id);
  }

  @GetMapping("/user/{userId}")
  public Doctor getDoctorByUserId(@PathVariable String userId) {
    return doctorService.getDoctorByUserId(userId);
  }

  @PutMapping("/{id}")
  public Doctor updateDoctor(@PathVariable String id, @RequestBody DoctorUpdateDto doctorUpdateDto) {
    return doctorService.updateDoctor(id, doctorUpdateDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteDoctor(@PathVariable String id) {
      boolean success = doctorService.deleteDoctor(id);
      
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
