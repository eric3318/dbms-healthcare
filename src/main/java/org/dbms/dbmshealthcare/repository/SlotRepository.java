package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.model.Slot;
import org.springframework.stereotype.Repository;

@Repository
public class SlotRepository extends BaseMongoRepository<Slot> {

  public SlotRepository(MongoTemplateResolver mongoTemplateResolver) {
    super(mongoTemplateResolver, Slot.class);
  }

}