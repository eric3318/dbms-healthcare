package org.dbms.dbmshealthcare.repository;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.bson.Document;
import org.dbms.dbmshealthcare.constants.AppointmentStatus;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.dbms.dbmshealthcare.config.MongoTemplateResolver;
import org.dbms.dbmshealthcare.dto.analytics.AgeDistributionDto;
import org.dbms.dbmshealthcare.dto.analytics.SpecialtyStatsDto;
import org.dbms.dbmshealthcare.dto.analytics.TopDoctorsDto;
import org.dbms.dbmshealthcare.model.User;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.UnwindOperation;
import org.springframework.data.mongodb.core.aggregation.LimitOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;


@Repository
public class AnalyticsRepository {

  private final MongoTemplateResolver mongoTemplateResolver;

  public AnalyticsRepository(MongoTemplateResolver mongoTemplateResolver) {
    this.mongoTemplateResolver = mongoTemplateResolver;
  }

  public List<TopDoctorsDto> getTopDoctors(YearMonth month) {
    LocalDateTime startDate = month.atDay(1).atStartOfDay();
    LocalDateTime endDate = month.atEndOfMonth().atTime(23, 59, 59);

    MatchOperation matchOperation = Aggregation.match(
        Criteria.where("slot.startTime").gte(startDate).lte(endDate)
            .and("status").is(AppointmentStatus.APPROVED.name())  // match the correct status!
    );

    GroupOperation groupOperation = Aggregation.group("doctor_id")
        .count().as("appointmentCount");

    // Raw $lookup with $expr and $toObjectId
    Document lookupDoc = new Document("$lookup",
        new Document("from", "doctors")
            .append("let", new Document("docId", "$_id"))
            .append("pipeline", List.of(
                new Document("$match", new Document("$expr",
                    new Document("$eq", List.of("$_id", new Document("$toObjectId", "$$docId")))
                ))
            ))
            .append("as", "doctorDetails")
    );
    AggregationOperation lookupOperation = context -> lookupDoc;

    UnwindOperation unwindOperation = Aggregation.unwind("doctorDetails");

    ProjectionOperation projectionOperation = Aggregation.project()
        .and("_id").as("doctorId")
        .and("doctorDetails.name").as("doctorName")
        .and("doctorDetails.specialization").as("specialization")
        .and("appointmentCount").as("appointmentCount");

    SortOperation sortOperation = Aggregation.sort(Sort.Direction.DESC, "appointmentCount");
    LimitOperation limitOperation = Aggregation.limit(5);

    Aggregation aggregation = Aggregation.newAggregation(
        matchOperation,
        groupOperation,
        lookupOperation,
        unwindOperation,
        projectionOperation,
        sortOperation,
        limitOperation
    );

    AggregationResults<TopDoctorsDto> results = mongoTemplateResolver.resolveMongoTemplate()
        .aggregate(aggregation, "appointments", TopDoctorsDto.class);

    return results.getMappedResults();
}




public List<SpecialtyStatsDto> getSpecialtyStats(YearMonth month) {
  LocalDateTime startDate = month.atDay(1).atStartOfDay();
  LocalDateTime endDate = month.atEndOfMonth().atTime(23, 59, 59);

  MatchOperation matchOperation = Aggregation.match(
      Criteria.where("slot.startTime").gte(startDate).lte(endDate)
          .and("status").is(AppointmentStatus.APPROVED.name())
  );

  // Custom $lookup using $expr to match string doctor_id with ObjectId _id
  Document rawLookup = new Document("$lookup",
      new Document("from", "doctors")
          .append("let", new Document("docId", "$doctor_id"))
          .append("pipeline", List.of(
              new Document("$match", new Document("$expr",
                  new Document("$eq", List.of("$_id", new Document("$toObjectId", "$$docId")))
              ))
          ))
          .append("as", "doctorDetails")
  );

  AggregationOperation lookupOperation = context -> rawLookup;

  UnwindOperation unwindOperation = Aggregation.unwind("doctorDetails");

  GroupOperation groupOperation = Aggregation.group("doctorDetails.specialization")
      .count().as("appointmentCount");

  SortOperation sortOperation = Aggregation.sort(Sort.Direction.DESC, "appointmentCount");

  ProjectionOperation projectionOperation = Aggregation.project()
      .and("_id").as("specialty")
      .and("appointmentCount").as("appointmentCount");

  Aggregation aggregation = Aggregation.newAggregation(
      matchOperation,
      lookupOperation,
      unwindOperation,
      groupOperation,
      sortOperation,
      projectionOperation
  );

  AggregationResults<SpecialtyStatsDto> results = mongoTemplateResolver.resolveMongoTemplate()
      .aggregate(aggregation, "appointments", SpecialtyStatsDto.class);

  return results.getMappedResults();
}


  public List<AgeDistributionDto> getAgeDistribution() {
    // First, get all users with their date of birth
    List<User> users = mongoTemplateResolver.resolveMongoTemplate()
        .findAll(User.class);

    // Calculate age groups
    Map<String, Long> ageGroups = new HashMap<>();
    LocalDateTime now = LocalDateTime.now();

    for (User user : users) {
      if (user.getDateOfBirth() != null) {
        Period period = Period.between(user.getDateOfBirth(), now.toLocalDate());
        int age = period.getYears();
        String ageGroup = getAgeGroup(age);
        ageGroups.merge(ageGroup, 1L, Long::sum);
      }
    }

    // Convert to DTOs
    return ageGroups.entrySet().stream()
        .map(entry -> new AgeDistributionDto(entry.getKey(), entry.getValue()))
        .collect(Collectors.toList());
  }

  private String getAgeGroup(int age) {
    if (age < 18) return "0-17";
    if (age < 25) return "18-24";
    if (age < 35) return "25-34";
    if (age < 45) return "35-44";
    if (age < 55) return "45-54";
    if (age < 65) return "55-64";
    return "65+";
  }
} 