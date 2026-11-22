import path from 'node:path';
import { unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apunta al directorio assets compartido en la raíz del proyecto
export const ASSETS_DIR = path.resolve(__dirname, '../../../assets');

/**
 * Elimina físicamente una imagen anterior del disco si existe
 */
export async function deleteImageFile(imageUrl) {
  if (!imageUrl || (!imageUrl.startsWith('/assets/') && !imageUrl.startsWith('/uploads/'))) return;
  const fileName = path.basename(imageUrl);
  const filePath = path.join(ASSETS_DIR, fileName);
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (err) {
    console.warn(`[fileManager] No se pudo eliminar imagen antigua (${fileName}):`, err.message);
  }
}
