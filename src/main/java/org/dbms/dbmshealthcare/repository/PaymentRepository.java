package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.model.Payment;
import org.dbms.dbmshealthcare.model.Slot;
import org.springframework.stereotype.Repository;

@Repository
public class PaymentRepository extends BaseMongoRepository<Payment> {

  public PaymentRepository(MongoTemplateResolver mongoTemplateResolver) {
    super(mongoTemplateResolver, Payment.class);
  }

}