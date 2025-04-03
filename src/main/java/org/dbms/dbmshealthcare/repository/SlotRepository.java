package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.model.Slot;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SlotRepository extends BaseMongoRepository<Slot> {

  public SlotRepository(MongoTemplate template) {
    super(template, Slot.class);
  }

}