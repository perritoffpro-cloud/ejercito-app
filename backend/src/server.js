import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🛡️  CENTRO DE MANDO · EJÉRCITO DEL PERÚ`);
  console.log(` 🚀 Servidor Backend REST (MVC) activo en puerto: ${PORT}`);
  console.log(` 📡 Base de datos MySQL conectada`);
  console.log(` 🔗 API disponible en: http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
});
