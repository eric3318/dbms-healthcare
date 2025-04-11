package org.dbms.dbmshealthcare.repository;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@RequiredArgsConstructor
public abstract class BaseMongoRepository<T> {

  private final MongoTemplateResolver mongoTemplateResolver;
  private final Class<T> entityClass;
  
  protected MongoTemplate getMongoTemplate() {
    return mongoTemplateResolver.resolveMongoTemplate();
  }

  public List<T> findAll() {
    return getMongoTemplate().findAll(entityClass);
  }

  public List<T> findAll(Query query) {
    return getMongoTemplate().find(query, entityClass);
  }

  public T findById(String id) {
    return getMongoTemplate().findById(id, entityClass);
  }

  public T save(T entity) {
    return getMongoTemplate().save(entity);
  }

  public T delete(String id) {
    return getMongoTemplate().findAndRemove(
        Query.query(Criteria.where("_id").is(id)),
        entityClass
    );
  }

  public T delete(String id, Criteria criteria) {
    Criteria combinedCriteria = new Criteria().andOperator(
        criteria,
        Criteria.where("_id").is(id)
    );
    return getMongoTemplate().findAndRemove(
        Query.query(combinedCriteria),
        entityClass
    );
  }

  public T update(String id, Update updates) {
    Query query = Query.query(Criteria.where("_id").is(id));

    return getMongoTemplate().findAndModify(query, updates,
        FindAndModifyOptions.options().returnNew(true), entityClass);
  }

  public T update(String id, Criteria criteria, Update updates){
    Criteria combinedCriteria = new Criteria().andOperator(
        criteria,
        Criteria.where("_id").is(id)
    );

    Query query = new Query(combinedCriteria);

    return getMongoTemplate().findAndModify(
        query,
        updates,
        FindAndModifyOptions.options().returnNew(true),
        entityClass
    );
  }
}