package org.dbms.dbmshealthcare.controller;

import io.swagger.v3.oas.annotations.Operation;
import java.text.ParseException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.AppointmentCreateDto;
import org.dbms.dbmshealthcare.dto.AppointmentFilter;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.dto.SlotFilter;
import org.dbms.dbmshealthcare.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Appointment Controller", description = "API endpoints for managing appointments and slots")
public class AppointmentController {

  private final AppointmentService appointmentService;

  @Operation(summary = "Get available slots", description = "Retrieves a list of available time slots based on the provided filters")
  @GetMapping("/slots")
  public ResponseEntity<List<Slot>> getSlots(
      SlotFilter filter) {
    List<Slot> slots = appointmentService.getSlots(filter);
    return ResponseEntity.ok(slots);
  }

  @GetMapping("/slots/{id}")
  public ResponseEntity<Slot> getSlotById(@PathVariable String id) {
    Slot slot = appointmentService.getSlotById(id);
    return slot != null ? ResponseEntity.ok(slot) :
        ResponseEntity.notFound().build();
  }


  @Operation(summary = "Create a new slot", description = "Creates a new available time slot based on the provided data")
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

  @Operation(summary = "Create a new appointment", description = "Books an appointment in an available time slot based on the provided data")
  @PostMapping("/appointments")
  public ResponseEntity<Appointment> createAppointment(
      @RequestBody AppointmentCreateDto appointmentCreateDto) throws ParseException {
    Appointment createdAppointment = appointmentService.createAppointment(appointmentCreateDto);
    return createdAppointment != null ? ResponseEntity.ok(createdAppointment)
        : ResponseEntity.badRequest().build();
  }

  @GetMapping("/appointments/{id}")
  public ResponseEntity<Appointment> getAppointment(@PathVariable String id) {
    Appointment appointment = appointmentService.getAppointmentById(id);
    return appointment != null ? ResponseEntity.ok(appointment) : ResponseEntity.notFound().build();
  }

  @Operation(summary = "Update appointment", description = "Updates an existing appointment's information based on the provided data")
  @PutMapping("/appointments/{id}")
  public ResponseEntity<String> updateAppointment(@PathVariable String id,
      @RequestBody AppointmentUpdateDto appointmentUpdateDto) {
    appointmentService.updateAppointment(id, appointmentUpdateDto);
    return ResponseEntity.ok("Appointment updated successfully");
  }

  @GetMapping("/appointments")
  public ResponseEntity<List<Appointment>> getAppointments(
      AppointmentFilter filter) {
    List<Appointment> appointments = appointmentService.getAppointments(filter);
    return ResponseEntity.ok(appointments);
  }

  @Operation(summary = "Delete appointment", description = "Cancels and removes an appointment from the system by its ID")
  @DeleteMapping("/appointments/{id}")
  public ResponseEntity<String> deleteAppointment(@PathVariable String id) {
    appointmentService.deleteAppointment(id);
    return ResponseEntity.ok("Appointment deleted successfully");
  }

}
