import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: 'ejercito_bd',
  dateStrings: true, // fechas como 'YYYY-MM-DD', sin desfase de zona horaria
  connectionLimit: 10,
});
