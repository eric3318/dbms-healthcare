package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.constants.SlotStatus;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.model.pojo.SlotDetails;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AppointmentRepository extends BaseMongoRepository<Appointment> {

  public AppointmentRepository(MongoTemplateResolver mongoTemplateResolver) {
    super(mongoTemplateResolver, Appointment.class);
  }

  @Transactional
  public Appointment create(String patientId, String slotId, String visitReason) {
    Slot slot = getMongoTemplate().findAndModify(
        Query.query(
            Criteria.where("_id").is(slotId)
                .and("status").is(SlotStatus.AVAILABLE)
        ),
        new Update().set("status", SlotStatus.BOOKED),
        FindAndModifyOptions.options().returnNew(false),
        Slot.class
    );

    if (slot == null) {
      throw new RuntimeException("Slot not available");
    }

    Appointment appointment = new Appointment(patientId, slot.getDoctorId(),
        new SlotDetails(slot.getStartTime(), slot.getEndTime()), visitReason);
    
    return getMongoTemplate().save(appointment);
  }

}