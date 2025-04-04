package org.dbms.dbmshealthcare.dto;

import org.dbms.dbmshealthcare.constants.RequisitionStatus;

public record RequisitionUpdateDto(
    RequisitionStatus status
) {
} 