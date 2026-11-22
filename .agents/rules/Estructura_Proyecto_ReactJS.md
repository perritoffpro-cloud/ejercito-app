# 🧠 Skill: Estructuración de Sistemas y Paneles Administrativos (React + Vite)
**Innovex Corp - Estándar de Desarrollo Premium**

Este documento define la arquitectura y organización del directorio `src` para garantizar escalabilidad, mantenibilidad y coherencia en los proyectos de React.

---

## 📂 Directorio Raíz (`/`)
- `index.html`: Punto de entrada del DOM.
- `vite.config.js`: Configuración del bundler.
- `package.json`: Gestión de dependencias y scripts.
- `SKILL_FE_STRUCTURE.md`: Este manual de estándares.

---

## 📂 Directorio `/src`
El corazón de la aplicación. Se organiza bajo una arquitectura orientada a **Funcionalidades (Features)** y **Servicios Granulares**.

### 1. `components/`
Componentes globales y altamente reutilizables. No deben contener lógica de negocio pesada.
- **Ejemplo**: `Loading.jsx`, `SidebarComponent.jsx`, `CloudinaryFileUpload.jsx`.
- **Regla**: Nombre en **PascalCase**.

### 2. `context/`
Proveedores de estado global (React Context API).
- **Uso**: Autenticación, selección de proyecto global, notificaciones.
- **Archivo**: `AppContext.jsx`, `AuthContext.jsx`.

### 3. `environment/`
Configuración de variables de entorno y constantes globales.
- **Archivo**: `env.js` (Centraliza las URLs de la API para diferentes entornos).

### 4. `features/`
Organización por módulos de negocio, perfiles de usuario o dominios funcionales. Esta carpeta es la más dinámica y sigue una estructura de **Co-locación de Páginas y Componentes**.

- **Estructura por Scope**: 
    - Se divide en carpetas raízes según el rol o flujo (ej: `admin/`, `auth/`, `client/`, `public/`).
- **Nivel de Páginas (`pages/`)**: 
    - Cada scope contiene un directorio `pages/` que centraliza los puntos de entrada de las rutas.
- **Anatomía de una Entidad (Patrón de Co-locación de Hermanos)**:
    Para cada entidad (ej: `cliente`), se crean dos elementos **al mismo nivel** dentro de `pages/`:
    1.  **`[Entidad]Page.jsx` (Archivo)**: El orquestador principal.
    2.  **`[entidad]Page/` (Carpeta)**: Contiene los componentes específicos del flujo.

    **Estructura Interna de la Carpeta:**
    - `Listado[Entidad].jsx`: Grilla o tabla principal. (Obligatorio)
    - `Registrar[Entidad].jsx`: Formulario de creación. (Obligatorio)
    - `Editar[Entidad].jsx`: Formulario de edición. (Obligatorio)
    - `Eliminar[Entidad].jsx`: Modal de confirmación. (Obligatorio)
    - `VerDetalle[Entidad].jsx`: **Opcional**. (Pedir confirmación antes de implementar).
    - `Importar[Entidad].jsx`: **Opcional**. (Pedir confirmación antes de implementar).

- **Ejemplo Visual**:
    ```text
    src/features/admin/pages/
    ├── ClientePage.jsx           <-- Orquestador (Archivo)
    ├── clientePage/              <-- Componentes (Carpeta Hermana)
    │   ├── ListadoCliente.jsx
    │   ├── RegistrarCliente.jsx
    │   └── ...
    ```

### 5. `routes/`
Centralización de la lógica de navegación.
- `MyRoutes.jsx`: Definición de todas las rutas y su protección.
- `PrivateRoute.jsx`: Wrapper para rutas que requieren login.
- `RoleBasedRoute.jsx`: Control de acceso por jerarquía.

### 6. `services/`
Capa de abstracción para peticiones API. Se organiza por **Entidad**.
- **Estructura**: `services/[entidad]/[Entidad]Methods.jsx`.
- **Contenido**: Funciones asíncronas con promesas (GET, POST, PUT, DELETE).
- **Ejemplo**: `services/lote/LoteMethods.jsx`.

### 7. `styles/`
Estilos globales, temas y configuraciones de CSS/SASS.
- `index.css`: Estilos base.
- `App.css`: Estilos específicos del layout principal.

### 8. `utils/`
Funciones de ayuda (helpers) puras y genéricas.
- **Ejemplo**: Formateo de fechas, validadores de DNI/RUC, cálculos matemáticos.

---

## 📏 Convenciones de Nomenclatura

| Elemento | Formato | Ejemplo |
| :--- | :--- | :--- |
| **Componentes (`.jsx`)** | PascalCase | `EditarClienteForm.jsx` |
| **Carpetas de Feature** | camelCase | `features/admin` |
| **Archivos de Servicio** | PascalCase + 'Methods' | `AsesorMethods.jsx` |
| **Funciones/Variables** | camelCase | `const getFacturaData = ...` |
| **Hooks personalizados** | camelCase (prefijo 'use') | `useAuth.js` |

---

## 🛠️ Flujo de Creación de un Nuevo Módulo (Standard Workflow)
Para mantener la limpieza y el estándar **Skill Premium**, sigue estos pasos al integrar una nueva entidad:

1. **API Service**: Crear `src/services/[entidad]/[Entidad]Methods.jsx` con los métodos CRUD básicos.
2. **Archivos Hermanos**: Dentro de `src/features/[scope]/pages/`, crear el orquestador `[Entidad]Page.jsx` y su carpeta de componentes `[entidad]Page/`.
3. **Desarrollo Atómico**: Desarrollar los componentes obligatorios (`Listado`, `Registrar`, `Editar`, `Eliminar`) dentro de la carpeta creada.
4. **Validación IA**: Si se requieren componentes de `VerDetalle` o `Importar`, solicitar confirmación antes de proceder.
5. **Rutas y Navegación**: Registrar la página en `MyRoutes.jsx` e incluir el enlace en el Sidebar.
