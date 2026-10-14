import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';
import { languageSchema } from '@oye/shared';
import { mediaRoot } from './audio.js';
import type { JobRow } from './generation.js';

const reviewSchema = z.object({ model: z.string().max(200), recognized: z.string().max(6000), valid: z.boolean(), reason: z.string().max(1000) }).strict();
const chunkSchema = z.object({ index: z.number().int().min(0).max(127), text: z.string().max(1000), checksum: z.string().regex(/^[a-f0-9]{64}$/), duration: z.number().positive().max(900), review: reviewSchema.extend({ valid: z.literal(true) }) }).strict();
const manifestSchema = z.object({ version: z.literal(1), cacheKey: z.string().max(100), language: languageSchema, model: z.string().max(200), voice: z.string().max(200), chunks: z.array(chunkSchema).max(128), failures: z.array(z.object({ attempt: z.number().int().min(1).max(6), index: z.number().int().min(0).max(127), review: reviewSchema.extend({ valid: z.literal(false) }) }).strict()).max(6) }).strict();
type Review = z.infer<typeof reviewSchema>;
const checksum = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

// Private, job-owned intermediate files. History deletion and owner retention remove
// the entire owner directory. No route serves these files or the manifest.
export async function openNarrationCache(job: JobRow, root = mediaRoot) {
  const directory = join(root, job.learnerId, '.narration-jobs', job.id);
  const manifestPath = join(directory, 'manifest.json');
  const identity = { version: 1 as const, cacheKey: job.dedupeKey, language: job.input.language, model: job.input.narrationModel!, voice: job.input.narrationVoice || '' };
  let manifest: z.infer<typeof manifestSchema> = { ...identity, chunks: [], failures: [] };
  try {
    if ((await stat(manifestPath)).size > 1_200_000) throw new Error('Invalid chunk manifest');
    const saved = manifestSchema.parse(JSON.parse(await readFile(manifestPath, 'utf8')));
    if (saved.cacheKey !== identity.cacheKey || saved.language !== identity.language || saved.model !== identity.model || saved.voice !== identity.voice) throw new Error('Chunk identity changed');
    manifest = saved;
  } catch { await rm(directory, { recursive: true, force: true }); }
  const persist = async () => { await mkdir(directory, { recursive: true, mode: 0o700 }); await writeFile(manifestPath + '.part', JSON.stringify(manifest), { mode: 0o600 }); await rename(manifestPath + '.part', manifestPath); };
  return {
    read: async (index: number, text: string) => {
      const entry = manifest.chunks.find(chunk => chunk.index === index && chunk.text === text);
      if (!entry) return null;
      try { const bytes = await readFile(join(directory, index + '.mp3')); if (checksum(bytes) !== entry.checksum) throw new Error('Chunk bytes changed'); return { bytes, duration: entry.duration, review: entry.review }; }
      catch { manifest.chunks = manifest.chunks.filter(chunk => chunk.index !== index); await persist(); return null; }
    },
    approve: async (index: number, text: string, bytes: Uint8Array, duration: number, review: Review) => {
      const entry = chunkSchema.parse({ index, text, checksum: checksum(bytes), duration, review });
      await mkdir(directory, { recursive: true, mode: 0o700 }); await writeFile(join(directory, index + '.mp3'), bytes, { mode: 0o600 });
      manifest.chunks = [...manifest.chunks.filter(chunk => chunk.index !== index), entry]; await persist();
    },
    reject: async (index: number, review: Review) => { const failure = manifestSchema.shape.failures.element.parse({ attempt: job.attempts + 1, index, review }); manifest.failures = [...manifest.failures, failure].slice(-6); await persist(); },
    clear: () => rm(directory, { recursive: true, force: true }),
  };
}
