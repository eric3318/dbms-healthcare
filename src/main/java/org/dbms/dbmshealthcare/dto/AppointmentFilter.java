package org.dbms.dbmshealthcare.dto;

import org.dbms.dbmshealthcare.constants.AppointmentStatus;

public record AppointmentFilter(String doctorId,
                                String patientId,
                                String from,
                                String to,
                                AppointmentStatus status
) {

}
