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
2. Start and run a MongoDB container:  
    `docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=pass mongodb/mongodb-community-server:$MONGODB_VERSION`
3. Configure the connection uri in `application.yaml` to use your own Mongo credentials 
4. Run the backend:  
   `./mvnw spring-boot:run`  
   *(or `mvn spring-boot:run` if you have Maven installed)*
5. Run the frontend:   
   `cd /client`   
   `npm run dev`
6. Insert example data:   
   `cd /script`   
   `node insertData.js`


 