export async function startVoiceCapture(stream: MediaStream, send: (audio: ArrayBuffer) => void, signalLevel?: (level: number) => void) {
  const context = new AudioContext({ sampleRate: 24000 });
  try {
    await context.audioWorklet.addModule('/voice-capture.js'); await context.resume();
    const source = context.createMediaStreamSource(stream); const capture = new AudioWorkletNode(context, 'oye-capture');
    const silent = context.createGain(); silent.gain.value = 0;
    capture.port.onmessage = event => { if (event.data instanceof ArrayBuffer) { const pcm = new Int16Array(event.data); let sum = 0; for (const sample of pcm) sum += (sample / 32768) ** 2; signalLevel?.(Math.min(1, Math.sqrt(sum / pcm.length) * 8)); send(event.data); } };
    source.connect(capture).connect(silent).connect(context.destination);
    return () => { capture.port.onmessage = null; source.disconnect(); capture.disconnect(); silent.disconnect(); stream.getTracks().forEach(track => track.stop()); void context.close(); };
  } catch (error) { stream.getTracks().forEach(track => track.stop()); await context.close(); throw new Error('Voice could not connect. Use text or reconnect.'); }
}

export async function prepareVoiceRecording(file: File) {
  const message = 'Use an audio recording up to 30 seconds and 8 MB.';
  if (!file.size || file.size > 8 * 1024 * 1024 || !/^(audio\/|video\/mp4)/.test(file.type)) throw new Error(message);
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await file.arrayBuffer());
    if (decoded.duration < 0.3 || decoded.duration > 30) throw new Error(message);
    const renderer = new OfflineAudioContext(1, Math.ceil(decoded.duration * 24000), 24000);
    const source = renderer.createBufferSource(); source.buffer = decoded; source.connect(renderer.destination); source.start();
    const rendered = await renderer.startRendering(); const samples = rendered.getChannelData(0); const pcm = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) { const value = Math.max(-1, Math.min(1, samples[i]!)); pcm[i] = Math.round(value * (value < 0 ? 32768 : 32767)); }
    return pcm.buffer;
  } catch { throw new Error(message); } finally { await context.close(); }
}

export function sendVoiceRecording(pcm: ArrayBuffer, send: (audio: ArrayBuffer) => void, complete: () => void) {
  let offset = 0;
  const timer = setInterval(() => { if (offset >= pcm.byteLength) { clearInterval(timer); complete(); return; } send(pcm.slice(offset, offset + 4800)); offset += 4800; }, 100);
  return () => clearInterval(timer);
}
