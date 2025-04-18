package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
import org.dbms.dbmshealthcare.repository.MedicalRecordRepository;
import org.dbms.dbmshealthcare.repository.DoctorRepository;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    // CREATE
    public MedicalRecord createMedicalRecord(MedicalRecordCreateDto medicalRecordCreateDto) {
        // dont check if patient and doctor exist, as we are using String IDs
        MedicalRecord medicalRecord = new MedicalRecord();
        // Set the ID to null, as it will be generated by MongoDB
        medicalRecord.setPatientId(medicalRecordCreateDto.patientId());
        medicalRecord.setDoctorId(medicalRecordCreateDto.doctorId());
        
        medicalRecord.setVisitReason(medicalRecordCreateDto.visitReason());
        medicalRecord.setPatientDescription(medicalRecordCreateDto.patientDescription());
        medicalRecord.setDoctorNotes(medicalRecordCreateDto.doctorNotes());
        medicalRecord.setFinalDiagnosis(medicalRecordCreateDto.finalDiagnosis());
        medicalRecord.setPrescriptions(medicalRecordCreateDto.prescriptions());
        medicalRecord.setBillingAmount(medicalRecordCreateDto.billingAmount());
        
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
        MedicalRecord existingRecord = medicalRecordRepository.findById(id);
        if (existingRecord == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical record not found");
        }

        Update update = new Update();
        
        if (medicalRecordUpdateDto.doctorNotes() != null) {
            update.set("doctorNotes", medicalRecordUpdateDto.doctorNotes());
        }
        if (medicalRecordUpdateDto.finalDiagnosis() != null) {
            update.set("finalDiagnosis", medicalRecordUpdateDto.finalDiagnosis());
        }
        if (medicalRecordUpdateDto.prescriptions() != null) {
            update.set("prescriptions", medicalRecordUpdateDto.prescriptions());
        }
        if (medicalRecordUpdateDto.billingAmount() != null) {
            update.set("billingAmount", medicalRecordUpdateDto.billingAmount());
        }
        return medicalRecordRepository.update(id, update);
    }

    // DELETE
    public void deleteMedicalRecord(String id) {
        MedicalRecord existingRecord = medicalRecordRepository.findById(id);
        if (existingRecord == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical record not found");
        }

        medicalRecordRepository.delete(id);
    }
}