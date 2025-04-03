package org.dbms.dbmshealthcare.repository;

import org.dbms.dbmshealthcare.model.User;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository extends BaseMongoRepository<User> {

  public UserRepository(MongoTemplate template) {
    super(template, User.class);
  }

  public User findByEmail(String email){
    return mongoTemplate.findOne(Query.query(Criteria.where("email").is(email)), User.class);
  }

}
