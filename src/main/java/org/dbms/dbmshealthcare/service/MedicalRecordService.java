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

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public MedicalRecord getMedicalRecordById(String id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
    }

    public List<MedicalRecord> getMedicalRecordsByPatientId(String patientId) {
        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<MedicalRecord> searchMedicalRecordsByDiagnosis(String diagnosis) {
        return medicalRecordRepository.findByFinalDiagnosisContainingIgnoreCase(diagnosis);
    }

    public MedicalRecord updateMedicalRecord(String id, MedicalRecord updatedRecord) {
        MedicalRecord existingRecord = getMedicalRecordById(id);
        
        existingRecord.setVisitReason(updatedRecord.getVisitReason());
        existingRecord.setPatientDescription(updatedRecord.getPatientDescription());
        existingRecord.setDoctorNotes(updatedRecord.getDoctorNotes());
        existingRecord.setFinalDiagnosis(updatedRecord.getFinalDiagnosis());
        existingRecord.setRequisitions(updatedRecord.getRequisitions());
        existingRecord.setPrescriptions(updatedRecord.getPrescriptions());
        existingRecord.setBillingAmount(updatedRecord.getBillingAmount());
        
        return medicalRecordRepository.save(existingRecord);
    }

    public void deleteMedicalRecord(String id) {
        medicalRecordRepository.deleteById(id);
    }
}
