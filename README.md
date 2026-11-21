# Centro de Mando · Ejército del Perú

Aplicación web profesional para la gestión de cadetes, rutinas, eventos e inscripciones del Ejército del Perú.

## Requisitos
- Node.js 18 o superior (https://nodejs.org)
- MySQL / MariaDB (Laragon o XAMPP)

---

## Puesta en marcha

1. **Base de datos:**
   Importa el archivo maestro en phpMyAdmin o consola:
   ```cmd
   mysql -u root < database\ejercito_bd.sql
   ```

2. **Iniciar la aplicación:**
   ```powershell
   npm install
   npm run dev
   ```

3. **Abrir en tu navegador:**
   👉 **http://localhost:3000**

---

## Arquitectura Profesional del Proyecto

```
ejercito-app/
├── assets/                  # Almacenamiento de fotografías y recursos multimedia
├── database/
│   └── ejercito_bd.sql      # Script SQL maestro (esquema + datos iniciales)
├── server/                  # Backend / API REST (Node.js + Express)
│   ├── db.js                # Conexión y Pool de MySQL
│   └── index.js             # Rutas API, lógica de negocio y servidor Vite integrado
├── src/                     # Frontend (React 18 + Vite)
│   ├── components/          # Componentes visuales reutilizables (UI.jsx, Icons.jsx)
│   ├── pages/               # Vistas principales (Dashboard, Rutinas, Calendario, Inscripciones)
│   ├── services/            # Capa de consumo HTTP (api.js)
│   ├── styles/              # Hojas de estilo globales (styles.css)
│   ├── App.jsx              # Navegación y diseño maestro
│   └── main.jsx             # Punto de entrada de React
├── .env                     # Variables de entorno locales
├── .env.example             # Plantilla de configuración
├── .gitignore               # Archivos excluidos del control de versiones
├── index.html               # Plantilla HTML principal
├── package.json             # Dependencias y scripts del proyecto
└── vite.config.js           # Configuración del empaquetador Vite
```
