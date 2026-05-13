# ETAPA 1: Compilación (Build)
# Cambiamos temurin-17 por temurin-21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
# Compilamos y generamos el .jar
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Run)
# Cambiamos temurin:17 por temurin:21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]