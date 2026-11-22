-- =============================================================================
-- SISTEMA : CENTRO DE MANDO Y CONTROL OPERATIVO · EJÉRCITO DEL PERÚ
-- ESQUEMA : ejercito_bd (Relacional Enterprise)
-- MOTOR   : MySQL 8.0+ / MariaDB 10.4+ (InnoDB Engine)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------------------------------
-- 1. ESTRUCTURA Y COTEJAMIENTO DEL ESQUEMA
-- -----------------------------------------------------------------------------
DROP DATABASE IF EXISTS ejercito_bd;
CREATE DATABASE ejercito_bd 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE ejercito_bd;

-- =============================================================================
-- 2. DDL: TABLAS MAESTRAS Y OPERATIVAS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TABLA 1: rangos (Escalafón Militar Oficial)
-- -----------------------------------------------------------------------------
CREATE TABLE rangos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(40) NOT NULL,
  orden       TINYINT UNSIGNED NOT NULL,
  categoria   ENUM('Tropa', 'Suboficial', 'Oficial', 'Oficial Superior', 'General') NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_rangos_nombre (nombre),
  UNIQUE KEY uq_rangos_orden (orden)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 2: cadetes (Efectivos Militares en Servicio y Rendimiento)
-- -----------------------------------------------------------------------------
CREATE TABLE cadetes (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombres       VARCHAR(60) NOT NULL,
  apellidos     VARCHAR(80) NOT NULL,
  dni           CHAR(8) NOT NULL,
  rango_id      INT UNSIGNED NOT NULL,
  nivel         ENUM('Nuevo', 'Avanzado') NOT NULL DEFAULT 'Nuevo',
  fisico        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  tactico       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  disciplina    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  unidad        VARCHAR(80) NULL DEFAULT 'Centro de Instrucción',
  fecha_ingreso DATE NOT NULL DEFAULT (CURRENT_DATE),
  imagen        VARCHAR(255) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cadetes_dni (dni),
  KEY idx_cadetes_rango (rango_id),
  KEY idx_cadetes_nivel (nivel),
  KEY idx_cadetes_apellidos (apellidos, nombres),

  CONSTRAINT fk_cadetes_rango FOREIGN KEY (rango_id) 
    REFERENCES rangos (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_cadetes_dni CHECK (dni REGEXP '^[0-9]{8}$'),
  CONSTRAINT chk_cadetes_fisico CHECK (fisico BETWEEN 0 AND 100),
  CONSTRAINT chk_cadetes_tactico CHECK (tactico BETWEEN 0 AND 100),
  CONSTRAINT chk_cadetes_disciplina CHECK (disciplina BETWEEN 0 AND 100)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 3: rutinas (Plan de Instrucción, Doctrina y Entrenamiento Táctico)
-- -----------------------------------------------------------------------------
CREATE TABLE rutinas (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo       VARCHAR(80) NOT NULL,
  tipo         ENUM('Entrenamiento físico', 'Instrucción de combate', 'Supervivencia') NOT NULL,
  frecuencia   ENUM('Diaria', 'Semanal') NOT NULL DEFAULT 'Diaria',
  dia_semana   ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NULL,
  hora         TIME NOT NULL,
  duracion_min SMALLINT UNSIGNED NOT NULL DEFAULT 60,
  rango_id     INT UNSIGNED NULL,
  nivel        ENUM('Todos', 'Nuevo', 'Avanzado') NOT NULL DEFAULT 'Todos',
  descripcion  TEXT NULL,
  imagen       VARCHAR(255) NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_rutinas_rango (rango_id),
  KEY idx_rutinas_filtro (tipo, nivel),
  KEY idx_rutinas_cronograma (frecuencia, dia_semana, hora),

  CONSTRAINT fk_rutinas_rango FOREIGN KEY (rango_id) 
    REFERENCES rangos (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_rutinas_duracion CHECK (duracion_min BETWEEN 10 AND 720)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 4: eventos (Maniobras Operativas, Simulacros y Calendario Cívico)
-- -----------------------------------------------------------------------------
CREATE TABLE eventos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo      VARCHAR(100) NOT NULL,
  tipo        ENUM('Ceremonia', 'Maniobra', 'Simulacro', 'Fecha clave') NOT NULL,
  fecha       DATE NOT NULL,
  hora        TIME NULL,
  lugar       VARCHAR(100) NULL,
  descripcion TEXT NULL,
  imagen      VARCHAR(255) NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_eventos_fecha_hora (fecha, hora),
  KEY idx_eventos_tipo (tipo)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 5: inscripciones (Admisión, Evaluación Biocientífica y Triaje Médico)
-- -----------------------------------------------------------------------------
CREATE TABLE inscripciones (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombres          VARCHAR(60) NOT NULL,
  apellidos        VARCHAR(80) NOT NULL,
  dni              CHAR(8) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono         VARCHAR(15) NULL,
  direccion        VARCHAR(120) NULL,
  talla_cm         SMALLINT UNSIGNED NULL,
  peso_kg          DECIMAL(5,1) UNSIGNED NULL,
  eval_medica      ENUM('Pendiente', 'Apto', 'Apto con observaciones', 'No apto') NOT NULL DEFAULT 'Pendiente',
  eval_fisica      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  estado           ENUM('Pendiente', 'Aprobado', 'Rechazado') NOT NULL DEFAULT 'Pendiente',
  cadete_id        INT UNSIGNED NULL,
  imagen           VARCHAR(255) NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_inscripciones_dni (dni),
  UNIQUE KEY uq_inscripciones_cadete (cadete_id),
  KEY idx_inscripciones_estado (estado),
  KEY idx_inscripciones_triaje (eval_medica, eval_fisica),

  CONSTRAINT fk_inscripciones_cadete FOREIGN KEY (cadete_id) 
    REFERENCES cadetes (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_inscripciones_dni CHECK (dni REGEXP '^[0-9]{8}$'),
  CONSTRAINT chk_inscripciones_talla CHECK (talla_cm IS NULL OR talla_cm BETWEEN 120 AND 230),
  CONSTRAINT chk_inscripciones_peso CHECK (peso_kg IS NULL OR peso_kg BETWEEN 35.0 AND 200.0),
  CONSTRAINT chk_inscripciones_eval_fisica CHECK (eval_fisica BETWEEN 0 AND 100)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 3. VISTAS SQL (BUSINESS INTELLIGENCE & REPORTING OPERATIVO)
-- =============================================================================

-- Vista 1: Escalafón y Desempeño Integral de Cadetes
CREATE OR REPLACE VIEW vw_cadetes_escalafon AS
SELECT 
  c.id,
  c.dni,
  CONCAT(c.apellidos, ', ', c.nombres) AS efectivo_militar,
  r.nombre AS grado_militar,
  r.categoria,
  r.orden AS orden_jerarquico,
  c.nivel,
  c.unidad,
  c.fisico,
  c.tactico,
  c.disciplina,
  ROUND((c.fisico + c.tactico + c.disciplina) / 3.0, 1) AS promedio_general,
  CASE 
    WHEN ROUND((c.fisico + c.tactico + c.disciplina) / 3.0, 1) >= 85 THEN 'Sobresaliente / Apto Ascenso'
    WHEN ROUND((c.fisico + c.tactico + c.disciplina) / 3.0, 1) >= 70 THEN 'Regular'
    ELSE 'Requiere Refuerzo'
  END AS condicion_operativa,
  c.fecha_ingreso,
  c.imagen
FROM cadetes c
INNER JOIN rangos r ON r.id = c.rango_id;

-- Vista 2: Tablero Estadístico del Centro de Mando
CREATE OR REPLACE VIEW vw_estadisticas_mando AS
SELECT
  COUNT(*) AS total_efectivos,
  SUM(CASE WHEN nivel = 'Nuevo' THEN 1 ELSE 0 END) AS cadetes_nuevos,
  SUM(CASE WHEN nivel = 'Avanzado' THEN 1 ELSE 0 END) AS cadetes_avanzados,
  ROUND(AVG(fisico), 1) AS promedio_fisico_global,
  ROUND(AVG(tactico), 1) AS promedio_tactico_global,
  ROUND(AVG(disciplina), 1) AS promedio_disciplina_global
FROM cadetes;

-- Vista 3: Postulantes con Dictamen Médico Apto
CREATE OR REPLACE VIEW vw_postulantes_aptos AS
SELECT
  id,
  dni,
  CONCAT(apellidos, ', ', nombres) AS postulante,
  fecha_nacimiento,
  TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS edad_anios,
  telefono,
  talla_cm,
  peso_kg,
  eval_medica,
  eval_fisica,
  estado,
  created_at
FROM inscripciones
WHERE eval_medica LIKE 'Apto%' AND estado = 'Pendiente';

-- =============================================================================
-- 4. DML: CARGA DE DATOS INICIALES (SEEDS NORMALIZADOS)
-- =============================================================================

-- 1. Rangos Militares Oficiales del Ejército del Perú
INSERT INTO rangos (id, nombre, orden, categoria) VALUES
(1,  'Soldado',           1,  'Tropa'),
(2,  'Cabo',              2,  'Tropa'),
(3,  'Sargento Segundo',  3,  'Suboficial'),
(4,  'Sargento Primero',  4,  'Suboficial'),
(5,  'Suboficial',        5,  'Suboficial'),
(6,  'Alférez',           6,  'Oficial'),
(7,  'Teniente',          7,  'Oficial'),
(8,  'Capitán',           8,  'Oficial'),
(9,  'Mayor',             9,  'Oficial Superior'),
(10, 'Comandante',        10, 'Oficial Superior'),
(11, 'Coronel',           11, 'Oficial Superior'),
(12, 'General',           12, 'General');

-- 2. Efectivos Militares Activos
INSERT INTO cadetes (id, nombres, apellidos, dni, rango_id, nivel, fisico, tactico, disciplina, unidad, fecha_ingreso, imagen) VALUES
(1, 'Luis Alberto',   'Quispe Huamán',  '72145830', 1, 'Nuevo',    62, 48, 70, 'Batallón de Instrucción Huánuco', '2026-08-03', '/assets/1873aa71-d347-4342-9724-9137dd9c1b87.jpg'),
(2, 'Marco Antonio',  'Rojas Vela',     '73301298', 1, 'Nuevo',    71, 55, 66, 'Batallón de Instrucción Huánuco', '2026-08-03', '/assets/cadete-rojas.jpg'),
(3, 'Diego Armando',  'Salazar Cruz',   '70988412', 2, 'Nuevo',    78, 64, 82, 'Brigada de Montaña N.º 31',       '2026-03-15', '/assets/cadete-salazar.jpg'),
(4, 'Jhon Edwin',     'Tello Paredes',  '71456723', 2, 'Avanzado', 84, 77, 88, 'Brigada de Montaña N.º 31',       '2025-02-10', '/assets/cadete-tello.jpg'),
(5, 'Carlos Eduardo', 'Mendoza Ríos',   '45672301', 3, 'Avanzado', 88, 81, 90, 'Regimiento de Infantería N.º 5',  '2023-06-21', '/assets/cadete-mendoza.jpg'),
(6, 'Rosa María',     'Vargas Lozano',  '46120987', 6, 'Avanzado', 82, 90, 94, 'Escuela Militar de Chorrillos',   '2022-01-12', '/assets/cadete-vargas.jpg'),
(7, 'Pedro Pablo',    'Castillo Ayala', '41230876', 7, 'Avanzado', 86, 92, 91, 'Escuela Militar de Chorrillos',   '2020-09-01', '/assets/cadete-castillo.jpg'),
(8, 'Ana Lucía',      'Ferrer Ugarte',  '40876512', 8, 'Avanzado', 90, 95, 97, 'Comando de Operaciones',         '2017-04-18', '/assets/cadete-ferrer.jpg');

-- 3. Rutinas de Entrenamiento Táctico y Operativo
INSERT INTO rutinas (id, titulo, tipo, frecuencia, dia_semana, hora, duracion_min, rango_id, nivel, descripcion, imagen) VALUES
(1, 'Diana y acondicionamiento',      'Entrenamiento físico',  'Diaria',  NULL,        '05:30:00', 90,  NULL, 'Todos',    'Trote de 5 km, flexiones, abdominales y barras.', '/assets/rutina-diana.jpg'),
(2, 'Pista de obstáculos',            'Entrenamiento físico',  'Semanal', 'Miércoles', '07:00:00', 120, 1,    'Nuevo',    'Circuito con muro, cuerda y túnel para soldados.', '/assets/rutina-obstaculos.jpg'),
(3, 'Orden cerrado y manejo de fusil', 'Instrucción de combate','Diaria',  NULL,        '09:00:00', 120, NULL, 'Nuevo',    'Formaciones, posiciones de tiro y desarme del fusil.', '/assets/rutina-orden-cerrado.jpg'),
(4, 'Táctica de pequeñas unidades',   'Instrucción de combate','Semanal', 'Jueves',    '08:00:00', 180, 5,    'Avanzado', 'Planeamiento y conducción de patrullas.', '/assets/rutina-tactica.jpg'),
(5, 'Supervivencia en altura',        'Supervivencia',         'Semanal', 'Sábado',    '06:00:00', 240, NULL, 'Todos',    'Orientación, refugio y manejo de agua en zona andina.', '/assets/rutina-supervivencia.jpg');

-- 4. Eventos y Calendario de Maniobras
INSERT INTO eventos (id, titulo, tipo, fecha, hora, lugar, descripcion, imagen) VALUES
(1, 'Izamiento del Pabellón Nacional',             'Ceremonia',   '2026-11-23', '08:00:00', 'Plaza de Armas de Huánuco',     'Formación general de cadetes.', '/assets/evento-izamiento.jpg'),
(2, 'Maniobra táctica "Cóndor Andino"',            'Maniobra',    '2026-11-27', '05:00:00', 'Campo de instrucción Cayhuayna', 'Patrullaje y asalto con unidades de montaña.', '/assets/esge-noticias-curso-monitor-comando-007.jpg'),
(3, 'Simulacro de evacuación y primeros auxilios', 'Simulacro',   '2026-12-02', '10:00:00', 'Cuartel Base',                  'Participan todos los niveles.', '/assets/evento-simulacro.jpg'),
(4, 'Aniversario de la Batalla de Ayacucho',       'Fecha clave', '2026-12-09', NULL,       'Cuartel Base',                  'Conmemoración y desfile interno.', '/assets/evento-ayacucho.jpg'),
(5, 'Ceremonia de ascensos de fin de año',         'Ceremonia',   '2026-12-18', '09:00:00', 'Auditorio Principal',           'Entrega de insignias de ascenso.', '/assets/evento-ascensos.jpg');

-- 5. Postulantes en Selección
INSERT INTO inscripciones (id, nombres, apellidos, dni, fecha_nacimiento, telefono, direccion, talla_cm, peso_kg, eval_medica, eval_fisica, estado, imagen) VALUES
(1, 'Kevin Smith',   'Alvarado Bravo', '75012345', '2007-05-14', '962111222', 'Jr. Dos de Mayo 120, Huánuco', 172, 68.5, 'Apto',                   74, 'Pendiente', '/assets/postulante-alvarado.jpg'),
(2, 'Yeni Milagros', 'Aguirre Soto',   '75234109', '2006-11-02', '962333444', 'Av. Universitaria 450, Huánuco',165, 58.0, 'Apto con observaciones',   69, 'Pendiente', '/assets/postulante-aguirre.jpg'),
(3, 'Brayan Josué',  'Lara Espinoza',  '74890123', '2007-01-27', '962555666', 'Pasaje Los Pinos 8, Amarilis', 175, 72.0, 'Pendiente',              0,  'Pendiente', '/assets/postulante-lara.jpg'),
(4, 'Walter',        'Cóndor Mejía',   '74321098', '2006-08-09', '962777888', 'Calle Huallayco 33, Huánuco',   160, 80.0, 'No apto',                 40, 'Rechazado', '/assets/postulante-condor.jpg');
