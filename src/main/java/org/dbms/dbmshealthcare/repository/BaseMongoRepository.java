package org.dbms.dbmshealthcare.repository;

import com.mongodb.client.result.DeleteResult;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@RequiredArgsConstructor
public abstract class BaseMongoRepository<T> {

  protected final MongoTemplate mongoTemplate;
  private final Class<T> entityClass;

  public List<T> findAll() {
    return mongoTemplate.findAll(entityClass);
  }

  public List<T> findAllWithQuery(Query query) {
    return mongoTemplate.find(query, entityClass);
  }

  public T findById(String id) {
    return mongoTemplate.findById(id, entityClass);
  }

  public T save(T entity) {
    return mongoTemplate.save(entity);
  }

  public void delete(String id) {
    DeleteResult deleteResult = mongoTemplate.remove(
        Query.query(Criteria.where("_id").is(id)), entityClass);

    if (deleteResult.getDeletedCount() == 0) {
      throw new RuntimeException("Failed to delete " + entityClass.getSimpleName() + " with id: " + id);
    }
  }
}