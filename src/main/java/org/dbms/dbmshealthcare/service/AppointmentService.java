package org.dbms.dbmshealthcare.service;

import com.nimbusds.jwt.JWT;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.dbms.dbmshealthcare.dto.AppointmentCreateDto;
import org.dbms.dbmshealthcare.dto.AppointmentFilter;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.dto.SlotFilter;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.repository.AppointmentRepository;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.dbms.dbmshealthcare.repository.SlotRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

  private final SlotRepository slotRepository;
  private final AppointmentRepository appointmentRepository;

  public Slot createSlot(Slot slotCreateDto) {
    return slotRepository.save(slotCreateDto);
  }

  public Slot getSlotById(String id) {
    return slotRepository.findById(id);
  }

  public List<Slot> getSlots(SlotFilter filter) {
    if (filter == null) {
      return slotRepository.findAll();
    }

    Query query = buildQuery(filter);
    return slotRepository.findAll(query);
  }

  public void deleteSlot(String id) {
    Slot deleted = slotRepository.delete(id);

    if (deleted == null) {
      throw new RuntimeException("Slot delete failed");
    }
  }

  public List<Appointment> getAppointments(AppointmentFilter filter) {
    if (filter == null) {
      return appointmentRepository.findAll();
    }

    Query query = buildQuery(filter);
    return appointmentRepository.findAll(query);
  }

  public Appointment getAppointmentById(String id) {
    return appointmentRepository.findById(id);
  }

  public void updateAppointment(String id, AppointmentUpdateDto appointmentUpdateDto) {
    Update updates = new Update();

    AppointmentStatus status = appointmentUpdateDto.status();
    String visitReason = appointmentUpdateDto.visitReason();

    updates.set("status", status);
    updates.set("visit_reason", visitReason);

    Appointment updated = appointmentRepository.update(id, updates);

    if (updated == null) {
      throw new RuntimeException("Appointment update failed");
    }
  }

  public void deleteAppointment(String id) {
    Appointment deleted = appointmentRepository.delete(id);

    if (deleted == null) {
      throw new RuntimeException("Appointment delete failed");
    }
  }

  public Appointment createAppointment(AppointmentCreateDto appointmentCreateDto) {
    Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    Map<String, Object> profile = jwt.getClaimAsMap("profile");

    String patientId = (String) profile.get("role_id");

    String slotId = appointmentCreateDto.slotId();
    String visitReason = appointmentCreateDto.visitReason();
    Appointment appointment = appointmentRepository.createAppointment(patientId, slotId,
        visitReason);
    return appointment;
  }

  public List<Slot> findSlots(SlotFilter filter) {
    Query query = buildQuery(filter);
    return slotRepository.findAll(query);
  }

  private Query buildQuery(SlotFilter filter) {
    Query query = new Query();

    String doctorId = filter.getDoctorId();
    LocalDateTime from = filter.getFrom();
    LocalDateTime to = filter.getTo();
    SlotStatus status = filter.getStatus();

    if (doctorId != null) {
      query.addCriteria(Criteria.where("doctor_id").is(doctorId));
    }

    if (from != null) {
      query.addCriteria(Criteria.where("start_time").gte(from));
    }

    if (to != null) {
      query.addCriteria(Criteria.where("end_time").lte(to));
    }

    if (status != null) {
      query.addCriteria(Criteria.where("status").is(status));
    }

    return query;
  }

  private Query buildQuery(AppointmentFilter filter) {
    Query query = new Query();

    String patientId = filter.getPatientId();
    String doctorId = filter.getDoctorId();
    LocalDateTime from = filter.getFrom();
    LocalDateTime to = filter.getTo();
    AppointmentStatus status = filter.getStatus();

    if (patientId != null) {
      query.addCriteria(Criteria.where("patient_id").is(patientId));
    }

    if (doctorId != null) {
      query.addCriteria(Criteria.where("doctor_id").is(doctorId));
    }

    if (from != null) {
      query.addCriteria(Criteria.where("slot.start_time").gte(from));
    }

    if (to != null) {
      query.addCriteria(Criteria.where("slot.end_time").lte(to));
    }

    if (status != null) {
      query.addCriteria(Criteria.where("status").is(status));
    }

    return query;
  }
}
