package org.dbms.dbmshealthcare.dto;

import java.time.LocalDateTime;
import lombok.Data;
import org.dbms.dbmshealthcare.constants.SlotStatus;

@Data
public class SlotFilter {

  private String doctorId;
  private LocalDateTime from;
  private LocalDateTime to;
  private SlotStatus status;
}
