package org.dbms.dbmshealthcare.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.AppointmentFilter;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentService appointmentService;

  @GetMapping
  public ResponseEntity<List<Appointment>> getAppointments(
      @RequestParam(required = false) AppointmentFilter filter) {
    List<Appointment> appointments = appointmentService.getAppointments(filter);
    return ResponseEntity.ok(appointments);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getAppointmentById(@PathVariable String id) {
    Appointment appointment = appointmentService.getAppointmentById(id);
    return appointment != null ? ResponseEntity.ok(appointment) :
        ResponseEntity.notFound().build();
  }

  @PostMapping
  public ResponseEntity<Appointment> createAppointment(
      @RequestBody Appointment appointmentCreateDto) {
    Appointment createdAppointment = appointmentService.createAppointment(appointmentCreateDto);
    return ResponseEntity.ok(createdAppointment);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateAppointment(@PathVariable String id,
      AppointmentUpdateDto appointmentUpdateDto) {
    appointmentService.updateAppointment(id, appointmentUpdateDto);
    return ResponseEntity.ok("Appointment updated successfully");
  }

}
