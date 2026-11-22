-- =============================================================================
-- CENTRO DE MANDO · EJÉRCITO DEL PERÚ
-- SCRIPT MAESTRO DE BASE DE DATOS RELACIONAL (MySQL 8 / MariaDB)
-- Base de datos: ejercito_bd | Motor: InnoDB | Cotejamiento: utf8mb4_unicode_ci
-- =============================================================================
--
-- DIAGRAMA ENTIDAD-RELACIÓN (DER LÓGICO):
--
--  ┌──────────────┐          1 : N         ┌──────────────┐
--  │    RANGOS    │───────────────────────<│   CADETES    │
--  │ (Escalafón)  │                        │ (Efectivos)  │
--  └──────────────┘                        └──────┬───────┘
--         │                                       │
--         │ 1 : N                                 │ 1 : 1 (Al ser aprobado)
--         ▼                                       ▼
--  ┌──────────────┐                        ┌──────────────┐
--  │   RUTINAS    │                        │INCRIPCIONES  │
--  │(Entrenamiento│                        │(Postulantes) │
--  └──────────────┘                        └──────────────┘
--
--  ┌──────────────┐
--  │   EVENTOS    │  (Calendario cívico, ceremonias y maniobras de cuartel)
--  └──────────────┘
--
-- JUSTIFICACIÓN DEL DISEÑO PARA SUSTENTACIÓN:
-- 1. Normalización en 3FN: La tabla 'rangos' separa el escalafón militar para evitar
--    redundancias y garantizar integridad jerárquica (orden numérico del 1 al 12).
-- 2. Integridad Referencial: Claves foráneas (FK) con InnoDB garantizan que no existan
--    cadetes con grados inexistentes.
-- 3. Optimización de Tipos de Datos: CHAR(8) para DNI (longitud fija), TINYINT UNSIGNED
--    para calificaciones (0-100 ahorrando memoria), DECIMAL(5,1) para peso biométrico.
-- =============================================================================

DROP DATABASE IF EXISTS ejercito_bd;
CREATE DATABASE ejercito_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ejercito_bd;

-- -----------------------------------------------------------------------------
-- 1. TABLA: rangos (Catálogo Maestro del Escalafón Militar Oficial)
-- Propósito: Normalizar los grados militares para no repetir cadenas de texto
--            y permitir ordenar a los efectivos por su jerarquía militar (orden 1 al 12).
-- -----------------------------------------------------------------------------
CREATE TABLE rangos (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del rango militar',
  nombre VARCHAR(40) NOT NULL UNIQUE COMMENT 'Denominación oficial (ej. Soldado, Teniente, Coronel)',
  orden TINYINT NOT NULL COMMENT 'Nivel jerárquico del 1 (Soldado) al 12 (General)',
  categoria ENUM('Tropa','Suboficial','Oficial','Oficial Superior','General') NOT NULL COMMENT 'División de carrera militar'
) ENGINE=InnoDB COMMENT='Tabla maestra de grados y jerarquías militares';

-- -----------------------------------------------------------------------------
-- 2. TABLA: cadetes (Efectivos militares activos y ficha de rendimiento)
-- Propósito: Almacena los datos personales, unidad de destino y la evaluación
--            continua en tres dimensiones fundamentales: Físico, Táctico y Disciplina.
-- Relación: MuchosaUno (N:1) con rangos mediante la clave foránea 'rango_id'.
-- -----------------------------------------------------------------------------
CREATE TABLE cadetes (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del cadete',
  nombres VARCHAR(60) NOT NULL COMMENT 'Nombres del efectivo',
  apellidos VARCHAR(80) NOT NULL COMMENT 'Apellidos paterno y materno',
  dni CHAR(8) NOT NULL UNIQUE COMMENT 'DNI de 8 dígitos exactos (clave natural única)',
  rango_id INT NOT NULL COMMENT 'Clave foránea hacia la tabla rangos',
  nivel ENUM('Nuevo','Avanzado') NOT NULL DEFAULT 'Nuevo' COMMENT 'Nivel de instrucción militar',
  fisico TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Nota de aptitud física (escala 0 a 100)',
  tactico TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Nota de instrucción táctica y tiro (escala 0 a 100)',
  disciplina TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Nota de conducta y doctrina (escala 0 a 100)',
  unidad VARCHAR(80) NULL COMMENT 'Batallón, brigada o cuartel asignado',
  fecha_ingreso DATE NULL COMMENT 'Fecha oficial de incorporación a filas',
  imagen VARCHAR(255) NULL COMMENT 'Ruta relativa de la fotografía oficial en /assets',
  CONSTRAINT fk_cadetes_rango FOREIGN KEY (rango_id) REFERENCES rangos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Padrón de efectivos militares activos y calificaciones';

-- -----------------------------------------------------------------------------
-- 3. TABLA: rutinas (Plan de instrucción, doctrina y acondicionamiento)
-- Propósito: Cronograma semanal y diario de actividades formativas militares.
-- Relación: Opcional (N:1) con rangos. Si 'rango_id' es NULL, aplica a todos los grados.
-- -----------------------------------------------------------------------------
CREATE TABLE rutinas (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la rutina',
  titulo VARCHAR(80) NOT NULL COMMENT 'Nombre de la actividad (ej. Tiro de precisión, Pista de obstáculos)',
  tipo ENUM('Entrenamiento físico','Instrucción de combate','Supervivencia') NOT NULL COMMENT 'Eje formativo',
  frecuencia ENUM('Diaria','Semanal') NOT NULL DEFAULT 'Diaria' COMMENT 'Periodicidad de la instrucción',
  dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NULL COMMENT 'Día asignado si es semanal',
  hora TIME NOT NULL COMMENT 'Hora militar de inicio',
  duracion_min SMALLINT NOT NULL DEFAULT 60 COMMENT 'Tiempo de duración en minutos',
  rango_id INT NULL COMMENT 'Grado mínimo requerido (NULL = todos los grados)',
  nivel ENUM('Todos','Nuevo','Avanzado') NOT NULL DEFAULT 'Todos' COMMENT 'Población objetivo',
  descripcion TEXT NULL COMMENT 'Detalles técnicos y doctrina de la actividad',
  imagen VARCHAR(255) NULL COMMENT 'Imagen ilustrativa de la rutina',
  CONSTRAINT fk_rutinas_rango FOREIGN KEY (rango_id) REFERENCES rangos(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Programación de actividades de entrenamiento militar';

-- -----------------------------------------------------------------------------
-- 4. TABLA: eventos (Calendario cívico, maniobras tácticas y ceremonias)
-- Propósito: Registro cronológico de actividades del cuartel y fechas patrias.
-- -----------------------------------------------------------------------------
CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del evento militar',
  titulo VARCHAR(100) NOT NULL COMMENT 'Denominación del evento o maniobra',
  tipo ENUM('Ceremonia','Maniobra','Simulacro','Fecha clave') NOT NULL COMMENT 'Clasificación operativa',
  fecha DATE NOT NULL COMMENT 'Fecha programada de realización',
  hora TIME NULL COMMENT 'Hora militar de concentración',
  lugar VARCHAR(100) NULL COMMENT 'Ubicación física (cuartel, campo de tiro, plaza)',
  descripcion TEXT NULL COMMENT 'Orden de operaciones o reseña del evento',
  imagen VARCHAR(255) NULL COMMENT 'Fotografía o afiche del evento'
) ENGINE=InnoDB COMMENT='Calendario operativo y efemérides militares';

-- -----------------------------------------------------------------------------
-- 5. TABLA: inscripciones (Admisión de nuevos postulantes al servicio)
-- Propósito: Gestiona el proceso de selección y triaje de postulantes civiles.
-- Regla de Negocio:
--   - Si 'eval_medica' = 'Apto', el postulante puede ser promovido mediante una
--     transacción atómica que crea su registro en 'cadetes' y actualiza 'cadete_id'.
-- Relación: Uno a Uno (1:1) opcional con cadetes mediante 'cadete_id'.
-- -----------------------------------------------------------------------------
CREATE TABLE inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del postulante',
  nombres VARCHAR(60) NOT NULL COMMENT 'Nombres del aspirante',
  apellidos VARCHAR(80) NOT NULL COMMENT 'Apellidos del aspirante',
  dni CHAR(8) NOT NULL UNIQUE COMMENT 'DNI de 8 dígitos (evita duplicidad de postulación)',
  fecha_nacimiento DATE NOT NULL COMMENT 'Fecha de nacimiento (validación de mayoría de edad)',
  telefono VARCHAR(15) NULL COMMENT 'Teléfono celular de contacto',
  direccion VARCHAR(120) NULL COMMENT 'Dirección de residencia',
  talla_cm SMALLINT NULL COMMENT 'Estatura en centímetros',
  peso_kg DECIMAL(5,1) NULL COMMENT 'Masa corporal en kilogramos (ej. 68.5)',
  eval_medica ENUM('Pendiente','Apto','Apto con observaciones','No apto') NOT NULL DEFAULT 'Pendiente' COMMENT 'Dictamen de la junta médica',
  eval_fisica TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Puntaje en test físico de admisión (0 a 100)',
  estado ENUM('Pendiente','Aprobado','Rechazado') NOT NULL DEFAULT 'Pendiente' COMMENT 'Estado final de la postulación',
  cadete_id INT NULL COMMENT 'FK hacia cadetes: almacena el ID creado al momento de ser aprobado',
  imagen VARCHAR(255) NULL COMMENT 'Fotografía del postulante',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de registro en el sistema',
  CONSTRAINT fk_inscripciones_cadete FOREIGN KEY (cadete_id) REFERENCES cadetes(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Módulo de admisión y selección de nuevos efectivos';

-- =============================================================================
-- DATOS INICIALES (SEEDS / DATOS DE PRUEBA REALISTAS)
-- =============================================================================

-- 1. Rangos oficiales del Ejército del Perú (ordenados del 1 al 12)
INSERT INTO rangos (nombre, orden, categoria) VALUES
('Soldado', 1, 'Tropa'),
('Cabo', 2, 'Tropa'),
('Sargento Segundo', 3, 'Suboficial'),
('Sargento Primero', 4, 'Suboficial'),
('Suboficial', 5, 'Suboficial'),
('Alférez', 6, 'Oficial'),
('Teniente', 7, 'Oficial'),
('Capitán', 8, 'Oficial'),
('Mayor', 9, 'Oficial Superior'),
('Comandante', 10, 'Oficial Superior'),
('Coronel', 11, 'Oficial Superior'),
('General', 12, 'General');

-- 2. Cadetes activos de muestra con distintos niveles y notas
INSERT INTO cadetes (nombres, apellidos, dni, rango_id, nivel, fisico, tactico, disciplina, unidad, fecha_ingreso, imagen) VALUES
('Luis Alberto', 'Quispe Huamán', '72145830', 1, 'Nuevo', 62, 48, 70, 'Batallón de Instrucción Huánuco', '2026-08-03', '/assets/1873aa71-d347-4342-9724-9137dd9c1b87.jpg'),
('Marco Antonio', 'Rojas Vela', '73301298', 1, 'Nuevo', 71, 55, 66, 'Batallón de Instrucción Huánuco', '2026-08-03', '/assets/cadete-rojas.jpg'),
('Diego Armando', 'Salazar Cruz', '70988412', 2, 'Nuevo', 78, 64, 82, 'Brigada de Montaña N.º 31', '2026-03-15', '/assets/cadete-salazar.jpg'),
('Jhon Edwin', 'Tello Paredes', '71456723', 2, 'Avanzado', 84, 77, 88, 'Brigada de Montaña N.º 31', '2025-02-10', '/assets/cadete-tello.jpg'),
('Carlos Eduardo', 'Mendoza Ríos', '45672301', 3, 'Avanzado', 88, 81, 90, 'Regimiento de Infantería N.º 5', '2023-06-21', '/assets/cadete-mendoza.jpg'),
('Rosa María', 'Vargas Lozano', '46120987', 6, 'Avanzado', 82, 90, 94, 'Escuela Militar de Chorrillos', '2022-01-12', '/assets/cadete-vargas.jpg'),
('Pedro Pablo', 'Castillo Ayala', '41230876', 7, 'Avanzado', 86, 92, 91, 'Escuela Militar de Chorrillos', '2020-09-01', '/assets/cadete-castillo.jpg'),
('Ana Lucía', 'Ferrer Ugarte', '40876512', 8, 'Avanzado', 90, 95, 97, 'Comando de Operaciones', '2017-04-18', '/assets/cadete-ferrer.jpg');

-- 3. Rutinas militares de muestra
INSERT INTO rutinas (titulo, tipo, frecuencia, dia_semana, hora, duracion_min, rango_id, nivel, descripcion, imagen) VALUES
('Diana y acondicionamiento', 'Entrenamiento físico', 'Diaria', NULL, '05:30:00', 90, NULL, 'Todos', 'Trote de 5 km, flexiones, abdominales y barras.', '/assets/rutina-diana.jpg'),
('Pista de obstáculos', 'Entrenamiento físico', 'Semanal', 'Miércoles', '07:00:00', 120, 1, 'Nuevo', 'Circuito con muro, cuerda y túnel para soldados.', '/assets/rutina-obstaculos.jpg'),
('Orden cerrado y manejo de fusil', 'Instrucción de combate', 'Diaria', NULL, '09:00:00', 120, NULL, 'Nuevo', 'Formaciones, posiciones de tiro y desarme del fusil.', '/assets/rutina-orden-cerrado.jpg'),
('Táctica de pequeñas unidades', 'Instrucción de combate', 'Semanal', 'Jueves', '08:00:00', 180, 5, 'Avanzado', 'Planeamiento y conducción de patrullas.', '/assets/rutina-tactica.jpg'),
('Supervivencia en altura', 'Supervivencia', 'Semanal', 'Sábado', '06:00:00', 240, NULL, 'Todos', 'Orientación, refugio y manejo de agua en zona andina.', '/assets/rutina-supervivencia.jpg');

-- 4. Calendario militar y maniobras
INSERT INTO eventos (titulo, tipo, fecha, hora, lugar, descripcion, imagen) VALUES
('Izamiento del Pabellón Nacional', 'Ceremonia', '2026-11-23', '08:00:00', 'Plaza de Armas de Huánuco', 'Formación general de cadetes.', '/assets/evento-izamiento.jpg'),
('Maniobra táctica "Cóndor Andino"', 'Maniobra', '2026-11-27', '05:00:00', 'Campo de instrucción Cayhuayna', 'Patrullaje y asalto con unidades de montaña.', '/assets/esge-noticias-curso-monitor-comando-007.jpg'),
('Simulacro de evacuación y primeros auxilios', 'Simulacro', '2026-12-02', '10:00:00', 'Cuartel Base', 'Participan todos los niveles.', '/assets/evento-simulacro.jpg'),
('Aniversario de la Batalla de Ayacucho', 'Fecha clave', '2026-12-09', NULL, 'Cuartel Base', 'Conmemoración y desfile interno.', '/assets/evento-ayacucho.jpg'),
('Ceremonia de ascensos de fin de año', 'Ceremonia', '2026-12-18', '09:00:00', 'Auditorio Principal', 'Entrega de insignias de ascenso.', '/assets/evento-ascensos.jpg');

-- 5. Postulantes en proceso de selección
INSERT INTO inscripciones (nombres, apellidos, dni, fecha_nacimiento, telefono, direccion, talla_cm, peso_kg, eval_medica, eval_fisica, estado, imagen) VALUES
('Kevin Smith', 'Alvarado Bravo', '75012345', '2007-05-14', '962111222', 'Jr. Dos de Mayo 120, Huánuco', 172, 68.5, 'Apto', 74, 'Pendiente', '/assets/postulante-alvarado.jpg'),
('Yeni Milagros', 'Aguirre Soto', '75234109', '2006-11-02', '962333444', 'Av. Universitaria 450, Huánuco', 165, 58.0, 'Apto con observaciones', 69, 'Pendiente', '/assets/postulante-aguirre.jpg'),
('Brayan Josué', 'Lara Espinoza', '74890123', '2007-01-27', '962555666', 'Pasaje Los Pinos 8, Amarilis', 175, 72.0, 'Pendiente', 0, 'Pendiente', '/assets/postulante-lara.jpg'),
('Walter', 'Cóndor Mejía', '74321098', '2006-08-09', '962777888', 'Calle Huallayco 33, Huánuco', 160, 80.0, 'No apto', 40, 'Rechazado', '/assets/postulante-condor.jpg');
