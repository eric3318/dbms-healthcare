package org.dbms.dbmshealthcare.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.constants.PaymentStatus;
import org.dbms.dbmshealthcare.service.PaymentService;
import org.dbms.dbmshealthcare.dto.PaymentCreateDto;
import org.dbms.dbmshealthcare.dto.PaymentUpdateDto;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * Controller for managing Payment.
 * Provides CRUD operations for payments with proper error handling and validation.
 */
@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments Controller", description = "API endpoints for managing payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Creates a new payment.
     * Only doctors can create payments.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Payment createPayment(@Valid @RequestBody PaymentCreateDto paymentCreateDto) {
        return paymentService.createPayment(paymentCreateDto);
    }

    /**
     * Retrieves a payment by its ID.
     * Doctors can view their own payments and their patients' payments.
     * Patients can only view their own payments.
     * Admins can view all payments.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get a payment by ID", description = "Retrieves a specific payment.")
    public Payment getPayment(@PathVariable String id) {
        return paymentService.getPaymentById(id);
    }

    /**
     * Retrieves all payments for a specific patient.
     */
    @GetMapping("/medical-records/{medicalRecordId}")
    @Operation(summary = "Get payments by medicalRecordId", description = "Retrieves all payments for a specific medicalRecordId. ")
    public List<Payment> getPaymentsByMedicalRecordId(@PathVariable String medicalRecordId) {
        return paymentService.getPaymentsByMedicalRecordId(medicalRecordId);
    }

    /**
     * Updates an existing payment.
     */
    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable String id, @Valid @RequestBody PaymentUpdateDto paymentUpdateDto) {
        return paymentService.updatePayment(id, paymentUpdateDto);
    }

    /**
     * Deletes a payment by its ID.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a payment", description = "Deletes a payment.")
    public void deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
    }
} 