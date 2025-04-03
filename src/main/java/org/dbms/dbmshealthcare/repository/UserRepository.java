package org.dbms.dbmshealthcare.repository;

import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.model.User;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepository {

  private final MongoTemplate mongoTemplate;

  public User save(User user) {
    return mongoTemplate.save(user);
  }

  public User findByEmail(String email) {
    Query query = new Query();
    return mongoTemplate.findOne(query.addCriteria(Criteria.where("email").is(email)), User.class);
  }

  public User findById(String id) {
    return mongoTemplate.findById(id, User.class);
  }


}
