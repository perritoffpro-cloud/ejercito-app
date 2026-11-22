---
trigger: always_on
---

# 🚀 Innovex Corp: Arquitectura & Estándares de Desarrollo

Este documento es el **"Single Source of Truth"** para el desarrollo de módulos en los proyectos de Innovex Corp. Define la estructura, patrones y flujos de trabajo que deben seguirse estrictamente para garantizar consistencia y calidad.

---

## ⚡ Modo de Activación (Para la IA)

Para que el asistente de IA aplique estos estándares de inmediato, el usuario debe iniciar la tarea con la frase:
> **"Usa el Innovex Corp Skill para [descripción de la tarea]"**

Al recibir esta instrucción, la IA debe:
1. Leer el archivo de estructura del proyecto (`Estructura_Proyecto_ReactJS.md`), el cual se encuentra en este mismo directorio. **Propósito crítico:** Este documento provee el mapa arquitectónico simplificado del proyecto React. La IA debe internalizar su contenido para nutrir su inteligencia general y conocimiento del proyecto, localizar eficazmente cualquier archivo existente, comprender a fondo cómo se está estructurando toda la aplicación, y utilizar este contexto base para tomar mejores decisiones a la hora de implementar, modificar o ensamblar nuevas funcionalidades.
2. Leer los archivos maestros de plantillas (`BackEnd_Template_Master.md` y `FrontEnd_Template_Master.md`), los cuales también se encuentran en el mismo directorio.
3. Aplicar la nomenclatura exacta y los patrones de orquestación definidos en las guías anteriores.
4. **Verificación de Existencia:** Antes de crear cualquier archivo, controlador o modelo, la IA debe consultar la estructura para verificar si ya existen. Si existen, deberá **actualizar o parchear** el contenido en lugar de sobrescribirlo o recrearlo.
5. **Procesamiento de Entradas Flexibles:** La IA debe ser capaz de interpretar la estructura del módulo a partir de diversos formatos: código SQL (`CREATE TABLE`), listas de campos con sus tipos, o **capturas de pantalla (imágenes)** de herramientas como PHPMyAdmin. A partir de cualquier tipo de entrada, deberá extraer los campos y adaptarlos fielmente a toda la estructura (Modelo, Controlador, Requests y Frontend).
6. Seguir el flujo de trabajo "Innovex Blueprint".

---

## 🏗️ 1. Arquitectura del Proyecto

### 📂 Backend (Laravel API)
| Componente | Directorio |
| :--- | :--- |
| **Controladores** | `app/Http/Controllers/API/` |
| **Modelos** | `app/Models/` |
| **Validaciones** | `app/Http/Requests/[Modulo]/` |
| **Rutas** | `routes/api.php` |

### 📂 Frontend (React JS)
| Componente | Directorio |
| :--- | :--- |
| **Páginas (Orquestador)** | `src/features/admin/pages/[Entity]Page.jsx` |
| **Componentes (CRUD)** | `src/features/admin/pages/[modulo]/` |
| **Servicios (API)** | `src/services/[modulo]/` |
| **Contexto Global** | `src/context/CrudContext.jsx` |

---

## 📋 2. Estándares de Nomenclatura

| Elemento | Formato | Ejemplo |
| :--- | :--- | :--- |
| **Placeholders (Singular)** | `[Entity]` / `[entity]` | `GastoFijo`, `gastoFijo` |
| **Placeholders (Plural)** | `[Entities]` / `[entities]` | `GastosFijos`, `gastosFijos` |
| **Variables de Estado** | `[entities]`, `set[Entities]` | `clientes`, `setClientes` |
| **Variables Backend** | `$[entities]Data` | `$clientesData` |
| **Base de Datos** | `snake_case` | `id_gasto_fijo`, `fecha_registro` |
| **Llaves JSON (Listado)** | `[entities]` | `'clientes' => ...` |

### 📋 2.1 Configuración de Branding y Herencia Visual

La IA debe garantizar consistencia visual absoluta con el proyecto actual.

1.  **Autodetección de Estilos:** Antes de generar un nuevo módulo, la IA debe leer al menos un archivo de listado (`Listado...jsx`) o formulario existente en `src/features/admin/pages/` para identificar:
    *   Colores de marca (Hexadecimales utilizados en gradientes y botones).
    *   Border-radius predominante (ej. 12px vs 8px).
    *   Estilos de sombreado (`box-shadow`).
2.  **Uso de Variables:** Si el proyecto cuenta con un archivo de branding (ej. `src/styles/branding.css` o variables en `index.css`), la IA debe priorizar el uso de `var(--brand-...)`.
3.  **Fallback Premium:** Si no hay módulos previos, se deben usar los estilos definidos en el `FrontEnd_Template_Master.md` (Versión Premium con bordes de 12px y sombras suaves).
4.  **Adaptación de Colores:** Si el proyecto usa un color principal específico (ej. Morado), la IA debe adaptar los gradientes de los botones y headers (`linear-gradient`) usando ese color como base.

### 📋 2.2 Nomenclatura Estricta de Componentes (Frontend)
| Operación | Nombre del Componente | Extensión |
| :--- | :--- | :--- |
| **Registro** | `Registrar[Entity]Form` | `.jsx` |
| **Edición** | `Editar[Entity]Form` | `.jsx` |
| **Eliminación** | `Eliminar[Entity]Modal` | `.jsx` |
| **Listado** | `Listado[Entity]` | `.jsx` |

> [!IMPORTANT]
> La IA **DEBE** respetar estos nombres exactamente como se definen en los templates maestros. Nunca usar "Modal" para el Registro o Edición.

---

## 🛠️ 3. Contexto Estructural y Master Templates

Utilice estos archivos como referencias obligatorias para comprender globalmente la arquitectura y como base para generar cualquier nuevo módulo.

### [📚 Mapa de Estructura: REACT JS](file:///./Estructura_Proyecto_ReactJS.md)
*(Archivo base para conocimiento del repositorio. Úsalo SIEMPRE para entender cómo se está estructurando el proyecto, ubicar archivos correctamente y tomar decisiones arquitectónicas).*

### [🟦 Master Template: BACKEND (Laravel)](file:///./BackEnd_Template_Master.md)
### [🟨 Master Template: FRONTEND (React)](file:///./FrontEnd_Template_Master.md)

---

## 🔄 4. Flujo de Trabajo (Innovex Blueprint)

1.  **Análisis de Estructura:** Interpretar la tabla y campos desde SQL, texto o imagen.
2.  **Scaffolding Backend:** Modelo -> Master Controller -> Master Request.
3.  **Implementación Frontend (Orden Obligatorio):**
    *   **Paso A:** Generar `Listado[Entity]`, `Registrar[Entity]Form`, `Editar[Entity]Form` y `Eliminar[Entity]Modal` dentro de `src/features/admin/pages/[modulo]/`.
        *   **IMPORTANTE:** El `ToolbarRight` (Excel/Filtros) está definido en los estilos pero su implementación en el JSX es **OPCIONAL**. La IA debe preguntar al usuario antes de renderizarlo.
    *   **Paso B:** Generar la Página Orquestadora `[Entity]Page.jsx` en `src/features/admin/pages/` e importar los componentes desde `./[modulo]/...`.
    *   **Master Service:** Creación explícita de objeto local (`[entity]Objeto`) antes de Axios en `src/services/[modulo]/`.
    *   **Orquestación:** Uso estricto de `useCrudContext` para manejar `modalState.type`.
4.  **Validación:** Uso de `obtenerMensajeError` para mapear errores de Laravel al frontend.
5.  **Enrutamiento Automatizado (Obligatorio):** Inyectar las rutas generadas en `routes/api.php` y en `src/routes/MyRoutes.jsx`. ***Propósito Crítico:*** Antes de inyectar código, la IA **debe** leer el archivo destino y verificar que el bloque de rutas de esa entidad **no exista previamente** para evitar código duplicado. Seguir las guías de prefijos (`kebab-case`).

---

## 🔒 5. Integridad Obligatoria ("Al Pie de la Letra")

La IA **NO PUEDE** simplificar, omitir ni inventar patrones que ya están definidos en los Master Templates. Toda generación de código debe ser una **copia fiel** de la estructura del template, adaptando únicamente los campos y nombres de la entidad.

### ⚠️ Firmas de Props Obligatorias (Frontend)

| Componente | Props Obligatorias | Ejemplo |
| :--- | :--- | :--- |
| `Registrar[Entity]Form` | `{ onCerrar }` | `<Registrar[Entity]Form onCerrar={...} />` |
| `Editar[Entity]Form` | `{ onCerrar, [entity] }` | `<Editar[Entity]Form onCerrar={...} [entity]={...} />` |
| `Eliminar[Entity]Modal` | `{ [entity], onCerrar }` | `<Eliminar[Entity]Modal [entity]={...} onCerrar={...} />` |

**Consistencia en Formularios:** Los formularios de Registro (`Registrar[Entity]Form`) y Edición (`Editar[Entity]Form`) **DEBEN** compartir obligatoriamente el mismo esquema de colores y estructura de componentes. No se permiten estilos divergentes para estas dos operaciones.

### ⚠️ Reglas de Integridad del Modelo (Backend)

- El Modelo **DEBE** incluir `$table`, `$primaryKey` y `$fillable` con **TODOS** los campos del esquema.
- **Sincronización de Búsqueda:** Los campos utilizados en las cláusulas `orWhere` del controlador **DEBEN** coincidir exactamente con los nombres listados en el `placeholder` del buscador en el Frontend.
- Las relaciones deben definirse siguiendo el patrón Eloquent del template.
- Los `FormRequest` deben incluir **TODAS** las reglas de validación correspondientes a los campos del `$fillable`.

### 🚫 Prohibiciones Explícitas

- **NO** renombrar componentes fuera de la nomenclatura definida en la sección 2.1.
- **NO** omitir props obligatorias al renderizar componentes.
- **NO** simplificar la lógica de paginación, búsqueda o estadísticas del Listado.
- **NO** alterar la estructura de los Styled Components del template.
- **NO** inventar hooks, contextos o servicios que no estén definidos en el template.

---

## 📂 6. Ejemplo de Estructura y Orquestación

### 🏗️ Árbol de Directorios (Ejemplo: `GastoFijo`)
```text
src/features/admin/pages/
├── GastoFijoPage.jsx            <--- Orquestador
└── gastoFijo/                   <--- Carpeta de Componentes CRUD
    ├── ListadoGastoFijo.jsx
    ├── RegistrarGastoFijoForm.jsx
    ├── EditarGastoFijoForm.jsx
    └── EliminarGastoFijoModal.jsx
```

### 📄 Orquestador: `GastoFijoPage.jsx`
```javascript
import { useCrudContext } from "../../context/CrudContext";
import { ListadoGastoFijo } from "./gastoFijo/ListadoGastoFijo";
import { RegistrarGastoFijoForm } from "./gastoFijo/RegistrarGastoFijoForm";
import { EditarGastoFijoForm } from "./gastoFijo/EditarGastoFijoForm";
import { EliminarGastoFijoModal } from "./gastoFijo/EliminarGastoFijoModal";

export function GastoFijoPage() {
  const { modalState, closeModal } = useCrudContext();
  return (
    <>
      <ListadoGastoFijo />
      {modalState.type === "registrarGastoFijo" && (
        <RegistrarGastoFijoForm onCerrar={closeModal} />
      )}
      {modalState.type === "editarGastoFijo" && (
        <EditarGastoFijoForm [entity]={modalState.data} onCerrar={closeModal} />
      )}
      {modalState.type === "eliminarGastoFijo" && (
        <EliminarGastoFijoModal [entity]={modalState.data} onCerrar={closeModal} />
      )}
    </>
  );
}
```
