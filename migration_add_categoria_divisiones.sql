-- Migración: Añadir columna categoria a tabla divisiones
ALTER TABLE divisiones ADD COLUMN categoria VARCHAR(100) DEFAULT 'Absoluto';
