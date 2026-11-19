DROP DATABASE IF EXISTS ejercito_bd;
CREATE DATABASE ejercito_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ejercito_bd;

CREATE TABLE rangos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  orden TINYINT NOT NULL,
  categoria ENUM('Tropa','Suboficial','Oficial','Oficial Superior','General') NOT NULL
);

CREATE TABLE cadetes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(60) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  dni CHAR(8) NOT NULL UNIQUE,
  rango_id INT NOT NULL,
  nivel ENUM('Nuevo','Avanzado') NOT NULL DEFAULT 'Nuevo',
  fisico TINYINT UNSIGNED NOT NULL DEFAULT 0,
  tactico TINYINT UNSIGNED NOT NULL DEFAULT 0,
  disciplina TINYINT UNSIGNED NOT NULL DEFAULT 0,
  unidad VARCHAR(80),
  fecha_ingreso DATE,
  imagen VARCHAR(255) NULL,
  FOREIGN KEY (rango_id) REFERENCES rangos(id)
);

CREATE TABLE rutinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(80) NOT NULL,
  tipo ENUM('Entrenamiento físico','Instrucción de combate','Supervivencia') NOT NULL,
  frecuencia ENUM('Diaria','Semanal') NOT NULL DEFAULT 'Diaria',
  dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NULL,
  hora TIME NOT NULL,
  duracion_min SMALLINT NOT NULL DEFAULT 60,
  rango_id INT NULL,
  nivel ENUM('Todos','Nuevo','Avanzado') NOT NULL DEFAULT 'Todos',
  descripcion TEXT,
  imagen VARCHAR(255) NULL,
  FOREIGN KEY (rango_id) REFERENCES rangos(id) ON DELETE SET NULL
);

CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  tipo ENUM('Ceremonia','Maniobra','Simulacro','Fecha clave') NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NULL,
  lugar VARCHAR(100),
  descripcion TEXT,
  imagen VARCHAR(255) NULL
);

CREATE TABLE inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(60) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  dni CHAR(8) NOT NULL UNIQUE,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(15),
  direccion VARCHAR(120),
  talla_cm SMALLINT,
  peso_kg DECIMAL(5,1),
  eval_medica ENUM('Pendiente','Apto','Apto con observaciones','No apto') NOT NULL DEFAULT 'Pendiente',
  eval_fisica TINYINT UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('Pendiente','Aprobado','Rechazado') NOT NULL DEFAULT 'Pendiente',
  cadete_id INT NULL,
  imagen VARCHAR(255) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cadete_id) REFERENCES cadetes(id) ON DELETE SET NULL
);

INSERT INTO rangos (nombre, orden, categoria) VALUES
('Soldado',1,'Tropa'),('Cabo',2,'Tropa'),('Sargento Segundo',3,'Suboficial'),
('Sargento Primero',4,'Suboficial'),('Suboficial',5,'Suboficial'),('Alférez',6,'Oficial'),
('Teniente',7,'Oficial'),('Capitán',8,'Oficial'),('Mayor',9,'Oficial Superior'),
('Comandante',10,'Oficial Superior'),('Coronel',11,'Oficial Superior'),('General',12,'General');

INSERT INTO cadetes (nombres,apellidos,dni,rango_id,nivel,fisico,tactico,disciplina,unidad,fecha_ingreso) VALUES
('Luis Alberto','Quispe Huamán','72145830',1,'Nuevo',62,48,70,'Batallón de Instrucción Huánuco','2026-08-03'),
('Marco Antonio','Rojas Vela','73301298',1,'Nuevo',71,55,66,'Batallón de Instrucción Huánuco','2026-08-03'),
('Diego Armando','Salazar Cruz','70988412',2,'Nuevo',78,64,82,'Brigada de Montaña N.º 31','2026-03-15'),
('Jhon Edwin','Tello Paredes','71456723',2,'Avanzado',84,77,88,'Brigada de Montaña N.º 31','2025-02-10'),
('Carlos Eduardo','Mendoza Ríos','45672301',3,'Avanzado',88,81,90,'Regimiento de Infantería N.º 5','2023-06-21'),
('Rosa María','Vargas Lozano','46120987',6,'Avanzado',82,90,94,'Escuela Militar de Chorrillos','2022-01-12'),
('Pedro Pablo','Castillo Ayala','41230876',7,'Avanzado',86,92,91,'Escuela Militar de Chorrillos','2020-09-01'),
('Ana Lucía','Ferrer Ugarte','40876512',8,'Avanzado',90,95,97,'Comando de Operaciones','2017-04-18');

INSERT INTO rutinas (titulo,tipo,frecuencia,dia_semana,hora,duracion_min,rango_id,nivel,descripcion) VALUES
('Diana y acondicionamiento','Entrenamiento físico','Diaria',NULL,'05:30:00',90,NULL,'Todos','Trote de 5 km, flexiones, abdominales y barras.'),
('Pista de obstáculos','Entrenamiento físico','Semanal','Miércoles','07:00:00',120,1,'Nuevo','Circuito con muro, cuerda y túnel para soldados.'),
('Orden cerrado y manejo de fusil','Instrucción de combate','Diaria',NULL,'09:00:00',120,NULL,'Nuevo','Formaciones, posiciones de tiro y desarme del fusil.'),
('Táctica de pequeñas unidades','Instrucción de combate','Semanal','Jueves','08:00:00',180,5,'Avanzado','Planeamiento y conducción de patrullas.'),
('Supervivencia en altura','Supervivencia','Semanal','Sábado','06:00:00',240,NULL,'Todos','Orientación, refugio y manejo de agua en zona andina.');

INSERT INTO eventos (titulo,tipo,fecha,hora,lugar,descripcion) VALUES
('Izamiento del Pabellón Nacional','Ceremonia','2026-11-23','08:00:00','Plaza de Armas de Huánuco','Formación general de cadetes.'),
('Maniobra táctica "Cóndor Andino"','Maniobra','2026-11-27','05:00:00','Campo de instrucción Cayhuayna','Patrullaje y asalto con unidades de montaña.'),
('Simulacro de evacuación y primeros auxilios','Simulacro','2026-12-02','10:00:00','Cuartel Base','Participan todos los niveles.'),
('Aniversario de la Batalla de Ayacucho','Fecha clave','2026-12-09',NULL,'Cuartel Base','Conmemoración y desfile interno.'),
('Ceremonia de ascensos de fin de año','Ceremonia','2026-12-18','09:00:00','Auditorio Principal','Entrega de insignias de ascenso.');

INSERT INTO inscripciones (nombres,apellidos,dni,fecha_nacimiento,telefono,direccion,talla_cm,peso_kg,eval_medica,eval_fisica,estado) VALUES
('Kevin Smith','Alvarado Bravo','75012345','2007-05-14','962111222','Jr. Dos de Mayo 120, Huánuco',172,68.5,'Apto',74,'Pendiente'),
('Yeni Milagros','Aguirre Soto','75234109','2006-11-02','962333444','Av. Universitaria 450, Huánuco',165,58.0,'Apto con observaciones',69,'Pendiente'),
('Brayan Josué','Lara Espinoza','74890123','2007-01-27','962555666','Pasaje Los Pinos 8, Amarilis',175,72.0,'Pendiente',0,'Pendiente'),
('Walter','Cóndor Mejía','74321098','2006-08-09','962777888','Calle Huallayco 33, Huánuco',160,80.0,'No apto',40,'Rechazado');
