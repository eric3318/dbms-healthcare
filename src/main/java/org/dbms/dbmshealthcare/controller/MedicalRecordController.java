package org.dbms.dbmshealthcare.controller;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.service.MedicalRecordService;
import java.util.Map;
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
import org.springframework.http.ResponseEntity;
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
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new medical record", description = "Creates a new medical record.")
    public MedicalRecord createMedicalRecord(@Valid @RequestBody MedicalRecordCreateDto medicalRecordCreateDto) {
        return medicalRecordService.createMedicalRecord(medicalRecordCreateDto);
    }

    /**
     * Retrieves a medical record by its ID.
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
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update a medical record", description = "Updates an existing medical record.")
    public MedicalRecord updateMedicalRecord(@PathVariable String id, @Valid @RequestBody MedicalRecordUpdateDto medicalRecordUpdateDto) {
        return medicalRecordService.updateMedicalRecord(id, medicalRecordUpdateDto);
    }


    /**
     * Deletes a medical record by its ID with transaction.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a medical record along with its payment", description = "Delete a medical record along with its payment by medical record ID.")
    public ResponseEntity<?> deleteMedicalRecord(@PathVariable String id) {
        boolean success = medicalRecordService.deleteMedicalRecordWithTransaction(id);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of(
                "message", "Medical Records and associated Payments deleted successfully",
                "medicalRecordId", id
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Medical Record not found or deletion failed"));
        }
    }
} 