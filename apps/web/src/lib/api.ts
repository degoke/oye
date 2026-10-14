import { preferencesSchema, sessionResponseSchema, type Preferences } from '@oye/shared';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try { response = await fetch('/api' + path, { ...options, credentials: 'same-origin', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } }); }
  catch { throw new Error('Could not connect. Check your connection and try again.'); }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message || 'This request could not be completed. Please try again.');
  }
  return response.json() as Promise<T>;
}
export const getSession = async () => sessionResponseSchema.parse(await api('/session'));
export const savePreferences = async (values: Partial<Preferences>) => preferencesSchema.parse(await api('/preferences', { method: 'PATCH', body: JSON.stringify(values) }));
export const clearHistory = () => api('/session', { method: 'DELETE' });
