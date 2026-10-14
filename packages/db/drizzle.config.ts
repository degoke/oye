import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

config({ path: '../../.env', quiet: true });
const databasePath = resolve('../..', process.env.DATABASE_PATH || '.data/oye.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });
export default defineConfig({
  schema: './src/schema.ts', out: './drizzle', dialect: 'sqlite',
  dbCredentials: { url: databasePath },
});
