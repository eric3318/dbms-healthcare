package org.dbms.dbmshealthcare.repository;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@RequiredArgsConstructor
public abstract class BaseMongoRepository<T> {

  protected final MongoTemplate mongoTemplate;
  private final Class<T> entityClass;

  public List<T> findAll() {
    return mongoTemplate.findAll(entityClass);
  }

  public List<T> findAll(Query query) {
    return mongoTemplate.find(query, entityClass);
  }

  public T findById(String id) {
    return mongoTemplate.findById(id, entityClass);
  }

  public T save(T entity) {
    return mongoTemplate.save(entity);
  }

  public T delete(String id) {
    return mongoTemplate.findAndRemove(
        Query.query(Criteria.where("_id").is(id)),
        entityClass
    );
  }

  public T update(String id, Update updates) {
    Query query = Query.query(Criteria.where("_id").is(id));

    return mongoTemplate.findAndModify(query, updates,
        FindAndModifyOptions.options().returnNew(true), entityClass);
  }

  public T update(String id, Criteria criteria, Update updates){
    Criteria combinedCriteria = new Criteria().andOperator(
        criteria,
        Criteria.where("_id").is(id)
    );

    Query query = new Query(combinedCriteria);

    return mongoTemplate.findAndModify(
        query,
        updates,
        FindAndModifyOptions.options().returnNew(true),
        entityClass
    );
  }
}