FROM maven:3.9.11-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["bash", "-lc", "for i in {1..90}; do (echo > /dev/tcp/db/3306) >/dev/null 2>&1 && break; echo 'Waiting for db:3306...'; sleep 2; done; exec java -jar /app/app.jar"]
