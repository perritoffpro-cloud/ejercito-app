# Centro de Mando · Ejército del Perú
Sistema web Full-Stack con arquitectura **MVC (Modelo - Vista - Controlador)** para la gestión táctica de cadetes, rutinas de entrenamiento, eventos institucionales y admisiones del Ejército del Perú.

---

## 🏛️ Arquitectura Técnica del Proyecto

El sistema está estructurado bajo las mejores prácticas de la industria de software, separando el **Backend (API RESTful en capas)** y el **Frontend (SPA React con Vite)**:

```text
ejercito-app/
│
├── backend/                       # 🟢 SERVIDOR Y API REST (Arquitectura MVC)
│   ├── src/
│   │   ├── config/                # Configuración de base de datos y entorno
│   │   │   └── db.js              # Pool de conexiones persistentes MySQL2
│   │   ├── models/                # Capa de Acceso a Datos (Consultas SQL parametrizadas)
│   │   │   ├── cadeteModel.js
│   │   │   ├── rutinaModel.js
│   │   │   ├── eventoModel.js
│   │   │   ├── inscripcionModel.js # Transacciones ACID con bloqueo FOR UPDATE
│   │   │   └── rangoModel.js
│   │   ├── controllers/           # Capa de Lógica de Negocio y manejo HTTP (req, res)
│   │   │   ├── cadeteController.js
│   │   │   ├── rutinaController.js
│   │   │   ├── eventoController.js
│   │   │   ├── inscripcionController.js
│   │   │   ├── rangoController.js
│   │   │   └── uploadController.js
│   │   ├── routes/                # Capa de Enrutamiento RESTful
│   │   │   ├── cadeteRoutes.js
│   │   │   ├── rutinaRoutes.js
│   │   │   ├── eventoRoutes.js
│   │   │   ├── inscripcionRoutes.js
│   │   │   ├── rangoRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   └── index.js           # Agrupador maestro (/api/...)
│   │   ├── middlewares/           # Middlewares globales
│   │   │   └── errorHandler.js    # Manejador centralizado de errores
│   │   ├── utils/                 # Utilidades del servidor
│   │   │   └── fileManager.js     # Eliminación de imágenes huérfanas en disco
│   │   ├── app.js                 # Configuración de Express, CORS y estáticos
│   │   └── server.js              # Punto de arranque HTTP (Puerto 3000)
│   ├── package.json
│   └── .env
│
├── frontend/                      # 🔵 CLIENTE WEB (React 18 + Vite)
│   ├── src/
│   │   ├── components/            # Componentes visuales reutilizables
│   │   │   ├── Icons.jsx          # Iconografía SVG
│   │   │   └── UI.jsx             # Tarjetas, modales, badges, formularios
│   │   ├── pages/                 # Vistas principales del sistema
│   │   │   ├── Dashboard.jsx      # Gestión y métricas de cadetes
│   │   │   ├── Rutinas.jsx        # Entrenamientos físicos y tácticos
│   │   │   ├── Calendario.jsx     # Ceremonias y eventos oficiales
│   │   │   └── Inscripciones.jsx  # Admisión y aprobación de postulantes
│   │   ├── services/
│   │   │   └── api.js             # Capa cliente de consumo HTTP (Fetch)
│   │   ├── styles/
│   │   │   └── styles.css         # Diseño institucional militar y responsive
│   │   ├── App.jsx                # Componente raíz y navegación de vistas
│   │   └── main.jsx               # Punto de entrada de React en el DOM
│   ├── index.html                 # Plantilla HTML con tipografía Inter y escudo
│   ├── vite.config.js             # Configuración de Vite con proxy hacia /api
│   └── package.json
│
├── assets/                        # 🖼️ Banco de imágenes militares institucionales
├── database/                      # 💾 Base de datos relacional
│   └── ejercito_bd.sql            # Script DDL/DML maestro (MySQL 8 / InnoDB)
├── docs/                          # 📚 Documentación técnica
│   ├── guia_exposicion.html       # Documento HTML print-ready
│   └── Guia_Exposicion_Backend_Ejercito.pdf # PDF oficial para la sustentación
├── package.json                   # Orquestador raíz con Concurrently
└── README.md                      # Documentación del proyecto
```

---

## 🚀 Puesta en Marcha Rápida

### 1. Requisitos Previos
- **Node.js** v18 o superior.
- **MySQL / MariaDB** (en Laragon, XAMPP o servicio local en el puerto `3306`).

### 2. Importar la Base de Datos
Asegúrate de que MySQL esté iniciado y ejecuta en tu terminal:
```bash
mysql -u root < database/ejercito_bd.sql
```

### 3. Iniciar Todo el Sistema (Backend + Frontend)
En la carpeta raíz del proyecto, ejecuta un solo comando:
```bash
npm run dev
```

Esto levantará automáticamente ambos servicios en paralelo:
- **Backend API:** `http://localhost:3000/api`
- **Frontend Web:** `http://localhost:5173` *(con proxy automático hacia el backend)*

---

## 🛠️ Comandos Individuales (Opcional)

Si deseas correr cada parte en terminales separadas:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia Backend (3000) y Frontend (5173) en simultáneo. |
| `npm run dev:backend` | Inicia únicamente la API REST de Express. |
| `npm run dev:frontend` | Inicia únicamente el servidor de desarrollo de Vite. |
| `npm run build` | Compila el Frontend a HTML/CSS/JS optimizado para producción. |

---

## 🛡️ Características Técnicas Destacadas

1. **Arquitectura MVC Pura:** Desacoplamiento total entre modelos SQL (`models/`), lógica de negocio (`controllers/`) y endpoints HTTP (`routes/`).
2. **Seguridad contra Inyección SQL:** 100% de consultas preparadas con marcadores de posición (`?`).
3. **Transacciones ACID con Bloqueo de Fila:** En la aprobación de postulantes (`POST /api/inscripciones/:id/aprobar`), se utiliza `SELECT ... FOR UPDATE` para evitar condiciones de carrera (Race Conditions), asegurando atomicidad con `commit()` y `rollback()`.
4. **Pool de Conexiones Optimizado:** Configurado en `backend/src/config/db.js` con límite de 10 conexiones concurrentes y `dateStrings: true` para prevenir desfases de zonas horarias en fechas.
5. **Higiene de Archivos:** Las imágenes anteriores se eliminan físicamente del disco al actualizar o borrar registros, evitando archivos huérfanos.
