# ETAPA 1: Compilación (Build)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copiamos el archivo de configuración de Maven
COPY pom.xml .
# Descargamos las dependencias (esto acelera futuros despliegues)
RUN mvn dependency:go-offline
# Copiamos el código fuente
COPY src ./src
# Compilamos y generamos el .jar (saltando los tests para ir más rápido)
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Run)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copiamos solo el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Puerto por defecto de Spring Boot
EXPOSE 8080
# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]