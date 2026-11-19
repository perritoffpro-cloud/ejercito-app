# Centro de Mando · Ejército del Perú

## Requisitos
- Node.js 18 o superior (https://nodejs.org) — comprobar con `node -v`
- XAMPP (MySQL/MariaDB) o MySQL 8

## Puesta en marcha en Windows (PC nueva)

0. Descomprime el zip y abre una terminal (CMD) dentro de la carpeta `ejercito-app`.

1. Base de datos — abre XAMPP Control Panel y pulsa **Start** en MySQL, luego:
   ```
   C:\xampp\mysql\bin\mysql.exe -u root < database\ejercito_bd.sql
   ```
   (Si root tiene contraseña: añade `-p`. También puedes importar el archivo desde
   phpMyAdmin → Importar.)

2. Backend — en una terminal:
   ```
   cd backend
   copy .env.example .env
   npm install
   npm run dev
   ```
   Debe mostrar `API en http://localhost:3001`. Si MySQL tiene contraseña, escríbela en
   `DB_PASS=` dentro de `backend\.env`.

3. Frontend — en OTRA terminal (deja la del backend abierta):
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Abre http://localhost:5173

Las siguientes veces solo hace falta: encender MySQL en XAMPP, `npm run dev` en `backend`
y `npm run dev` en `frontend`.

## Si ya tenías la versión anterior instalada
No vuelvas a importar `ejercito_bd.sql` (borra la base). Ejecuta solo la migración:
```
C:\xampp\mysql\bin\mysql.exe -u root < database\migracion_imagenes.sql
```

## Problemas frecuentes
- `ECONNREFUSED` / `Access denied`: MySQL apagado o contraseña incorrecta en `backend\.env`.
- `Unknown database 'ejercito_bd'`: falta el paso 1.
- `"npm" no se reconoce`: instala Node.js y abre una terminal nueva.
- Puerto 3001 o 5173 ocupado: cierra la otra ventana que esté usando ese puerto.

## Imágenes
- Cadetes, rutinas, eventos y postulantes tienen campo de imagen (arrastrar, subir o pegar URL).
- Se guardan en `backend/uploads/`; en la base solo queda la ruta.
- Al aprobar un postulante, su fotografía pasa a la ficha del nuevo cadete.
