package org.dbms.dbmshealthcare.config;

import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

  @Value("${spring.data.mongodb.uri}")
  private String defaultMongoUri;

  @Value("${spring.data.mongodb.admin.uri}")
  private String adminMongoUri;

  @Value("${spring.data.mongodb.doctor.uri}")
  private String doctorMongoUri;

  @Value("${spring.data.mongodb.patient.uri}")
  private String patientMongoUri;

  @Primary
  @Bean(name = "defaultMongoTemplate")
  public MongoTemplate defaultMongoTemplate() {
    return new MongoTemplate(new SimpleMongoClientDatabaseFactory(MongoClients.create(defaultMongoUri), "healthcare"));
  }

  @Bean(name = "adminMongoTemplate")
  public MongoTemplate adminMongoTemplate() {
    return new MongoTemplate(new SimpleMongoClientDatabaseFactory(MongoClients.create(adminMongoUri), "healthcare"));
  }

  @Bean(name = "doctorMongoTemplate")
  public MongoTemplate doctorMongoTemplate() {
    return new MongoTemplate(new SimpleMongoClientDatabaseFactory(MongoClients.create(doctorMongoUri), "healthcare"));
  }

  @Bean(name = "patientMongoTemplate")
  public MongoTemplate patientMongoTemplate() {
    return new MongoTemplate(new SimpleMongoClientDatabaseFactory(MongoClients.create(patientMongoUri), "healthcare"));
  }

  @Bean
  public MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
    return new MongoTransactionManager(dbFactory);
  }
}
