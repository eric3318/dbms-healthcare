package org.dbms.dbmshealthcare.config;

import java.util.Collection;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class MongoTemplateResolver {

    private final MongoTemplate defaultMongoTemplate;
    private final MongoTemplate adminMongoTemplate;
    private final MongoTemplate doctorMongoTemplate;
    private final MongoTemplate patientMongoTemplate;

    public MongoTemplateResolver(
            @Qualifier("defaultMongoTemplate") MongoTemplate defaultMongoTemplate,
            @Qualifier("adminMongoTemplate") MongoTemplate adminMongoTemplate,
            @Qualifier("doctorMongoTemplate") MongoTemplate doctorMongoTemplate,
            @Qualifier("patientMongoTemplate") MongoTemplate patientMongoTemplate) {
        this.defaultMongoTemplate = defaultMongoTemplate;
        this.adminMongoTemplate = adminMongoTemplate;
        this.doctorMongoTemplate = doctorMongoTemplate;
        this.patientMongoTemplate = patientMongoTemplate;
    }

    public MongoTemplate resolveMongoTemplate() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

            if (authorities.contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
                return adminMongoTemplate;
            } else if (authorities.contains(new SimpleGrantedAuthority("ROLE_DOCTOR"))) {
                return doctorMongoTemplate;
            } else if (authorities.contains(new SimpleGrantedAuthority("ROLE_PATIENT"))) {
                return patientMongoTemplate;
            }
        }

        return defaultMongoTemplate;
    }
} 