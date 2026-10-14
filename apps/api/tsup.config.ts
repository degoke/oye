import { defineConfig } from 'tsup';
export default defineConfig({ entry: ['src/index.ts'], format: ['esm'], sourcemap: true, clean: true, noExternal: ['@oye/shared', '@oye/db'], external: ['better-sqlite3'] });
