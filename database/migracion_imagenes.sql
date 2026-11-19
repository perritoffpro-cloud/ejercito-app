-- Ejecutar SOLO si ya tenías la base ejercito_bd creada con la versión anterior
-- (agrega la columna de imagen sin borrar tus datos).
USE ejercito_bd;
ALTER TABLE cadetes       ADD COLUMN imagen VARCHAR(255) NULL;
ALTER TABLE rutinas       ADD COLUMN imagen VARCHAR(255) NULL;
ALTER TABLE eventos       ADD COLUMN imagen VARCHAR(255) NULL;
ALTER TABLE inscripciones ADD COLUMN imagen VARCHAR(255) NULL;
