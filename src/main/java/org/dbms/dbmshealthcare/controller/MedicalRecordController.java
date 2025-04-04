package org.dbms.dbmshealthcare.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.service.MedicalRecordService;
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

    @Autowired
    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    /**
     * Creates a new medical record.
     *
     * @param medicalRecord The medical record to create
     * @return ResponseEntity containing the created medical record
     */
    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@Valid @RequestBody MedicalRecord medicalRecord) {
        try {
            MedicalRecord createdRecord = medicalRecordService.createMedicalRecord(medicalRecord);
            return new ResponseEntity<>(createdRecord, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a medical record by its ID.
     *
     * @param id The ID of the medical record to retrieve
     * @return ResponseEntity containing the medical record if found, or NOT_FOUND if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecord(@PathVariable String id) {
        try {
            return medicalRecordService.getMedicalRecordById(id)
                    .map(record -> new ResponseEntity<>(record, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all medical records.
     *
     * @return ResponseEntity containing a list of all medical records
     */
    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
        try {
            List<MedicalRecord> records = medicalRecordService.getAllMedicalRecords();
            return new ResponseEntity<>(records, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Updates an existing medical record.
     *
     * @param id The ID of the medical record to update
     * @param medicalRecord The updated medical record data
     * @return ResponseEntity containing the updated medical record if successful
     */
    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(
            @PathVariable String id,
            @Valid @RequestBody MedicalRecord medicalRecord) {
        try {
            return medicalRecordService.updateMedicalRecord(id, medicalRecord)
                    .map(updatedRecord -> new ResponseEntity<>(updatedRecord, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a medical record by its ID.
     *
     * @param id The ID of the medical record to delete
     * @return ResponseEntity with NO_CONTENT if successful, or NOT_FOUND if the record doesn't exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable String id) {
        try {
            if (medicalRecordService.deleteMedicalRecord(id)) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all medical records for a specific patient.
     *
     * @param patientId The ID of the patient
     * @return ResponseEntity containing a list of medical records for the patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPatientId(@PathVariable String patientId) {
        try {
            List<MedicalRecord> records = medicalRecordService.getMedicalRecordsByPatientId(patientId);
            return new ResponseEntity<>(records, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByDoctorId(@PathVariable Long doctorId) {
        List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(medicalRecords);
    }
} 