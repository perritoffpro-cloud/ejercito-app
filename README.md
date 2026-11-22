# Centro de Mando · Ejército del Perú
Sistema web Full-Stack empresarial con arquitectura **Innovex Corp - Estándar de Desarrollo Premium** (Feature-Driven Architecture en React + Vite y API RESTful en Node.js/Express).

---

## 🏛️ Arquitectura del Sistema

El proyecto sigue una separación total entre la **Web Pública Institucional** (admisión, convocatorias y civismo) y la **Intranet / Centro de Mando** (gestión de oficiales, cadetes y entrenamientos):

```text
ejercito-app/
│
├── 🟢 backend/                        # API RESTful MVC (Node.js + Express)
│   ├── src/
│   │   ├── config/ (db.js)            # Pool de conexiones MySQL2
│   │   ├── models/                    # Consultas SQL y Transacciones ACID
│   │   ├── controllers/               # Manejo de peticiones HTTP
│   │   ├── routes/                    # Endpoints REST (/api/...)
│   │   ├── middlewares/               # Manejo centralizado de errores
│   │   ├── utils/                     # Limpieza física de imágenes en disco
│   │   └── server.js                  # Puerto 3000
│   └── package.json
│
├── 🔵 frontend/                       # Cliente React 18 + Vite (Innovex Corp Standard)
│   ├── src/
│   │   ├── asset/                     # Logos y recursos gráficos
│   │   ├── components/                # Componentes transversales
│   │   │   ├── SidebarComponent.jsx   # Barra lateral de navegación militar
│   │   │   ├── TopNavbar.jsx          # Barra superior con datos del oficial
│   │   │   ├── Loading.jsx            # Spinner institucional
│   │   │   ├── Notificaciones.jsx     # Alertas toast
│   │   │   └── landing/               # Header, Hero y Footer de la web pública
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Sesión y roles de comando
│   │   ├── environment/
│   │   │   └── API.jsx                # URL base (/api)
│   │   ├── features/                  # Dominio de Negocio (Co-locación de Hermanos)
│   │   │   ├── public/pages/          # Web pública del Ejército
│   │   │   │   ├── LandingPage.jsx    # Portal de bienvenida y beneficios
│   │   │   │   └── PostulacionPage.jsx # Ficha de inscripción militar para ciudadanos
│   │   │   └── admin/pages/           # Centro de Mando Militar
│   │   │       ├── DashboardPage.jsx  # KPI Cards y resumen táctico
│   │   │       ├── CadetePage.jsx     # Orquestador de Cadetes
│   │   │       ├── cadetePage/        # Listado, Registrar, Editar, Eliminar
│   │   │       ├── RutinaPage.jsx     # Orquestador de Entrenamientos
│   │   │       ├── rutinaPage/        # Listado, Registrar, Editar, Eliminar
│   │   │       ├── EventoPage.jsx     # Orquestador de Calendario
│   │   │       ├── eventoPage/        # Listado, Registrar, Editar, Eliminar
│   │   │       ├── InscripcionPage.jsx# Orquestador de Admisión
│   │   │       └── inscripcionPage/   # Listado (con Aprobación ACID), Registrar, Editar, Eliminar
│   │   ├── routes/                    # Enrutamiento React Router DOM
│   │   │   ├── MyRoutes.jsx           # Mapeo de rutas (/ y /admin/...)
│   │   │   └── PrivateRoute.jsx       # Layout protegido con Sidebar y TopNavbar
│   │   ├── services/                  # Servicios desacoplados por entidad
│   │   │   ├── auth/authMethods.jsx
│   │   │   ├── cadete/CadeteMethods.jsx
│   │   │   ├── rutina/RutinaMethods.jsx
│   │   │   ├── evento/EventoMethods.jsx
│   │   │   ├── inscripcion/InscripcionMethods.jsx
│   │   │   └── rango/RangoMethods.jsx
│   │   ├── styles/                    # styles.css
│   │   └── utils/                     # axiosConfig.jsx, formatearFecha.jsx, obtenerMensajeError.jsx
│   └── package.json
│
├── 🖼️ assets/                         # Banco de imágenes militares institucionales
├── 💾 database/                       # ejercito_bd.sql (DDL/DML con vistas e índices B-Tree)
├── 📚 docs/                           # Documentación y Guia_Exposicion_Backend_Ejercito.pdf
└── package.json                       # Scripts globales con Concurrently
```

---

## 🚀 Puesta en Marcha

Para iniciar el Backend y el Frontend en paralelo con un solo comando:
```bash
npm run dev
```

- **Portal Web Institucional:** `http://localhost:5173`
- **Ficha de Postulación:** `http://localhost:5173/postulacion`
- **Centro de Mando (Intranet):** `http://localhost:5173/admin`
- **API REST Backend:** `http://localhost:3000/api`
