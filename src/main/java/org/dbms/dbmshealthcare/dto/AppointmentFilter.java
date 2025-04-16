package org.dbms.dbmshealthcare.dto;

import java.time.LocalDateTime;
import lombok.Data;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;

@Data
public class AppointmentFilter {

  private String patientId;
  private String doctorId;
  private LocalDateTime from;
  private LocalDateTime to;
  private AppointmentStatus status;
}
