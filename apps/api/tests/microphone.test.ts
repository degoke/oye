import { afterEach, expect, it, vi } from 'vitest';
import { acquireMicrophone, microphoneFallback } from '../../web/src/lib/microphone.js';

afterEach(() => vi.useRealTimers());
const media = () => { const stop = vi.fn(); return { stream: { getTracks: () => [{ stop }] } as unknown as MediaStream, stop }; };

it('offers the same text/upload fallback when permission is denied', async () => {
  const result = await acquireMicrophone(() => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')), () => true);
  expect(result.stream).toBeUndefined();
  expect(result.error?.message).toBe(microphoneFallback);
});

it('returns an accepted stream without stopping it', async () => {
  const sample = media();
  const result = await acquireMicrophone(() => Promise.resolve(sample.stream), () => true);
  expect(result.stream).toBe(sample.stream);
  expect(sample.stop).not.toHaveBeenCalled();
});

it('stops a stream granted after a cancelled request', async () => {
  const sample = media(); let resolve!: (stream: MediaStream) => void; let current = true;
  const pending = acquireMicrophone(() => new Promise<MediaStream>(done => { resolve = done; }), () => current);
  current = false; resolve(sample.stream);
  expect((await pending).error?.message).toBe(microphoneFallback);
  expect(sample.stop).toHaveBeenCalledOnce();
});

it('times out and stops a subsequently granted stream', async () => {
  vi.useFakeTimers(); const sample = media(); let resolve!: (stream: MediaStream) => void;
  const pending = acquireMicrophone(() => new Promise<MediaStream>(done => { resolve = done; }), () => true, 16000);
  await vi.advanceTimersByTimeAsync(16000);
  expect((await pending).error?.message).toBe(microphoneFallback);
  resolve(sample.stream); await Promise.resolve();
  expect(sample.stop).toHaveBeenCalledOnce();
});
