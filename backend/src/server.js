import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router, { UPLOADS } from './routes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(UPLOADS, { maxAge: '7d' }));
app.use('/api', router);

app.use((err, _req, res, _next) => {
  console.error(err.message);
  const dup = err.code === 'ER_DUP_ENTRY';
  res.status(err.status || (dup || err.code?.startsWith('ER_') ? 400 : 500))
     .json({ error: dup ? 'Ya existe un registro con ese DNI' : err.message });
});

app.listen(process.env.PORT || 3001, () => console.log('API en http://localhost:' + (process.env.PORT || 3001)));
