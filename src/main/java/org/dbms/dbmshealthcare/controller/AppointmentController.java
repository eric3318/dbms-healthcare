package org.dbms.dbmshealthcare.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.AppointmentCreateDto;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.dto.SlotFilter;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentService appointmentService;

  @GetMapping("/slots")
  public ResponseEntity<List<Slot>> getSlots(
      @RequestParam(required = false) SlotFilter filter) {
    List<Slot> slots = appointmentService.getSlots(filter);
    return ResponseEntity.ok(slots);
  }

  @GetMapping("/slots/{id}")
  public ResponseEntity<Slot> getSlotById(@PathVariable String id) {
    Slot slot = appointmentService.getSlotById(id);
    return slot != null ? ResponseEntity.ok(slot) :
        ResponseEntity.notFound().build();
  }

  @PostMapping("/slots")
  public ResponseEntity<Slot> createSlot(
      @RequestBody Slot slotCreateDto) {
    Slot createdslot = appointmentService.createSlot(slotCreateDto);
    return createdslot != null ? ResponseEntity.ok(createdslot)
        : ResponseEntity.badRequest().build();
  }

  @DeleteMapping("/slots/{id}")
  public ResponseEntity<String> deleteSlot(@PathVariable String id) {
    appointmentService.deleteSlot(id);
    return ResponseEntity.ok("Slot deleted successfully");
  }

  @PostMapping("/appointments")
  public ResponseEntity<Slot> createAppointment(
      @RequestBody AppointmentCreateDto appointmentCreateDto) {
    Slot createdAppointment = appointmentService.createAppointment(appointmentCreateDto);
    return createdAppointment != null ? ResponseEntity.ok(createdAppointment)
        : ResponseEntity.badRequest().build();
  }

  @GetMapping("/appointments/{id}")
  public ResponseEntity<Slot> getAppointment(@PathVariable String id) {
    Slot slot = appointmentService.getAppointment(id);
    return slot != null ? ResponseEntity.ok(slot) : ResponseEntity.notFound().build();
  }

  @PutMapping("/appointments/{id}")
  public ResponseEntity<String> updateAppointment(@PathVariable String id,
      AppointmentUpdateDto appointmentUpdateDto) {
    appointmentService.updateAppointment(id, appointmentUpdateDto);
    return ResponseEntity.ok("Appointment updated successfully");
  }

  @GetMapping("/appointments")
  public ResponseEntity<List<Slot>> getAppointments(
      @RequestParam(required = false) SlotFilter filter) {
    List<Slot> appointments = appointmentService.getAppointments(filter);
    return ResponseEntity.ok(appointments);
  }

  @DeleteMapping("/appointments/{id}")
  public ResponseEntity<String> deleteAppointment(@PathVariable String id) {
    appointmentService.deleteAppointment(id);
    return ResponseEntity.ok("Appointment deleted successfully");
  }

}
