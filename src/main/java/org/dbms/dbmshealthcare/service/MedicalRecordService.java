package org.dbms.dbmshealthcare.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.dto.AppointmentFilter;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordFilter;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.model.pojo.Prescription;
import org.dbms.dbmshealthcare.repository.MedicalRecordRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

  private final MedicalRecordRepository medicalRecordRepository;
  private final AppointmentService appointmentService;

  public MedicalRecord createMedicalRecord(MedicalRecordCreateDto medicalRecordCreateDto) {
    String appointmentId = medicalRecordCreateDto.appointmentId();
    Appointment appointment = appointmentService.getAppointmentById(
        appointmentId);

    if (appointment == null) {
      return null;
    }

    MedicalRecord medicalRecord = new MedicalRecord(appointment.getPatientId(),
        appointment.getDoctorId(), appointmentId, appointment.getVisitReason(),
        medicalRecordCreateDto.patientDescription(),
        medicalRecordCreateDto.doctorNotes());

    BigDecimal billingAmount = medicalRecordCreateDto.billingAmount();
    if (billingAmount != null) {
      medicalRecord.setBillingAmount(billingAmount);
    }

    MedicalRecord created = medicalRecordRepository.create(medicalRecord);
    return created;
  }

  public List<MedicalRecord> getMedicalRecords(MedicalRecordFilter filter) {
    Query query = buildQuery(filter);
    return medicalRecordRepository.findAll(query);
  }

  public MedicalRecord getMedicalRecordById(String id) {
    return medicalRecordRepository.findById(id);
  }

  public void deleteMedicalRecord(String id) {
    MedicalRecord deleted = medicalRecordRepository.delete(id);
    if (deleted == null) {
      throw new RuntimeException("Medical record delete failed");
    }
  }

  public void updateMedicalRecord(String id, MedicalRecordUpdateDto medicalRecordUpdateDto) {
    Update updates = new Update();

    String patientDescription = medicalRecordUpdateDto.patientDescription();
    String doctorNotes = medicalRecordUpdateDto.doctorNotes();
    String finalDiagnosis = medicalRecordUpdateDto.finalDiagnosis();
    List<String> requisitionIds = medicalRecordUpdateDto.requisitionIds();
    List<Prescription> prescriptions = medicalRecordUpdateDto.prescriptions();

    if (patientDescription != null) {
      updates.set("patient_description", patientDescription);
    }

    if (doctorNotes != null) {
      updates.set("doctor_notes", doctorNotes);
    }

    if (finalDiagnosis != null) {
      updates.set("final_diagnosis", finalDiagnosis);
    }

    if (requisitionIds != null && !requisitionIds.isEmpty()) {
      updates.set("requisitions", requisitionIds);
    }

    if (prescriptions != null && !prescriptions.isEmpty()) {
      updates.set("prescriptions", prescriptions);
    }

    MedicalRecord updated = medicalRecordRepository.update(id, updates);
    if (updated == null) {
      throw new RuntimeException("Medical record update failed");
    }
  }

  private Query buildQuery(MedicalRecordFilter filter) {
    Query query = new Query();

    String patientId = filter.patientId();
    String doctorId = filter.doctorId();
    LocalDateTime from = filter.from();
    LocalDateTime to = filter.to();

    if (patientId != null) {
      query.addCriteria(Criteria.where("patient_id").is(patientId));
    }

    if (doctorId != null) {
      query.addCriteria(Criteria.where("doctor_id").is(doctorId));
    }

    if (from != null) {
      query.addCriteria(Criteria.where("created_at").gte(from.toInstant(ZoneOffset.UTC)));
    }

    if (to != null) {
      query.addCriteria(Criteria.where("created_at").lte(to.toInstant(ZoneOffset.UTC)));
    }

    return query;
  }
}
