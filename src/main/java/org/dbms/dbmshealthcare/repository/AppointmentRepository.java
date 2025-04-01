package org.dbms.dbmshealthcare.repository;

import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.AppointmentUpdateDto;
import org.dbms.dbmshealthcare.model.Appointment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AppointmentRepository {

  private final MongoTemplate mongoTemplate;

  public List<Appointment> findAllWithQuery(Query query) {
    return mongoTemplate.find(query, Appointment.class);
  }

  public List<Appointment> findAll() {
    return mongoTemplate.findAll(Appointment.class);
  }

  public Appointment findById(String id) {
    return mongoTemplate.findById(id, Appointment.class);
  }

  public void update(String id, AppointmentUpdateDto appointmentUpdateDto) {
    UpdateResult updateResult = mongoTemplate.getCollection("appointments")
        .updateOne(Filters.eq("_id", id),
            Updates.set("status", appointmentUpdateDto.status())
        );

    if (updateResult.getModifiedCount() == 0) {
      throw new RuntimeException("Failed to update appointment with id: " + id);
    }
  }

  public Appointment save(Appointment appointment) {
    return mongoTemplate.save(appointment);
  }
}