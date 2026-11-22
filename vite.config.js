import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración limpia sin proxy acorde al estándar Innovex Corp
export default defineConfig({
  plugins: [react()],
});
