package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.model.Payment;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MedicalRecordRepository extends BaseMongoRepository<MedicalRecord> {

  private final AppointmentRepository appointmentRepository;
  private final PaymentRepository paymentRepository;

  public MedicalRecordRepository(MongoTemplateResolver mongoTemplateResolver,
      AppointmentRepository appointmentRepository, PaymentRepository paymentRepository) {
    super(mongoTemplateResolver, MedicalRecord.class);
    this.appointmentRepository = appointmentRepository;
    this.paymentRepository = paymentRepository;
  }

  @Transactional
  public MedicalRecord create(MedicalRecord medicalRecord) {
    String appointmentId = medicalRecord.getAppointmentId();

    Update appointmentUpdates = new Update().set("status", AppointmentStatus.IN_PROGRESS);
    Appointment updatedAppointment = appointmentRepository.update(appointmentId,
        appointmentUpdates);

    if (updatedAppointment == null) {
      throw new RuntimeException("Appointment not updated");
    }

    save(medicalRecord);

    if (medicalRecord.getBillingAmount() != null) {
      Payment payment = new Payment(
          medicalRecord.getId(),
          medicalRecord.getBillingAmount()
      );
      paymentRepository.save(payment);
    }

    return medicalRecord;
  }

}
