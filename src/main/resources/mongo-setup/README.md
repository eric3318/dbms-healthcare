# MongoDB Role-Based Access Control Setup

This document explains how to set up role-based access control (RBAC) in MongoDB for the healthcare application.

## 1. Connect to MongoDB

Connect to your MongoDB instance using the mongo shell with admin privileges:

```bash
mongosh -u adminUser -p adminPassword --authenticationDatabase admin
```

## 2. Create Database Roles

Switch to the healthcare database:

```javascript
use healthcare
```

Create roles for each user type:

### Admin Role

```javascript
db.createRole({
  role: "adminRole",
  privileges: [
    { resource: { db: "healthcare", collection: "" }, actions: ["find", "insert", "update", "remove"] }
  ],
  roles: []
})
```

### Doctor Role

```javascript
db.createRole({
  role: "doctorRole",
  privileges: [
    { resource: { db: "healthcare", collection: "patients" }, actions: ["find"] },
    { resource: { db: "healthcare", collection: "doctors" }, actions: ["find", "update"] },
    { resource: { db: "healthcare", collection: "appointments" }, actions: ["find", "insert", "update"] },
    { resource: { db: "healthcare", collection: "slots" }, actions: ["find", "insert", "update", "remove"] },
    { resource: { db: "healthcare", collection: "requisitions" }, actions: ["find", "insert", "update"] },
    { resource: { db: "healthcare", collection: "medical_records" }, actions: ["find", "insert", "update"] },
  ],
  roles: []
})
```

### Patient Role

```javascript
db.createRole({
  role: "patientRole",
  privileges: [
    { resource: { db: "healthcare", collection: "patients" }, actions: ["find", "update"] },
    { resource: { db: "healthcare", collection: "doctors" }, actions: ["find"] },
    { resource: { db: "healthcare", collection: "appointments" }, actions: ["find", "insert", "update"] },
    { resource: { db: "healthcare", collection: "slots" }, actions: ["find"] },
    { resource: { db: "healthcare", collection: "requisitions" }, actions: ["find"] }
  ],
  roles: []
})
```

## 3. Create Users with Appropriate Roles

Create users with the appropriate roles:

### Admin User

```javascript
db.createUser({
  user: "admin_user",
  pwd: "admin_pass",
  roles: [{ role: "adminRole", db: "healthcare" }]
})
```

### Doctor User

```javascript
db.createUser({
  user: "doctor_user",
  pwd: "doctor_pass",
  roles: [{ role: "doctorRole", db: "healthcare" }]
})
```

### Patient User

```javascript
db.createUser({
  user: "patient_user",
  pwd: "patient_pass",
  roles: [{ role: "patientRole", db: "healthcare" }]
})
```

## 4. Update Connection Strings in application.yaml

Update the connection strings in `application.yaml` to use these users:

```yaml
spring:
  data:
    mongodb:
      admin:
        uri: mongodb://admin_user:admin_pass@localhost:27017/healthcare?authSource=admin
      doctor:
        uri: mongodb://doctor_user:doctor_pass@localhost:27017/healthcare?authSource=admin
      patient:
        uri: mongodb://patient_user:patient_pass@localhost:27017/healthcare?authSource=admin
```

## 5. Testing Role Permissions

You can test the permissions for each role by connecting to MongoDB with each user and attempting to perform operations on different collections.

For example, to test the patient user:

```bash
mongosh -u patient_user -p patient_pass --authenticationDatabase admin healthcare
```

Then try operations on different collections to see which ones succeed or fail based on the permissions. 