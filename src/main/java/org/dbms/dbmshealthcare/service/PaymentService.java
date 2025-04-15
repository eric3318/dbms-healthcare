package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.dto.PaymentCreateDto;
import org.dbms.dbmshealthcare.dto.PaymentUpdateDto;
import org.dbms.dbmshealthcare.repository.PaymentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    // CREATE
    public Payment createPayment(PaymentCreateDto paymentCreateDto) {

        Payment payment = new Payment();
        payment.setMedicalRecordId(paymentCreateDto.medicalRecordId());
        payment.setAmount(paymentCreateDto.amount());
        payment.setStatus(paymentCreateDto.status());
        payment.setRequestedAt(paymentCreateDto.requestedAt());
        payment.setUpdatedAt(paymentCreateDto.updatedAt());
        return paymentRepository.save(payment);
    }

    // READ
    public Payment getPaymentById(String id) {
        Payment payment = paymentRepository.findById(id);
        if (payment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with id: " + id);
        }
        return payment;
    }

    public List<Payment> getPaymentsByMedicalRecordId(String medicalRecordId) {
        return paymentRepository.findByMedicalRecordId(medicalRecordId);
    }

    // UPDATE
    public Payment updatePayment(String id, PaymentUpdateDto paymentUpdateDto) {
        Update update = new Update();
        
        if (paymentUpdateDto.status() != null) {
            update.set("status", paymentUpdateDto.status());
        }
        if (paymentUpdateDto.amount() != null) {
            update.set("amount", paymentUpdateDto.amount());
        }
        if (paymentUpdateDto.requestedAt() != null) {
            update.set("requestedAt", paymentUpdateDto.requestedAt());
        }
        if (paymentUpdateDto.updatedAt() != null) {
            update.set("updatedAt", paymentUpdateDto.updatedAt());
        }
        return paymentRepository.update(id, update);
    }

    // DELETE
    public void deletePayment(String id) {
        paymentRepository.delete(id);
    }
}