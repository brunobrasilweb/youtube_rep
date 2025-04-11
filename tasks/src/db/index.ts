import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Inicializa o banco de dados SQLite
const sqlite = new Database('sqlite.db');

// Exporta a conexão usando Drizzle ORM
export const db = drizzle(sqlite, { schema });