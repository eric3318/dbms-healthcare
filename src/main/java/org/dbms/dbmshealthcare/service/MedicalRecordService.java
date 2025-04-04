package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;

    // CREATE
    public MedicalRecord createMedicalRecord(MedicalRecordCreateDto medicalRecordCreateDto) {
        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setId(medicalRecordCreateDto.id());
        medicalRecord.setPatientId(medicalRecordCreateDto.patientId());
        medicalRecord.setVisitReason(medicalRecordCreateDto.visitReason());
        medicalRecord.setPatientDescription(medicalRecordCreateDto.patientDescription());
        medicalRecord.setDoctorNotes(medicalRecordCreateDto.doctorNotes());
        medicalRecord.setFinalDiagnosis(medicalRecordCreateDto.finalDiagnosis());
        medicalRecord.setRequisitions(medicalRecordCreateDto.requisitions());
        medicalRecord.setPrescriptions(medicalRecordCreateDto.prescriptions());
        medicalRecord.setBillingAmount(medicalRecordCreateDto.billingAmount());
        return medicalRecordRepository.save(medicalRecord);
    }

    // READ
    public MedicalRecord getMedicalRecordById(String id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
    }

    public List<MedicalRecord> getMedicalRecordsByPatientId(String patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctorId(String doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    // UPDATE
    public MedicalRecord updateMedicalRecord(String id, MedicalRecordUpdateDto medicalRecordUpdateDto) {
        Update update = new Update();
        
        if (medicalRecordUpdateDto.doctorNotes() != null) {
            update.set("doctorNotes", medicalRecordUpdateDto.doctorNotes());
        }
        if (medicalRecordUpdateDto.finalDiagnosis() != null) {
            update.set("finalDiagnosis", medicalRecordUpdateDto.finalDiagnosis());
        }
        if (medicalRecordUpdateDto.requisitions() != null) {
            update.set("requisitions", medicalRecordUpdateDto.requisitions());
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
    public MedicalRecord deleteMedicalRecord(String id) {
        return medicalRecordRepository.delete(id);
    }
}
