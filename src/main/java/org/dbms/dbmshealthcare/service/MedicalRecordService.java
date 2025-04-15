package org.dbms.dbmshealthcare.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.constants.Role;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.model.User;
import org.dbms.dbmshealthcare.model.Doctor;
import org.dbms.dbmshealthcare.model.Patient;
import org.dbms.dbmshealthcare.model.pojo.Prescription;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
import org.dbms.dbmshealthcare.repository.MedicalRecordRepository;
import org.dbms.dbmshealthcare.repository.DoctorRepository;
import org.dbms.dbmshealthcare.repository.PatientRepository;
import org.dbms.dbmshealthcare.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

    // CREATE
    public MedicalRecord createMedicalRecord(MedicalRecordCreateDto medicalRecordCreateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String userId = authentication.getName();
        User user = userRepository.findById(userId);
        if (user == null || !user.getRoles().contains(Role.DOCTOR)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only doctors can create medical records");
        }

        // Get doctor ID from user's roleId
        String doctorId = user.getRoleId();
        Doctor doctor = doctorRepository.findById(doctorId);
        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found");
        }

        // Verify patient exists
        Patient patient = patientRepository.findById(medicalRecordCreateDto.patientId());
        if (patient == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPatientId(medicalRecordCreateDto.patientId());
        medicalRecord.setDoctorId(doctorId);
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String userId = authentication.getName();
        User user = userRepository.findById(userId);
        if (user == null || !user.getRoles().contains(Role.DOCTOR)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only doctors can update medical records");
        }

        MedicalRecord existingRecord = medicalRecordRepository.findById(id);
        if (existingRecord == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical record not found");
        }

        if (!existingRecord.getDoctorId().equals(user.getRoleId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the doctor who created the record can update it");
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String userId = authentication.getName();
        User user = userRepository.findById(userId);
        if (user == null || !user.getRoles().contains(Role.DOCTOR)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only doctors can delete medical records");
        }

        MedicalRecord existingRecord = medicalRecordRepository.findById(id);
        if (existingRecord == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical record not found");
        }

        if (!existingRecord.getDoctorId().equals(user.getRoleId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the doctor who created the record can delete it");
        }

        medicalRecordRepository.delete(id);
    }
}