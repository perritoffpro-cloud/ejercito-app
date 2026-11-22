import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ASSETS_DIR } from '../utils/fileManager.js';

export const uploadController = {
  async uploadImage(req, res, next) {
    try {
      const match = /^data:image\/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(req.body?.data || '');
      if (!match) {
        return res.status(400).json({ error: 'Formato no válido (usa PNG, JPG, WEBP o GIF)' });
      }

      const buffer = Buffer.from(match[2], 'base64');
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(413).json({ error: 'La imagen supera los 5 MB' });
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const fileName = `${randomUUID()}.${ext}`;

      await mkdir(ASSETS_DIR, { recursive: true });
      await writeFile(path.join(ASSETS_DIR, fileName), buffer);

      res.status(201).json({ url: `/assets/${fileName}` });
    } catch (err) {
      next(err);
    }
  },
};
