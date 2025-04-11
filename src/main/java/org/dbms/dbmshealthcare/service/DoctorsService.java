package org.dbms.dbmshealthcare.service;

import java.util.List;
import org.dbms.dbmshealthcare.dto.DoctorCreateDto;
import org.dbms.dbmshealthcare.dto.DoctorUpdateDto;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Slot;
import org.dbms.dbmshealthcare.repository.DoctorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoClient;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.TransactionBody;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DoctorsService {

  private final DoctorsRepository doctorsRepository;
  private final MongoClient mongoClient;
  private final MongoTemplate mongoTemplate;
  
  public DoctorsService(DoctorsRepository doctorsRepository, MongoClient mongoClient, MongoTemplate mongoTemplate) {
    this.doctorsRepository = doctorsRepository;
    this.mongoClient = mongoClient;
    this.mongoTemplate = mongoTemplate;
  }

  // CREATE operation
  public Doctor createDoctor(DoctorCreateDto doctorCreateDto) {
    Doctor doctor = new Doctor(doctorCreateDto.name(), doctorCreateDto.licenseNumber(),
        doctorCreateDto.specialization());
    return doctorsRepository.save(doctor);
  }

  // READ operations
  public List<Doctor> getAllDoctors() {
    return doctorsRepository.findAll();
  }

  public Doctor getDoctorById(String id) {
    return doctorsRepository.findById(id);
  }

  public Doctor getDoctorByUserId(String userId) {
    return doctorsRepository.findByUserId(userId);
  }

  // UPDATE operation
  public Doctor updateDoctor(String id, DoctorUpdateDto doctorUpdateDto) {
    Update update = new Update();

    if (doctorUpdateDto.name() != null) {
      update.set("name", doctorUpdateDto.name());
    }

    if (doctorUpdateDto.specialization() != null) {
      update.set("specialization", doctorUpdateDto.specialization());
    }

    if (doctorUpdateDto.email() != null) {
      update.set("email", doctorUpdateDto.email());
    }

    if (doctorUpdateDto.phoneNumber() != null) {
      update.set("phoneNumber", doctorUpdateDto.phoneNumber());
    }

    return doctorsRepository.update(id, update);
  }
  
  /**
   * Deletes a doctor and all their associated slots in a single transaction
   * 
   * @param doctorId the ID of the doctor to delete
   * @return true if the transaction succeeded, false otherwise
   */
  public boolean deleteDoctor(String doctorId) {
    // Start a client session
    try (ClientSession session = mongoClient.startSession()) {
      // Begin transaction
      TransactionBody<Boolean> txnBody = () -> {
        // 1. Find the doctor to make sure it exists
        Doctor doctor = getDoctorById(doctorId);
        if (doctor == null) {
          throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
              "Doctor with ID " + doctorId + " not found");
        }
        
        // 2. Find all slots associated with this doctor
        Query query = new Query(Criteria.where("doctor_id").is(doctorId));
        List<Slot> slots = mongoTemplate.find(query, Slot.class);
        
        // Log for transaction tracking
        System.out.println("Transaction: Found " + slots.size() + " slots for doctor " + doctorId);
        
        // 3. Delete all slots
        DeleteResult slotDeleteResult = mongoTemplate.remove(query, Slot.class);
        System.out.println("Transaction: Deleted " + slotDeleteResult.getDeletedCount() + " slots");
        
        // 4. Delete the doctor
        mongoTemplate.remove(
            Query.query(Criteria.where("_id").is(doctorId)), 
            Doctor.class
        );
        System.out.println("Transaction: Deleted doctor " + doctorId);
        
        // Return success
        return true;
      };
      
      // Execute the transaction
      return session.withTransaction(txnBody);
    } catch (Exception e) {
      System.err.println("Transaction failed: " + e.getMessage());
      e.printStackTrace();
      return false;
    }
  }
}
