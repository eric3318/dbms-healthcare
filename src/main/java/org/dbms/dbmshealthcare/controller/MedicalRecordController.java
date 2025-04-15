package org.dbms.dbmshealthcare.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.service.MedicalRecordService;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
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
 * Controller for managing medical records.
 * Provides CRUD operations for medical records with proper error handling and validation.
 */
@RestController
@RequestMapping("/api/medical-records")
@Tag(name = "Medical Record Controller", description = "API endpoints for managing medical records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    /**
     * Creates a new medical record.
     * Only doctors can create medical records.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Create a new medical record", description = "Creates a new medical record. Only doctors can create records.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Medical record created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Only doctors can create records"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    public MedicalRecord createMedicalRecord(@Valid @RequestBody MedicalRecordCreateDto medicalRecordCreateDto) {
        return medicalRecordService.createMedicalRecord(medicalRecordCreateDto);
    }

    /**
     * Retrieves a medical record by its ID.
     * Doctors can view their own records and their patients' records.
     * Patients can only view their own records.
     * Admins can view all records.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get a medical record by ID", description = "Retrieves a specific medical record.")
    public MedicalRecord getMedicalRecord(@PathVariable String id) {
        return medicalRecordService.getMedicalRecordById(id);
    }

    /**
     * Retrieves all medical records for a specific patient.
     */
    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get medical records by patient ID", description = "Retrieves all medical records for a specific patient. ")
    public List<MedicalRecord> getMedicalRecordsByPatientId(@PathVariable String patientId) {
        return medicalRecordService.getMedicalRecordsByPatientId(patientId);
    }

    /**
     * Retrieves all medical records for a specific doctor.
     */
    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get medical records by doctor ID", description = "Retrieves all medical records for a specific doctor.")
    public List<MedicalRecord> getMedicalRecordsByDoctorId(@PathVariable String doctorId) {
        return medicalRecordService.getMedicalRecordsByDoctorId(doctorId);
    }

    /**
     * Updates an existing medical record.
     * Only the doctor who created the record can update it.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Update a medical record", description = "Updates an existing medical record. Only the doctor who created the record can update it.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Medical record updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Only the creator can update"),
        @ApiResponse(responseCode = "404", description = "Medical record not found")
    })
    public MedicalRecord updateMedicalRecord(@PathVariable String id, @Valid @RequestBody MedicalRecordUpdateDto medicalRecordUpdateDto) {
        return medicalRecordService.updateMedicalRecord(id, medicalRecordUpdateDto);
    }

    /**
     * Deletes a medical record by its ID.
     * Only the doctor who created the record can delete it.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Delete a medical record", description = "Deletes a medical record. Only the doctor who created the record can delete it.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Medical record deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Only the creator can delete"),
        @ApiResponse(responseCode = "404", description = "Medical record not found")
    })
    public void deleteMedicalRecord(@PathVariable String id) {
        medicalRecordService.deleteMedicalRecord(id);
    }
} 