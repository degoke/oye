import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export default defineConfig(({ mode }) => ({
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), {
    name: 'oye-offline-shell', generateBundle(_options, bundle) {
      const files = new Set<string>();
      const visit = (name: string) => { if (files.has(name)) return; const entry = bundle[name]; if (!entry) return; files.add(name); if (entry.type === 'chunk') { entry.imports.forEach(visit); const metadata = entry as typeof entry & { viteMetadata?: { importedCss: Set<string>; importedAssets: Set<string> } }; metadata.viteMetadata?.importedCss.forEach(visit); metadata.viteMetadata?.importedAssets.forEach(visit); } };
      for (const [name, entry] of Object.entries(bundle)) if (entry.type === 'chunk' && (entry.isEntry || entry.name === 'saved' || entry.name === 'routes')) visit(name);
      const manifest = JSON.stringify([...files].map(file => '/' + file));
      this.emitFile({ type: 'asset', fileName: 'offline-assets.json', source: manifest });
      const worker = readFileSync(new URL('./offline-sw.js', import.meta.url), 'utf8');
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: worker.replace('oye.shell.v1', 'oye.shell.' + createHash('sha256').update(manifest + worker).digest('hex').slice(0, 12)) });
    },
  }],
  server: { port: 5187, strictPort: true, proxy: { '/api': { target: `http://127.0.0.1:${loadEnv(mode, '../..', 'API_').API_PORT || '3187'}`, ws: true } } },
}));
