package org.dbms.dbmshealthcare.controller;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.dbms.dbmshealthcare.dto.analytics.AgeDistributionDto;
import org.dbms.dbmshealthcare.dto.analytics.AnalyticsFilterDto;
import org.dbms.dbmshealthcare.dto.analytics.SpecialtyStatsDto;
import org.dbms.dbmshealthcare.dto.analytics.TopDoctorsDto;
import org.dbms.dbmshealthcare.dto.analytics.DoctorCountBySpecialtyDto;
import org.dbms.dbmshealthcare.dto.analytics.RoleDistributionDto;
import org.dbms.dbmshealthcare.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Analytics Controller", description = "API endpoints for advanced database operations and analytics")
public class AnalyticsController {

    private final MongoTemplate mongoTemplate;
    private final AnalyticsService analyticsService;

    @Operation(summary = "Execute aggregation pipeline", description = "Run a custom MongoDB aggregation pipeline on a specified collection")
    @PostMapping("/aggregate")
    public ResponseEntity<Object> executeAggregation(@RequestBody AggregationRequest request) {
        try {
            log.info("Executing aggregation on collection: {}", request.getCollection());
            log.debug("Pipeline: {}", request.getPipeline());
            
            // Parse the aggregation pipeline from the JSON string
            List<Document> pipeline = new ArrayList<>();
            try {
                // Handle both array-style and object-style pipelines
                if (request.getPipeline().trim().startsWith("[")) {
                    // Direct array format
                    pipeline = Document.parse("{ \"pipeline\": " + request.getPipeline() + " }").getList("pipeline", Document.class);
                } else {
                    // Wrapped in an object with "pipeline" field
                    pipeline = Document.parse(request.getPipeline()).getList("pipeline", Document.class);
                }
                
                log.info("Successfully parsed pipeline with {} stages", pipeline.size());
            } catch (Exception e) {
                log.error("Error parsing pipeline: {}", e.getMessage(), e);
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Failed to parse aggregation pipeline",
                    "details", e.getMessage(),
                    "pipeline", request.getPipeline()
                ));
            }
            
            // Execute the aggregation and collect results
            List<Map<String, Object>> results = new ArrayList<>();
            try {
                mongoTemplate.getCollection(request.getCollection())
                        .aggregate(pipeline)
                        .forEach(doc -> {
                            Map<String, Object> map = new HashMap<>();
                            doc.forEach((key, value) -> map.put(key, value));
                            results.add(map);
                        });
                
                log.info("Aggregation executed successfully, returned {} results", results.size());
                return ResponseEntity.ok(results);
            } catch (Exception e) {
                log.error("Error executing aggregation: {}", e.getMessage(), e);
                return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to execute aggregation",
                    "details", e.getMessage(),
                    "collection", request.getCollection()
                ));
            }
        } catch (Exception e) {
            log.error("Unexpected error in aggregation endpoint: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Create database indexes", description = "Create indexes on specified collections to optimize query performance")
    @PostMapping("/indexes")
    public ResponseEntity<Map<String, Object>> createIndexes(@RequestBody IndexRequest request) {
        Map<String, Object> response = new HashMap<>();
        log.info("Creating indexes with commands: {}", request.getCommands());
        
        try {
            MongoDatabase database = mongoTemplate.getDb();
            
            // Parse and execute each index creation command
            Document indexCommands;
            try {
                indexCommands = Document.parse(request.getCommands());
            } catch (Exception e) {
                log.error("Error parsing index commands: {}", e.getMessage(), e);
                response.put("error", "Failed to parse index commands: " + e.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
            
            for (String key : indexCommands.keySet()) {
                try {
                    Document indexSpec = indexCommands.get(key, Document.class);
                    String collection = indexSpec.getString("collection");
                    Document keys = indexSpec.get("keys", Document.class);
                    
                    // Check if options were specified
                    IndexOptions options = new IndexOptions();
                    if (indexSpec.containsKey("options")) {
                        Document optionsDoc = indexSpec.get("options", Document.class);
                        if (optionsDoc.containsKey("unique")) {
                            options.unique(optionsDoc.getBoolean("unique"));
                        }
                        if (optionsDoc.containsKey("name")) {
                            options.name(optionsDoc.getString("name"));
                        }
                    }
                    
                    // Create the index
                    String indexName = database.getCollection(collection).createIndex(keys, options);
                    
                    // Add result to response
                    Map<String, Object> indexResult = new HashMap<>();
                    indexResult.put("indexName", indexName);
                    indexResult.put("collection", collection);
                    indexResult.put("keys", keys);
                    indexResult.put("success", true);
                    
                    response.put(key, indexResult);
                    log.info("Created index {} on collection {}", indexName, collection);
                } catch (Exception e) {
                    log.error("Error creating index for {}: {}", key, e.getMessage(), e);
                    Map<String, Object> errorResult = new HashMap<>();
                    errorResult.put("success", false);
                    errorResult.put("error", e.getMessage());
                    response.put(key, errorResult);
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Unexpected error in index creation: {}", e.getMessage(), e);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @Operation(summary = "Get top 5 doctors with most appointments", 
        description = "Retrieves the top 5 doctors with the most appointments in the specified month")
    @PostMapping("/top-doctors")
    public ResponseEntity<List<TopDoctorsDto>> getTopDoctors(@RequestBody AnalyticsFilterDto filter) {
        return ResponseEntity.ok(analyticsService.getTopDoctors(filter));
    }

    @Operation(summary = "Get specialty statistics", 
        description = "Retrieves statistics about the most chosen specialties in the specified month")
    @PostMapping("/specialty-stats")
    public ResponseEntity<List<SpecialtyStatsDto>> getSpecialtyStats(@RequestBody AnalyticsFilterDto filter) {
        return ResponseEntity.ok(analyticsService.getSpecialtyStats(filter));
    }

    @Operation(summary = "Get age distribution", 
        description = "Retrieves the age distribution of patients")
    @GetMapping("/age-distribution")
    public ResponseEntity<List<AgeDistributionDto>> getAgeDistribution() {
        return ResponseEntity.ok(analyticsService.getAgeDistribution());
    }

    @Operation(summary = "Get doctor count by specialty", 
        description = "Retrieves the number of doctors in each specialty")
    @GetMapping("/doctor-count-by-specialty")
    public ResponseEntity<List<DoctorCountBySpecialtyDto>> getDoctorCountBySpecialty() {
        return ResponseEntity.ok(analyticsService.getDoctorCountBySpecialty());
    }

    @Operation(summary = "Get user role distribution", 
        description = "Retrieves the distribution of user roles")
    @GetMapping("/user-role-distribution")
    public ResponseEntity<List<RoleDistributionDto>> getUserRoleDistribution() {
        return ResponseEntity.ok(analyticsService.getUserRoleDistribution());
    }

    // Request objects
    public static class AggregationRequest {
        private String collection;
        private String pipeline;

        public String getCollection() {
            return collection;
        }

        public void setCollection(String collection) {
            this.collection = collection;
        }

        public String getPipeline() {
            return pipeline;
        }

        public void setPipeline(String pipeline) {
            this.pipeline = pipeline;
        }
    }

    public static class IndexRequest {
        private String commands;

        public String getCommands() {
            return commands;
        }

        public void setCommands(String commands) {
            this.commands = commands;
        }
    }
} 