package org.dbms.dbmshealthcare.controller;

import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.AppointmentCreateDto;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.dto.SlotFilter;
import org.dbms.dbmshealthcare.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentService appointmentService;

  @Operation(summary = "Get available slots", description = "Retrieve a list of available slots, optionally filtered by doctor and time range.")
  @GetMapping("/slots")
  public ResponseEntity<List<Slot>> getSlots(
      SlotFilter filter) {
    List<Slot> slots = appointmentService.getSlots(filter);
    return ResponseEntity.ok(slots);
  }

  @Operation(summary = "Get slot by ID", description = "Retrieve detailed information about a specific slot by its ID.")
  @GetMapping("/slots/{id}")
  public ResponseEntity<Slot> getSlotById(@PathVariable String id) {
    Slot slot = appointmentService.getSlotById(id);
    return slot != null ? ResponseEntity.ok(slot) :
        ResponseEntity.notFound().build();
  }

  @Operation(summary = "Create a new slot", description = "Add a new slot with doctor and time details.")
  @PostMapping("/slots")
  public ResponseEntity<Slot> createSlot(
      @RequestBody Slot slotCreateDto) {
    Slot createdslot = appointmentService.createSlot(slotCreateDto);
    return createdslot != null ? ResponseEntity.ok(createdslot)
        : ResponseEntity.badRequest().build();
  }

  @Operation(summary = "Delete a slot", description = "Delete a slot by its ID.")
  @DeleteMapping("/slots/{id}")
  public ResponseEntity<String> deleteSlot(@PathVariable String id) {
    appointmentService.deleteSlot(id);
    return ResponseEntity.ok("Slot deleted successfully");
  }

  @Operation(summary = "Create an appointment", description = "Book an appointment for a patient using an available slot.")
  @PostMapping("/appointments")
  public ResponseEntity<Slot> createAppointment(
      @RequestBody AppointmentCreateDto appointmentCreateDto) {
    Slot createdAppointment = appointmentService.createAppointment(appointmentCreateDto);
    return createdAppointment != null ? ResponseEntity.ok(createdAppointment)
        : ResponseEntity.badRequest().build();
  }


  @Operation(summary = "Get appointment by ID", description = "Retrieve a specific appointment by its ID.")
  @GetMapping("/appointments/{id}")
  public ResponseEntity<Slot> getAppointment(@PathVariable String id) {
    Slot slot = appointmentService.getAppointmentById(id);
    return slot != null ? ResponseEntity.ok(slot) : ResponseEntity.notFound().build();
  }

  @Operation(summary = "Update appointment", description = "Update details of an existing appointment.")
  @PutMapping("/appointments/{id}")
  public ResponseEntity<String> updateAppointment(@PathVariable String id,
      @RequestBody AppointmentUpdateDto appointmentUpdateDto) {
    appointmentService.updateAppointment(id, appointmentUpdateDto);
    return ResponseEntity.ok("Appointment updated successfully");
  }

  @Operation(summary = "Get all appointments", description = "Retrieve a list of appointments, optionally filtered by doctor, patient, time range, and status.")
  @GetMapping("/appointments")
  public ResponseEntity<List<Slot>> getAppointments(
      SlotFilter filter) {
    List<Slot> appointments = appointmentService.getAppointments(filter);
    return ResponseEntity.ok(appointments);
  }

  @Operation(summary = "Delete appointment", description = "Delete an appointment by its ID.")
  @DeleteMapping("/appointments/{id}")
  public ResponseEntity<String> deleteAppointment(@PathVariable String id) {
    appointmentService.deleteAppointment(id);
    return ResponseEntity.ok("Appointment deleted successfully");
  }

}
