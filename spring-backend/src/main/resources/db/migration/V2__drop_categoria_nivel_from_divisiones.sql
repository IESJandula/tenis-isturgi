-- Flyway: eliminar columnas de categoría y nivel de divisiones

ALTER TABLE divisiones DROP COLUMN IF EXISTS categoria;
ALTER TABLE divisiones DROP COLUMN IF EXISTS nivel;