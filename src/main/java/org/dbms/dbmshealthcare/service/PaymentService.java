package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment) {
        // Set initial status if not provided
        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.PENDING);
        }
        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    public List<Payment> getPaymentsByMedicalRecordId(String medicalRecordId) {
        return paymentRepository.findByMedicalRecordId(medicalRecordId);
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    public Payment updatePaymentStatus(String id, PaymentStatus status) {
        Payment payment = getPaymentById(id);
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String id, Payment updatedPayment) {
        Payment existingPayment = getPaymentById(id);
        
        // Update only allowed fields
        if (updatedPayment.getAmount() != null) {
            existingPayment.setAmount(updatedPayment.getAmount());
        }
        if (updatedPayment.getMedicalRecordId() != null) {
            existingPayment.setMedicalRecordId(updatedPayment.getMedicalRecordId());
        }
        if (updatedPayment.getStatus() != null) {
            existingPayment.setStatus(updatedPayment.getStatus());
        }
        
        return paymentRepository.save(existingPayment);
    }

    public void deletePayment(String id) {
        paymentRepository.deleteById(id);
    }
}
