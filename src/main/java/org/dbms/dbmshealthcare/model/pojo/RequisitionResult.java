package org.dbms.dbmshealthcare.model.pojo;

import java.time.Instant;

public record RequisitionResult(
    String description,
    String conclusion,
    Instant reportedAt
) {

}
