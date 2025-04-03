package org.dbms.dbmshealthcare.service;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.dbms.dbmshealthcare.dto.AppointmentCreateDto;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.dto.SlotFilter;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.repository.SlotRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

  private final SlotRepository slotRepository;

  public Slot createSlot(Slot slotCreateDto) {
    return slotRepository.save(slotCreateDto);
  }

  public Slot getSlotById(String id) {
    return slotRepository.findById(id);
  }

  public List<Slot> getSlots(SlotFilter filter) {
    if (filter == null) {
      filter = new SlotFilter();
    }

    filter.setIsReserved(false);

    Query query = buildQuery(filter);
    return slotRepository.findAll(query);
  }

  public void deleteSlot(String id) {
    Slot deleted = slotRepository.delete(id);

    if (deleted == null) {
      throw new RuntimeException("Slot delete failed");
    }
  }

  public List<Slot> getAppointments(SlotFilter filter) {
    if (filter == null) {
      filter = new SlotFilter();
    }

    filter.setIsReserved(true);

    Query query = buildQuery(filter);
    return slotRepository.findAll(query);
  }

  public Slot getAppointment(String id) {
    Slot slot = slotRepository.findById(id);
    return slot.isReserved() ? slot : null;
  }

  public void updateAppointment(String id, AppointmentUpdateDto appointmentUpdateDto) {
    Update updates = new Update();

    SlotStatus status = appointmentUpdateDto.status();

    updates.set("status", status);

    Criteria criteria = Criteria.where("is_reserved").is(true);

    Slot updated = slotRepository.update(id, criteria, updates);

    if (updated == null) {
      throw new RuntimeException("Appointment update failed");
    }
  }

  public void deleteAppointment(String id) {
    Criteria criteria = Criteria.where("is_reserved").is(true);
    Slot deleted = slotRepository.delete(id, criteria);

    if (deleted == null) {
      throw new RuntimeException("Appointment update failed");
    }
  }

  public Slot createAppointment(AppointmentCreateDto appointmentCreateDto) {
    String slotId = appointmentCreateDto.slotId();

    Update updates = new Update();

    String patientId = appointmentCreateDto.patientId();
    SlotStatus status = SlotStatus.PENDING_APPROVAL;

    updates.set("patient_id", patientId);
    updates.set("status", status);
    updates.set("is_reserved", true);

    Criteria criteria = new Criteria()
        .andOperator(
            Criteria.where("status").is(SlotStatus.AVAILABLE),
            Criteria.where("is_reserved").is(false),
            Criteria.where("patientId").is(null)
        );
    return slotRepository.update(slotId, criteria, updates);
  }

  private Query buildQuery(SlotFilter filter) {
    Query query = new Query();

    String patientId = filter.getPatientId();
    String doctorId = filter.getDoctorId();
    LocalDateTime from = filter.getFrom();
    LocalDateTime to = filter.getTo();
    SlotStatus status = filter.getStatus();
    Boolean isReserved = filter.getIsReserved();

    if (patientId != null) {
      query.addCriteria(Criteria.where("patient_id").is(patientId));
    }

    if (doctorId != null) {
      query.addCriteria(Criteria.where("doctor_id").is(doctorId));
    }

    if (from != null) {
      query.addCriteria(Criteria.where("start_time").gte(from));
    }

    if (to != null) {
      query.addCriteria(Criteria.where("end_time").lte(to));
    }

    if (isReserved != null) {
      query.addCriteria(Criteria.where("is_reserved").is(isReserved));
    }

    if (status != null) {
      query.addCriteria(Criteria.where("status").is(status));
    }

    return query;
  }
}
