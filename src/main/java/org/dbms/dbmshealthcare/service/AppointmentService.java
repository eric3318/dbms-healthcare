package org.dbms.dbmshealthcare.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.dbms.dbmshealthcare.dto.AppointmentCreateDto;
import org.dbms.dbmshealthcare.dto.AppointmentFilter;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.dto.SlotFilter;
import org.dbms.dbmshealthcare.exception.EntityNotFoundException;
import org.dbms.dbmshealthcare.exception.UnauthorizedOperationException;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.pojo.AuthenticatedUserInfo;
import org.dbms.dbmshealthcare.repository.AppointmentRepository;
import org.dbms.dbmshealthcare.repository.DoctorRepository;
import org.dbms.dbmshealthcare.repository.SlotRepository;
import org.dbms.dbmshealthcare.utils.AuthUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
    AuthenticatedUserInfo authenticatedUserInfo = AuthUtils.getAuthenticatedUserInfo();
    Slot slot = slotRepository.findById(id);

    if (slot == null) {
      throw new EntityNotFoundException("Slot not found");
    }

    if (authenticatedUserInfo.role().equals(Role.DOCTOR) && !slot.getDoctorId()
        .equals(authenticatedUserInfo.roleId())) {
      throw new UnauthorizedOperationException("doctor Id mismatch");
    }

    Slot deleted = slotRepository.delete(id);

    if (deleted == null) {
      throw new RuntimeException("Slot delete failed");
    }
  }

  public List<Appointment> getAppointments(AppointmentFilter filter) {
    AuthenticatedUserInfo authenticatedUserInfo = AuthUtils.getAuthenticatedUserInfo();
    Role role = authenticatedUserInfo.role();
    String roleId = authenticatedUserInfo.roleId();

    if (role.equals(Role.DOCTOR)) {
      String filterDoctorId = filter.getDoctorId();
      if (filterDoctorId != null && !roleId.equals(filterDoctorId)) {
        throw new UnauthorizedOperationException("doctor ID mismatch");
      }
      filter.setDoctorId(roleId);
    }

    if (role.equals(Role.PATIENT)) {
      String filterPatientId = filter.getPatientId();
      if (filterPatientId != null && !roleId.equals(filterPatientId)) {
        throw new UnauthorizedOperationException("patient ID mismatch");
      }
      filter.setPatientId(roleId);
    }

    Query query = buildQuery(filter);
    return appointmentRepository.findAll(query);
  }

  public Appointment getAppointmentById(String id) {
    AuthenticatedUserInfo authenticatedUserInfo = AuthUtils.getAuthenticatedUserInfo();
    Role role = authenticatedUserInfo.role();
    String roleId = authenticatedUserInfo.roleId();

    Appointment appointment = appointmentRepository.findById(id);

    if (appointment != null) {
      if (role.equals(Role.DOCTOR) && !appointment.getDoctorId().equals(roleId)) {
        throw new UnauthorizedOperationException("doctor ID mismatch");
      }

      if (role.equals(Role.PATIENT) && !appointment.getPatientId().equals(roleId)) {
        throw new UnauthorizedOperationException("patient ID mismatch");
      }
    }

    return appointment;
  }

  public void updateAppointment(String id, AppointmentUpdateDto appointmentUpdateDto) {
    AuthenticatedUserInfo authenticatedUserInfo = AuthUtils.getAuthenticatedUserInfo();
    Role role = authenticatedUserInfo.role();
    String roleId = authenticatedUserInfo.roleId();

    Appointment appointment = appointmentRepository.findById(id);

    if (appointment != null) {
      if (role.equals(Role.DOCTOR) && !appointment.getDoctorId().equals(roleId)) {
        throw new UnauthorizedOperationException("doctor ID mismatch");
      }

      if (role.equals(Role.PATIENT) && !appointment.getPatientId().equals(roleId)) {
        throw new UnauthorizedOperationException("patient ID mismatch");
      }
    }

    appointmentRepository.update(id, appointmentUpdateDto.status(),
        appointmentUpdateDto.visitReason());
  }

  public void deleteAppointment(String id) {
      Appointment deleted = appointmentRepository.delete(id);

      if (deleted == null) {
        throw new RuntimeException("Appointment delete failed");
      }
  }

  public Appointment createAppointment(AppointmentCreateDto appointmentCreateDto) {
    AuthenticatedUserInfo authenticatedUserInfo = AuthUtils.getAuthenticatedUserInfo();
    String patientId = authenticatedUserInfo.roleId();

    String slotId = appointmentCreateDto.slotId();
    String visitReason = appointmentCreateDto.visitReason();

    return appointmentRepository.create(patientId, slotId,
        visitReason);
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
