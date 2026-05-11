-- Migración Flyway: Añadir columnas categoria y nivel a tabla divisiones (requeridas)
-- Esta migración se ejecuta automáticamente al iniciar Spring Boot

ALTER TABLE divisiones ADD COLUMN IF NOT EXISTS categoria VARCHAR(100) DEFAULT 'Absoluto';
ALTER TABLE divisiones ADD COLUMN IF NOT EXISTS nivel VARCHAR(100) DEFAULT 'Medio';

-- Rellenar valores NULL con defaults
UPDATE divisiones SET categoria = 'Absoluto' WHERE categoria IS NULL;
UPDATE divisiones SET nivel = 'Medio' WHERE nivel IS NULL;

-- Hacer columnas NOT NULL
ALTER TABLE divisiones MODIFY COLUMN categoria VARCHAR(100) NOT NULL DEFAULT 'Absoluto';
ALTER TABLE divisiones MODIFY COLUMN nivel VARCHAR(100) NOT NULL DEFAULT 'Medio';
