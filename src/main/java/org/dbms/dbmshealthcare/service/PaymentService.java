package org.dbms.dbmshealthcare.service;

import java.util.List;
import java.time.Instant;
import java.math.BigDecimal;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.dto.PaymentCreateDto;
import org.dbms.dbmshealthcare.dto.PaymentUpdateDto;
import org.dbms.dbmshealthcare.repository.PaymentRepository;
import org.dbms.dbmshealthcare.repository.MedicalRecordRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoClient;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.TransactionBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MongoClient mongoClient;
    private final MongoTemplate mongoTemplate;

    // CREATE
    public Payment createPayment(PaymentCreateDto paymentCreateDto) {
        Payment payment = new Payment();
        payment.setMedicalRecordId(paymentCreateDto.medicalRecordId());
        payment.setAmount(paymentCreateDto.amount());
        payment.setStatus(PaymentStatus.PENDING);
        // set RequestedAt and UpdatedAt to current time
        payment.setRequestedAt(Instant.now());
        payment.setUpdatedAt(Instant.now());
        return paymentRepository.save(payment);
    }

    // READ
    public Payment getPaymentById(String id) {
        Payment payment = paymentRepository.findById(id);
        if (payment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with id: " + id);
        }

        // update current time by Instant.now() to requestedAt
        payment.setRequestedAt(Instant.now());
        if (payment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with id: " + id);
        }
        return payment;
    }


    // Using List<Payment> but we only implement one Payment for one Medical Record this time
    public List<Payment> getPaymentsByMedicalRecordId(String medicalRecordId) {
        List<Payment> payment = paymentRepository.findByMedicalRecordId(medicalRecordId);
        if (payment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No payment found for medical record id: " + medicalRecordId);
        }
        // update current time by Instant.now() to requestedAt in all payments
        for (Payment p : payment) {
            p.setRequestedAt(Instant.now());
        }
        return payment;
    }

    /*
     * Update a payment. Only the fields that are not null in the PaymentUpdateDto
     * will be updated.
     *
     * @param id the ID of the payment to update
     * @param paymentUpdateDto the DTO containing the updated data
     * @return the updated Payment object
     */
    public Payment updatePayment(String id, PaymentUpdateDto paymentUpdateDto) {
        Update update = new Update();

        PaymentStatus status      = paymentUpdateDto.status();
        BigDecimal    amount      = paymentUpdateDto.amount();
        Instant       requestedAt = paymentUpdateDto.requestedAt();
        Instant       updatedAt   = paymentUpdateDto.updatedAt();

        // Now check each field for null and set it in the Update object
        if (status != null) {
            update.set("status", status);
        }

        if (amount != null) {
            update.set("amount", amount);
        }

        if (requestedAt != null) {
            update.set("requestedAt", requestedAt);
        }

        if (updatedAt != null) {
            update.set("updatedAt", updatedAt);
        }

        return paymentRepository.update(id, update);
    }

    /**
     * Deletes a payment and all associated medical records in a single transaction.
     *
     * @param id the ID of the payment to delete
     */
    public void deletePaymentAndMedicalRecord(String id) {
        // Start a client session
        try (ClientSession session = mongoClient.startSession()) {

            // Define the transaction body
            TransactionBody<Void> txnBody = () -> {
                // 1. Find the payment to ensure it exists
                Payment payment = getPaymentById(id);  // Implement getPaymentById(id) in your repository/service
                if (payment == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Payment with ID " + id + " not found");
                }

                // 2. Find all medical records associated with this payment
                Query query = new Query(Criteria.where("id").is(payment.getMedicalRecordId()));
                List<MedicalRecord> records = mongoTemplate.find(query, MedicalRecord.class);

                // Log for transaction tracking
                System.out.println("Transaction: Found " + records.size()
                        + " medical record(s) for payment ID " + id);

                // 3. Delete all associated medical records
                DeleteResult recordDeleteResult = mongoTemplate.remove(query, MedicalRecord.class);
                System.out.println("Transaction: Deleted " + recordDeleteResult.getDeletedCount()
                        + " medical record(s)");

                // 4. Delete the payment itself
                mongoTemplate.remove(
                        Query.query(Criteria.where("_id").is(id)),
                        Payment.class
                );
                System.out.println("Transaction: Deleted payment " + id);

                // Since our method returns void, we return null for the transaction body
                return null;
            };

            // Execute the transaction
            session.withTransaction(txnBody);

        } catch (Exception e) {
            System.err.println("Transaction failed: " + e.getMessage());
            e.printStackTrace();
            // Depending on your needs, you can choose to rethrow or handle the exception here
            throw new RuntimeException("Failed to delete payment and associated medical records", e);
        }
    }
}