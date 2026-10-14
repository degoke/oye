import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase, applyGeneratedMigrations, schema, type DatabaseConnection } from '@oye/db';
import { createApplication } from '../src/app.js';

const origin = 'http://127.0.0.1:5187';
const migrations = fileURLToPath(new URL('../../../packages/db/drizzle', import.meta.url));
let directory: string;
let connection: DatabaseConnection;
let now: number;
let app: ReturnType<typeof createApplication>;
function cookie(response: Response) { return response.headers.get('set-cookie')!.split(';')[0]!; }
async function start() {
  const response = await app.request('/api/session');
  expect(response.status).toBe(200);
  return cookie(response);
}
const mutation = (cookie: string, body: unknown) => app.request('/api/preferences', { method: 'PATCH', headers: { cookie, origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'oye-session-'));
  connection = openDatabase(join(directory, 'test.sqlite'));
  applyGeneratedMigrations(connection, migrations);
  now = 1_000_000;
  app = createApplication({ db: connection.db, origin, clock: () => now });
});
afterEach(() => { connection.close(); rmSync(directory, { recursive: true, force: true }); });

describe('anonymous session ownership', () => {
  it('keeps preferences across reload and a new server/database connection', async () => {
    const own = await start();
    expect((await mutation(own, { language: 'yo' })).status).toBe(200);
    await mutation(own, { lowData: true });
    connection.close();
    connection = openDatabase(join(directory, 'test.sqlite'));
    app = createApplication({ db: connection.db, origin, clock: () => now });
    const response = await app.request('/api/session', { headers: { cookie: own } });
    expect((await response.json()).preferences).toMatchObject({ language: 'yo', lowData: true, format: 'text' });
  });
  it('isolates visitors and rejects client-selected ownership', async () => {
    const a = await start(); const b = await start();
    await mutation(a, { language: 'ig' });
    expect((await (await app.request('/api/preferences', { headers: { cookie: b } })).json()).language).toBe('en');
    expect((await mutation(b, { learnerId: 'another-learner', language: 'ig' })).status).toBe(400);
    expect(connection.db.select().from(schema.learners).all()).toHaveLength(2);
  });
  it('stores hashes and issues protected cookies', async () => {
    const response = await app.request('/api/session');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('SameSite=Lax');
    expect(response.headers.get('cache-control')).toBe('no-store');
    const token = cookie(response).split('=')[1]!;
    expect(connection.db.select().from(schema.sessions).get()!.tokenHash).not.toBe(token);
    expect(connection.db.select().from(schema.sessions).get()!.tokenHash).toHaveLength(64);
  });
  it('expires old sessions and replaces forged tokens without recovering old data', async () => {
    const own = await start();
    await mutation(own, { language: 'ha' });
    now += 31 * 24 * 60 * 60 * 1000;
    const expired = await app.request('/api/session', { headers: { cookie: own } });
    expect((await expired.json()).preferences.language).toBe('en');
    expect(cookie(expired)).not.toBe(own);
    const forged = await app.request('/api/session', { headers: { cookie: 'oye_session=forged-token' } });
    expect((await forged.json()).preferences.language).toBe('en');
  });
  it('clears only the current learner and invalidates their token', async () => {
    const a = await start(); const b = await start();
    await mutation(a, { language: 'yo' }); await mutation(b, { language: 'ha' });
    const response = await app.request('/api/session', { method: 'DELETE', headers: { cookie: a, origin } });
    expect(response.status).toBe(200);
    expect(connection.db.select().from(schema.learners).all()).toHaveLength(1);
    expect(connection.db.select().from(schema.sessions).all()).toHaveLength(1);
    expect(connection.db.select().from(schema.preferences).all()).toHaveLength(1);
    expect((await (await app.request('/api/preferences', { headers: { cookie: b } })).json()).language).toBe('ha');
    expect((await (await app.request('/api/preferences', { headers: { cookie: a } })).json()).language).toBe('en');
  });
  it('rejects cross-origin mutations and invalid preference values', async () => {
    const own = await start();
    expect((await app.request('/api/preferences', { method: 'PATCH', headers: { cookie: own, origin: 'https://untrusted.example' }, body: '{}' })).status).toBe(403);
    expect((await mutation(own, { language: 'fr' })).status).toBe(400);
    expect((await mutation(own, { sessionMinutes: -5 })).status).toBe(400);
    expect((await app.request('/api/preferences', { method: 'PATCH', headers: { cookie: own, origin, 'content-type': 'application/json' }, body: '{' })).status).toBe(400);
  });
  it('does not create learner records for health checks', async () => {
    expect((await app.request('/api/health')).status).toBe(200);
    expect(connection.db.select().from(schema.learners).all()).toHaveLength(0);
  });
});
