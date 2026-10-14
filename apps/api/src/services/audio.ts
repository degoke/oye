import OpenAI, { toFile } from 'openai';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import type { Language } from '@oye/shared';
import { config, projectRoot } from '../config.js';
import { reserveProviderCall } from './ai.js';

const executeFile = promisify(execFile);
export const mediaRoot = resolve(projectRoot, config.MEDIA_PATH);
export const tempRoot = join(mediaRoot, '.tmp');
export const languageNames: Record<Language, string> = { en: 'English', yo: 'Yoruba', ha: 'Hausa', ig: 'Igbo' };
export function speechConfiguration(language: Language) {
  if (config.AI_PROVIDER === 'openai') return { model: config.OPENAI_TTS_MODEL, voice: config.OPENAI_TTS_VOICE };
  return { model: language === 'yo' ? config.OPENROUTER_TTS_MODEL_YO : language === 'ig' ? config.OPENROUTER_TTS_MODEL_IG : language === 'ha' ? config.OPENROUTER_TTS_MODEL_HA : config.OPENROUTER_TTS_MODEL, voice: language === 'yo' ? config.OPENROUTER_TTS_VOICE_YO : language === 'ig' ? config.OPENROUTER_TTS_VOICE_IG : config.OPENROUTER_TTS_VOICE };
}
// Yoruba revision 4 uses shorter narration chunks and preserves doubled vowels.
export const speechDeliveryVersion = (language: Language) => language === 'ig' ? 3 : language === 'yo' ? 4 : 1;
export const transcriptionModel = () => config.AI_PROVIDER === 'openrouter' ? config.OPENROUTER_STT_MODEL : config.OPENAI_STT_MODEL;
export const narrationTranscriptionModel = (language: Language) => config.AI_PROVIDER === 'openrouter' && language === 'yo' ? config.OPENROUTER_NARRATION_STT_MODEL_YO : transcriptionModel();
const audioClient = () => {
  const router = config.AI_PROVIDER === 'openrouter'; const apiKey = router ? config.OPENROUTER_API_KEY : config.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Speech is not configured');
  return new OpenAI({ apiKey, ...(router ? { baseURL: 'https://openrouter.ai/api/v1', defaultHeaders: { 'X-OpenRouter-Title': 'òye.' } } : {}), timeout: 90_000, maxRetries: 0 });
};
export async function ffmpeg(args: string[], signal?: AbortSignal, timeout = 25_000) {
  return executeFile(config.FFMPEG_PATH, ['-hide_banner', '-nostdin', '-loglevel', 'error', '-y', ...args], { timeout, maxBuffer: 512 * 1024, signal });
}
export async function audioDuration(file: string) {
  const { stdout } = await executeFile(config.FFPROBE_PATH, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', file], { timeout: 8000, maxBuffer: 8192 });
  const duration = Number(JSON.parse(stdout).format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid audio duration');
  return duration;
}
export async function withAudioTemp<T>(run: (directory: string) => Promise<T>) {
  await mkdir(tempRoot, { recursive: true, mode: 0o700 }); const directory = await mkdtemp(join(tempRoot, 'speech-'));
  try { return await run(directory); } finally { await rm(directory, { recursive: true, force: true }); }
}
export async function recognize(bytes: Uint8Array, language: Language, signal?: AbortSignal, maxSeconds = 90, model = transcriptionModel()) {
  return withAudioTemp(async directory => {
    const data = Buffer.from(bytes);
    const demuxer = data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WAVE' ? 'wav'
      : data.subarray(0, 3).toString() === 'ID3' || data[0] === 0xff && (data[1]! & 0xe0) === 0xe0 ? 'mp3'
      : data.subarray(0, 4).toString() === 'OggS' ? 'ogg'
      : data.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) ? 'matroska'
      : data.subarray(4, 8).toString() === 'ftyp' ? 'mov' : null;
    // Do not let an uploaded HLS/concat playlist open another local file.
    if (!demuxer) throw new Error('Unsupported audio container');
    const input = join(directory, 'upload'); const wav = join(directory, 'speech.wav'); await writeFile(input, bytes, { mode: 0o600 });
    // The decoder gets a generated local path and cannot resolve playlist network URLs.
    await ffmpeg(['-protocol_whitelist', 'file,pipe', '-f', demuxer, '-i', input, '-vn', '-t', String(maxSeconds + 1), '-ac', '1', '-ar', '16000', wav], signal);
    const duration = await audioDuration(wav);
    if (duration < 0.25 || duration > maxSeconds + 0.25) throw new Error('Recording duration exceeds the allowed limit');
    const normalized = await readFile(wav);
    reserveProviderCall('provider-stt');
    const result = await audioClient().audio.transcriptions.create({ model, file: await toFile(normalized, 'speech.wav', { type: 'audio/wav' }), ...(config.AI_PROVIDER === 'openrouter' ? { language } : { prompt: `Transcribe the spoken ${languageNames[language]} words in their original language, preserving diacritics. Do not translate.` }), response_format: 'json' }, { signal });
    const text = result.text?.normalize('NFC').trim();
    if (!text || text.length > 6000) throw new Error('No usable speech was recognized');
    return { text, duration: Math.ceil(duration) };
  });
}
export async function synthesize(text: string, language: Language, settings = speechConfiguration(language), signal?: AbortSignal, deliveryVersion = speechDeliveryVersion(language)) {
  reserveProviderCall('provider-tts');
  const carefulDelivery = language === 'yo' && deliveryVersion >= 2 || language === 'ig' && deliveryVersion >= 3;
  const instructions = carefulDelivery ? `A fluent native ${languageNames[language]} speaker. Slow, deliberate, clear speech with pauses between sentences. Preserve every tone, underdot, negation and technical word. ${language === 'yo' && deliveryVersion >= 4 ? 'Keep doubled vowels distinct; never shorten two written vowels into one. In alààyè, pronounce both a vowels clearly. Keep alààyè distinct from àlàyé. ' : ''}Read the supplied text exactly in its original language. Do not translate or add anything.` : `Read this ${languageNames[language]} text naturally and exactly. ${language === 'ig' && deliveryVersion >= 2 ? 'Speak slowly and clearly, with a pause between sentences. Pronounce tone marks, underdots and negation carefully. ' : ''}Do not translate, add words, or speak these instructions.`;
  const response = await audioClient().audio.speech.create({ model: settings.model, input: text, ...(settings.voice ? { voice: settings.voice } : {}), ...(settings.model.startsWith('google/') || settings.model.startsWith('openai/gpt-4o-mini-tts') || config.AI_PROVIDER === 'openai' ? { instructions } : {}), response_format: settings.model.startsWith('google/') ? 'pcm' : 'mp3' } as OpenAI.Audio.SpeechCreateParams, { signal });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100 || bytes.length > 8 * 1024 * 1024) throw new Error('Invalid speech response');
  if (settings.model.startsWith('google/')) return withAudioTemp(async directory => {
    const input = join(directory, 'speech.pcm'); const output = join(directory, 'speech.mp3');
    await writeFile(input, bytes, { mode: 0o600 });
    await ffmpeg(['-f', 's16le', '-ar', '24000', '-ac', '1', '-i', input, '-codec:a', 'libmp3lame', '-b:a', '48k', output], signal);
    return readFile(output);
  });
  return bytes;
}
export function speechChunks(text: string, limit = 700) {
  // Preserve every character, splitting at sentence/paragraph boundaries when possible.
  const chunks: string[] = []; let rest = text;
  while (rest.length > limit) { let at = rest.lastIndexOf('\n', limit); if (at < limit / 3) at = rest.lastIndexOf('. ', limit) + 1; if (at < limit / 3) at = rest.lastIndexOf(' ', limit); if (at < 1) at = limit; chunks.push(rest.slice(0, at)); rest = rest.slice(at); }
  if (rest.trim()) chunks.push(rest); return chunks;
}
