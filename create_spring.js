const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'spring-backend');

// Directorios base de Maven/Spring
const dirs = [
  'src/main/java/com/isturgi/backend/controllers',
  'src/main/java/com/isturgi/backend/models',
  'src/main/java/com/isturgi/backend/repositories',
  'src/main/java/com/isturgi/backend/security',
  'src/main/java/com/isturgi/backend/services',
  'src/main/resources'
];

// Crear directorios iterativamente
dirs.forEach(dir => {
  const fullPath = path.join(basePath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Escribir pom.xml
const pomContent = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.4.1</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.isturgi</groupId>
	<artifactId>backend</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>backend</name>
	<description>Backend Club Tenis Isturgi</description>
	<properties>
		<java.version>21</java.version>
	</properties>
	<dependencies>
		<!-- Web -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<!-- Base de Datos (JPA + MySQL) -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<scope>runtime</scope>
		</dependency>
		<!-- Seguridad / Auth -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<!-- Firebase Admin SDK para validar JWT -->
		<dependency>
			<groupId>com.google.firebase</groupId>
			<artifactId>firebase-admin</artifactId>
			<version>9.4.1</version>
		</dependency>
		<!-- Utilidades -->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
	</dependencies>
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
`;

fs.writeFileSync(path.join(basePath, 'pom.xml'), pomContent);

// Escribir application.properties
const propsContent = `spring.application.name=backend
server.port=8080

# MySQL Config (XAMPP default)
spring.datasource.url=jdbc:mysql://localhost:3306/tenis_isturgi?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate ddl-auto
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
`;

fs.writeFileSync(path.join(basePath, 'src/main/resources/application.properties'), propsContent);

// Escribir Application.java main class
const mainClassContent = `package com.isturgi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
`;

fs.writeFileSync(path.join(basePath, 'src/main/java/com/isturgi/backend/BackendApplication.java'), mainClassContent);

console.log("¡Proyecto Spring Boot inicializado con éxito localmente!");
