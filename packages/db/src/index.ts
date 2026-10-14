import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import * as schema from './schema.js';

export { schema };
export { eq, and, lt, desc, asc } from 'drizzle-orm';
export function openDatabase(path: string) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const sqlite = new Database(path);
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('busy_timeout = 5000');
  const db = drizzle(sqlite, { schema });
  return { db, sqlite, close: () => sqlite.close() };
}
export type DatabaseConnection = ReturnType<typeof openDatabase>;
export type OyeDatabase = DatabaseConnection['db'];
export type OyeTransaction = Parameters<Parameters<OyeDatabase['transaction']>[0]>[0];
export function applyGeneratedMigrations(connection: DatabaseConnection, migrationsFolder: string) {
  migrate(connection.db, { migrationsFolder });
}
