# Centro de Mando · Ejército del Perú (Web Institucional & Panel de Comando)

Aplicación web empresarial desarrollada con **React 18 + Vite** bajo el estándar **Innovex Corp - Estándar de Desarrollo Premium (Feature-Driven Architecture)**.

---

## 🏛️ Estructura del Proyecto

El proyecto está organizado en la raíz con el estándar corporativo de Innovex Corp:

```text
ejercito-app/
│
├── .agents/                      # Reglas y plantillas maestras de desarrollo
│   └── rules/                    # Innovex Corp Skill, FrontEnd y BackEnd Masters
│
├── public/                       # Recursos estáticos servidos directamente por Vite
│   └── assets/                   # Fotografías e insignias institucionales
│
├── src/                          # Código fuente de la aplicación React
│   ├── asset/                    # Recursos visuales y logotipos
│   ├── components/               # Componentes transversales
│   │   ├── SidebarComponent.jsx  # Barra de navegación lateral del Centro de Mando
│   │   ├── TopNavbar.jsx         # Encabezado institucional con perfil de oficial
│   │   ├── Loading.jsx           # Spinner y estado de carga institucional
│   │   ├── Notificaciones.jsx    # Alertas Toast del sistema
│   │   └── landing/              # Header, Hero y Footer de la Web Pública
│   │
│   ├── context/                  # Estados globales
│   │   └── AuthContext.jsx       # Gestión de autenticación, sesión y roles de mando
│   │
│   ├── environment/              # Variables y configuración de entorno
│   │   └── API.jsx               # Endpoints y URL base (/api)
│   │
│   ├── features/                 # Módulos por dominio de negocio (Innovex Architecture)
│   │   ├── public/pages/         # Portal Público Ciudadano
│   │   │   ├── LandingPage.jsx   # Página de inicio institucional y convocatorias
│   │   │   └── PostulacionPage.jsx # Ficha de inscripción y registro de postulantes
│   │   │
│   │   └── admin/pages/          # Centro de Mando Militar (Intranet)
│   │       ├── DashboardPage.jsx # Métricas clave, KPIs y resumen de operaciones
│   │       ├── CadetePage.jsx    # Orquestador del módulo de Cadetes
│   │       │   └── cadetePage/   # ListadoCadete, RegistrarCadeteForm, etc.
│   │       ├── RutinaPage.jsx    # Orquestador de Instrucción Militar
│   │       │   └── rutinaPage/   # ListadoRutina, RegistrarRutinaForm, etc.
│   │       ├── EventoPage.jsx    # Orquestador de Ceremonias y Maniobras
│   │       │   └── eventoPage/   # ListadoEvento, RegistrarEventoForm, etc.
│   │       └── InscripcionPage.jsx # Orquestador de Postulaciones y Admisión
│   │           └── inscripcionPage/ # ListadoInscripcion, Registrar, Editar, Eliminar
│   │
│   ├── routes/                   # Enrutamiento de la aplicación
│   │   ├── MyRoutes.jsx          # Rutas públicas y protegidas con React Router
│   │   └── PrivateRoute.jsx      # Guardián de seguridad para acceso al comando
│   │
│   ├── services/                 # Servicios y llamadas HTTP con Axios
│   │   ├── auth/authMethods.jsx
│   │   ├── cadete/CadeteMethods.jsx
│   │   ├── evento/EventoMethods.jsx
│   │   ├── inscripcion/InscripcionMethods.jsx
│   │   ├── rango/RangoMethods.jsx
│   │   └── rutina/RutinaMethods.jsx
│   │
│   ├── styles/                   # Sistema de diseño y estilos militares
│   │   └── styles.css            # Tipografía, paleta de colores y componentes
│   │
│   └── utils/                    # Funciones utilitarias
│       ├── axiosConfig.jsx       # Instancia configurada de Axios
│       ├── formatearFecha.jsx    # Formateador de fechas
│       └── obtenerMensajeError.jsx # Manejo estándar de errores
│
├── database_design.md            # Especificación y diseño ERD de la base de datos
├── index.html                    # Entry point HTML de Vite
├── package.json                  # Dependencias y scripts de la aplicación Web
└── vite.config.js                # Configuración de Vite y proxy para desarrollo
```

---

## 🚀 Puesta en Marcha

### Requisitos
- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior

### Instalación de dependencias
```bash
npm install
```

### Ejecución en Modo Desarrollo
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:5173`.

### Compilación para Producción
```bash
npm run build
```
Genera los archivos optimizados listos para despliegue en la carpeta `dist/`.

---

## 🛡️ Rutas de la Aplicación

| Ruta | Acceso | Descripción |
| :--- | :--- | :--- |
| `/` | Público | Portal web institucional del Ejército del Perú |
| `/postulacion` | Público | Formulario de postulación ciudadana para nuevos reclutas |
| `/admin` | Protegido | Dashboard general del Centro de Mando |
| `/admin/cadetes` | Protegido | Gestión del escalafón militar, rendimiento y cadetes |
| `/admin/rutinas` | Protegido | Programación de rutinas e instrucción de combate |
| `/admin/eventos` | Protegido | Calendario de efemérides, maniobras y ceremonias |
| `/admin/inscripciones` | Protegido | Triaje médico, evaluación física y admisión |
