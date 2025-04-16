package org.dbms.dbmshealthcare.service;

import java.util.List;
import java.time.Instant;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.model.pojo.Prescription;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
import org.dbms.dbmshealthcare.dto.PaymentCreateDto;
import org.dbms.dbmshealthcare.dto.PaymentUpdateDto;
import org.dbms.dbmshealthcare.model.Appointment;
import org.dbms.dbmshealthcare.service.AppointmentService;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.dbms.dbmshealthcare.repository.MedicalRecordRepository;
import org.dbms.dbmshealthcare.repository.PaymentRepository;
import org.dbms.dbmshealthcare.repository.DoctorRepository;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoClient;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.TransactionBody;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MedicalRecordService {
    private MongoClient mongoClient;
    private MongoTemplate mongoTemplate;
    private final MedicalRecordRepository medicalRecordRepository;
    // private final PaymentRepository paymentRepository;
    // private final DoctorRepository doctorRepository;
    // private final PatientRepository patientRepository;
    // private final AppointmentService appointmentService;

    /**
     * Constructor injection for all your fields.
     * Make sure Spring can provide the MongoClient, MongoTemplate, etc.
     */
    public MedicalRecordService(
            MongoClient mongoClient,
            MongoTemplate mongoTemplate,
            MedicalRecordRepository medicalRecordRepository
            // PaymentRepository paymentRepository,
            // DoctorRepository doctorRepository,
            // PatientRepository patientRepository,
            // AppointmentService appointmentService
    ) {
        this.mongoClient = mongoClient;
        this.mongoTemplate = mongoTemplate;
        this.medicalRecordRepository = medicalRecordRepository;
        // this.paymentRepository = paymentRepository;
        // this.doctorRepository = doctorRepository;
        // this.patientRepository = patientRepository;
        // this.appointmentService = appointmentService;
    }

    /**
     * Creates a new medical record.
     * @param medicalRecordCreateDto DTO containing the details of the medical record to be created.
     * @return The created MedicalRecord object.
     */
    public MedicalRecord createMedicalRecord(MedicalRecordCreateDto medicalRecordCreateDto) {
        // Create the medical record
        MedicalRecord medicalRecord = new MedicalRecord(
            medicalRecordCreateDto.patientId(),
            medicalRecordCreateDto.doctorId(),
            medicalRecordCreateDto.visitReason()
        );

        medicalRecord.setPatientDescription(medicalRecordCreateDto.patientDescription());
        medicalRecord.setDoctorNotes(medicalRecordCreateDto.doctorNotes());
        medicalRecord.setFinalDiagnosis(medicalRecordCreateDto.finalDiagnosis());
        medicalRecord.setPrescriptions(medicalRecordCreateDto.prescriptions());
        medicalRecord.setCreatedAt(Instant.now());
        medicalRecord.setUpdatedAt(Instant.now());

        // Save the medical record
        return medicalRecordRepository.save(medicalRecord);
    }

    // READ
    public MedicalRecord getMedicalRecordById(String id) {
        MedicalRecord record = medicalRecordRepository.findById(id);
        if (record == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical record not found with id: " + id);
        }
        return record;
    }


    public List<MedicalRecord> getMedicalRecordsByPatientId(String patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctorId(String doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    // UPDATE
    public MedicalRecord updateMedicalRecord(String id, MedicalRecordUpdateDto medicalRecordUpdateDto) {
        Update updates = new Update();

        String patientDescription = medicalRecordUpdateDto.patientDescription();
        String doctorNotes = medicalRecordUpdateDto.doctorNotes();
        String finalDiagnosis = medicalRecordUpdateDto.finalDiagnosis();
        List<Prescription> prescriptions = medicalRecordUpdateDto.prescriptions();

        if (patientDescription != null) {
        updates.set("patient_description", patientDescription);
        }

        if (doctorNotes != null) {
        updates.set("doctor_notes", doctorNotes);
        }

        if (finalDiagnosis != null) {
        updates.set("finalDiagnosis", finalDiagnosis);
        }

        if (prescriptions != null) {
        updates.set("prescriptions", prescriptions);
        }

        MedicalRecord updated = medicalRecordRepository.update(id, updates);
        if (updated == null) {
        throw new RuntimeException("Medical record update failed");
        }
        return updated;
    }

    // DELETE
    public boolean deleteMedicalRecordWithTransaction(String id) {
        // Start a MongoDB client session for the transaction
        try (ClientSession session = mongoClient.startSession()) {
            TransactionBody<Boolean> txnBody = () -> {
                // 1. Find the medical record and verify ownership
                MedicalRecord record = medicalRecordRepository.findById(id);
                if (record == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Medical record with ID " + id + " not found");
                }

                // 2. Find associated payment(s) for this medical record
                Query paymentQuery = new Query(Criteria.where("medicalRecordId").is(id));
                List<Payment> payments = mongoTemplate.find(paymentQuery, Payment.class);
                System.out.println("Transaction: Found " + payments.size() + " payments for medical record " + id);
                if (payments.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Associated payment not found for medical record " + id);
                }

                // 3. Delete the payment document(s)
                DeleteResult paymentResult = mongoTemplate.remove(paymentQuery, Payment.class);
                System.out.println("Transaction: Deleted " + paymentResult.getDeletedCount() + " payments");

                // 4. Delete the medical record document
                mongoTemplate.remove(Query.query(Criteria.where("_id").is(id)), MedicalRecord.class);
                System.out.println("Transaction: Deleted medical record " + id);

                // 5. Return success to commit the transaction
                return true;
            };

            // Execute the transaction. If txnBody returns true, changes will be committed.
            return session.withTransaction(txnBody);
        } catch (Exception e) {
            // If any error occurs, the transaction is aborted and we log the failure
            System.err.println("Transaction failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}