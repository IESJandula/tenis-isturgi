-- Base de datos: tenis_isturgi

CREATE DATABASE IF NOT EXISTS tenis_isturgi DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tenis_isturgi;

-- Tablas principales
CREATE TABLE IF NOT EXISTS temporadas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS divisiones (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  temporada_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (temporada_id) REFERENCES temporadas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS jornadas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  numero INT,
  division_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (division_id) REFERENCES divisiones(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS jugadores (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255),
  telefono VARCHAR(255),
  email VARCHAR(255),
  contrasena VARCHAR(255),
  foto VARCHAR(500),
  firebase_uid VARCHAR(255) UNIQUE COMMENT 'ID generado por Google Firebase para login',
  division_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (division_id) REFERENCES divisiones(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS torneos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  estado VARCHAR(100),
  categoria VARCHAR(100),
  descripcion TEXT,
  cartel VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS noticias (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT,
  fecha_publicacion DATE,
  imagen VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Registros semilla de prueba
INSERT IGNORE INTO temporadas (id, nombre) VALUES (1, 'Primavera 2026');
INSERT IGNORE INTO divisiones (id, nombre, temporada_id) VALUES (1, 'Primera División', 1);
INSERT IGNORE INTO jornadas (id, nombre, numero, division_id) VALUES (1, 'Jornada 1', 1, 1);
INSERT IGNORE INTO jugadores (id, nombre, apellidos, email, firebase_uid, division_id) 
VALUES (1, 'Admin', 'Root', 'admin@isturgi.com', NULL, 1);
