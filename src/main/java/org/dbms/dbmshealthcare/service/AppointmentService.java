package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.AppointmentFilter;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.repository.AppointmentRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

  private final AppointmentRepository appointmentRepository;

  public void updateAppointment(String id, AppointmentUpdateDto appointmentUpdateDto) {
    appointmentRepository.update(id, appointmentUpdateDto);
  }

  public Appointment createAppointment(Appointment appointmentCreateDto) {
    return appointmentRepository.save(appointmentCreateDto);
  }

  public Appointment getAppointmentById(String id) {
    return appointmentRepository.findById(id);
  }

  public List<Appointment> getAppointments(AppointmentFilter filter) {
    if (filter == null) {
      return appointmentRepository.findAll();
    }

    Query query = buildQuery(filter);
    return appointmentRepository.findAllWithQuery(query);
  }

  private Query buildQuery(AppointmentFilter filter) {
    Query query = new Query();

    if (filter.patientId() != null) {
      query.addCriteria(Criteria.where("patient_id").is(filter.patientId()));
    }

    if (filter.doctorId() != null) {
      query.addCriteria(Criteria.where("doctor_id").is(filter.doctorId()));
    }

    if (filter.from() != null) {
      query.addCriteria(Criteria.where("start_time").gte(filter.from()));
    }

    if (filter.to() != null) {
      query.addCriteria(Criteria.where("end_time").lte(filter.to()));
    }

    if (filter.status() != null) {
      query.addCriteria(Criteria.where("status").is(filter.status()));
    }

    return query;
  }
}
