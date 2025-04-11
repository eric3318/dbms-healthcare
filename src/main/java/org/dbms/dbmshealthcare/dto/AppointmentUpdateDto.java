package org.dbms.dbmshealthcare.dto;

import org.dbms.dbmshealthcare.constants.AppointmentStatus;

public record AppointmentUpdateDto(AppointmentStatus status, String visitReason) {

}
