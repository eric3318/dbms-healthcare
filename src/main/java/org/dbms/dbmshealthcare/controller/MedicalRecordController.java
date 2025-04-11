package org.dbms.dbmshealthcare.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.service.MedicalRecordService;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for managing medical records.
 * Provides CRUD operations for medical records with proper error handling and validation.
 */
@RestController
@RequestMapping("/api/medical-records")
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
    public MedicalRecord createMedicalRecord(@RequestBody MedicalRecordCreateDto MedicalRecordCreateDto) {
        return medicalRecordService.createMedicalRecord(MedicalRecordCreateDto);
    }

    /**
     * Retrieves a medical record by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecord(@PathVariable String id) {
        return medicalRecordService.getMedicalRecordById(id);
    }

    /**
     * Retrieves all medical records for a specific patient.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPatientId(@PathVariable String patientId) {
        return medicalRecordService.getMedicalRecordsByPatientId(patientId);
    }

    /**
     * Retrieves all medical records for a specific doctor.
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByDoctorId(@PathVariable String doctorId) {
        return medicalRecordService.getMedicalRecordsByDoctorId(doctorId);
    }

    /**
     * Updates an existing medical record.
     */
    @PutMapping("/{id}")
    public MedicalRecord updateMedicalRecord(@PathVariable String id, @RequestBody MedicalRecordUpdateDto medicalRecordUpdateDto) {
        return medicalRecordService.updateMedicalRecord(id, medicalRecordUpdateDto);
    }

    /**
     * Deletes a medical record by its ID.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedicalRecord(@PathVariable String id) {
        medicalRecordService.deleteMedicalRecord(id);
    }
} 
