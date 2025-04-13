package org.dbms.dbmshealthcare.controller;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.MedicalRecordCreateDto;
import org.dbms.dbmshealthcare.dto.MedicalRecordFilter;
import org.dbms.dbmshealthcare.dto.MedicalRecordUpdateDto;
import org.dbms.dbmshealthcare.model.MedicalRecord;
import org.dbms.dbmshealthcare.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class MedicalRecordController {

  private final MedicalRecordService medicalRecordService;

  @GetMapping("/{id}")
  public ResponseEntity<MedicalRecord> getMedicalRecord(@PathVariable String id) {
    MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(id);
    return medicalRecord != null ? ResponseEntity.ok(medicalRecord)
        : ResponseEntity.notFound().build();
  }

  @GetMapping
  public ResponseEntity<List<MedicalRecord>> getMedicalRecords(MedicalRecordFilter filter) {
    List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecords(filter);
    return ResponseEntity.ok(medicalRecords);
  }

  @PostMapping
  public ResponseEntity<MedicalRecord> createMedicalRecord(
      @Valid @RequestBody MedicalRecordCreateDto medicalRecordCreateDto) {
    MedicalRecord medicalRecord = medicalRecordService.createMedicalRecord(medicalRecordCreateDto);
    return ResponseEntity.ok(medicalRecord);
  }

  @PutMapping("/{id}")
  public ResponseEntity<String> updateMedicalRecord(@PathVariable String id, @RequestBody
  MedicalRecordUpdateDto medicalRecordUpdateDto) {
    medicalRecordService.updateMedicalRecord(id, medicalRecordUpdateDto);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteMedicalRecord(@PathVariable String id) {
    medicalRecordService.deleteMedicalRecord(id);
    return ResponseEntity.ok().build();
  }

}
