# Healthcare system

### Tech Stack
- Frontend: React + Mantine
- Backend: Spring Boot
- Database: MongoDB

### Get Started
#### Prerequisites
- [Docker desktop](https://www.docker.com/)
- [Node.js](https://nodejs.org/en)

1. Clone the repository:   
   `git clone git@github.com:eric3318/dbms-healthcare.git`
2. Generate a key file on your host machine:  
   - `openssl rand -base64 756 > mongo-keyfile
    chmod 400 mongo-keyfile`
3. Start and run a MongoDB container (note that root credentials must be set to enable authorization):  
   - `docker run -d 
  --name mongodb 
  -p 27017:27017 
  -v $(pwd)/mongo-keyfile:/etc/mongo-keyfile:ro 
  -v mongo_data:/data/db 
  -e MONGO_INITDB_ROOT_USERNAME=user 
  -e MONGO_INITDB_ROOT_PASSWORD=pass 
  mongo:latest 
  --replSet rs0 
  --auth 
  --keyFile /etc/mongo-keyfile`
4. Connect to the mongodb container, initiate replica set and switch to healthcare db  
`docker exec -it mongodb mongosh -u user -p pass --authenticationDatabase admin`
`rs.initiate()`
`use healthcare`
5. Create the roles
   ```javascript
   db.createRole({
     role: "adminRole",
     privileges: [
       { resource: { db: "healthcare", collection: "" }, actions: ["find", "insert", "update", "remove"] }
     ],
     roles: []
   })
   ```

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
       { resource: { db: "healthcare", collection: "users" }, actions: ["find", "update"] }
     ],
     roles: []
   })
   ```

   ```javascript
   db.createRole({
     role: "patientRole",
     privileges: [
       { resource: { db: "healthcare", collection: "patients" }, actions: ["find", "update"] },
       { resource: { db: "healthcare", collection: "doctors" }, actions: ["find"] },
       { resource: { db: "healthcare", collection: "appointments" }, actions: ["find", "insert", "update"] },
       { resource: { db: "healthcare", collection: "slots" }, actions: ["find", "update"] },
       { resource: { db: "healthcare", collection: "requisitions" }, actions: ["find"] },
       { resource: { db: "healthcare", collection: "users" }, actions: ["find", "update"] }
     ],
     roles: []
   })
   ```
6. Assign roles to user
   ```javascript
   db.createUser({
     user: "admin_user",
     pwd: "admin_pass",
     roles: [{ role: "adminRole", db: "healthcare" }]
   })
   ```
   ```javascript
   db.createUser({
   user: "doctor_user",
   pwd: "doctor_pass",
   roles: [{ role: "doctorRole", db: "healthcare" }]
   })
   ```

   ```javascript
   db.createUser({
     user: "patient_user",
     pwd: "patient_pass",
     roles: [{ role: "patientRole", db: "healthcare" }]
   })
   ```

7. Configure the connection uri in `application.yaml` to use your own Mongo credentials
8. Switch off security temporarily
   `In backend code /src/main/java/org/dbms/dbmshealthcare/security/SecurityConfig.java`
   `and /src/main/java/org/dbms/dbmshealthcare/controller/AuthController.java`
   `comment out code as instructed`
9. Run the backend:  
   `./mvnw spring-boot:run`  
   *(or `mvn spring-boot:run` if you have Maven installed)*
10. Run the frontend:   
    `cd /client`
    `npm install`  
    `npm run dev`
11. Insert example data:   
    `cd /script`   
    `npm install`  
    `node insertData.js`
12. Uncomment the code and restart the backend
13. REST APIs  
    - The application uses [`springdoc-openapi`](https://springdoc.org/) to automatically generate [OpenAPI-compliant](https://swagger.io/specification/) documentation via Swagger UI.  
    - You can view and test all endpoints here: [http://localhost:8080/swagger-ui/index.html#/](http://localhost:8080/swagger-ui/index.html#/)
14. [See the frontend](http://localhost:5173/)
   


 
