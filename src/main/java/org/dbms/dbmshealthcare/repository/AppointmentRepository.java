package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.dbms.dbmshealthcare.exception.EntityNotFoundException;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.model.pojo.SlotDetails;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AppointmentRepository extends BaseMongoRepository<Appointment> {

  private final SlotRepository slotRepository;
  private final DoctorRepository doctorRepository;
  private final PatientRepository patientRepository;

  public AppointmentRepository(MongoTemplateResolver mongoTemplateResolver,
      SlotRepository slotRepository, DoctorRepository doctorRepository,
      PatientRepository patientRepository) {
    super(mongoTemplateResolver, Appointment.class);
    this.slotRepository = slotRepository;
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
  }

  @Transactional
  public Appointment create(String patientId,
      String slotId, String visitReason) {
    Criteria criteria = Criteria.where("_id").is(slotId).and("status").is(SlotStatus.AVAILABLE);
    Slot slot = slotRepository.update(slotId, criteria,
        new Update().set("status", SlotStatus.BOOKED));

    if (slot == null) {
      throw new RuntimeException("Slot not available");
    }

    Doctor doctor = doctorRepository.findById(slot.getDoctorId());

    Patient patient = patientRepository.findById(patientId);

    if (doctor == null || patient == null) {
      throw new EntityNotFoundException("Doctor or patient not found");
    }

    Appointment appointment = new Appointment(patientId, slot.getDoctorId(), patient.getName(),
        doctor.getName(),
        new SlotDetails(slotId, slot.getStartTime(), slot.getEndTime()), visitReason);

    return super.save(appointment);
  }

  @Transactional
  public void update(String id, AppointmentStatus status, String visitReason) {
    Update appointmentUpdates = new Update();
    if (status != null) {
      appointmentUpdates.set("status", status);

    }
    if (visitReason != null) {
      appointmentUpdates.set("visit_reason", visitReason);
    }

    Appointment updatedAppointment = super.update(id, appointmentUpdates);

    if (updatedAppointment == null) {
      throw new RuntimeException("Appointment not found or failed to update");
    }

    if (status != null && (status.equals(AppointmentStatus.REJECTED) || status.equals(
        AppointmentStatus.CANCELLED))) {

      Update slotUpdates = new Update().set("status", SlotStatus.AVAILABLE);

      Slot updatedSlot = slotRepository.update(updatedAppointment.getSlot().id(), slotUpdates);

      if (updatedSlot == null) {
        throw new RuntimeException("Failed to update the associated slot");
      }
    }
  }
}