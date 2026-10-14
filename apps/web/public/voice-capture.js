/* PCM capture stays local until the explicitly started voice session connects. */
class OyeCapture extends AudioWorkletProcessor {
  constructor() { super(); this.pending = []; this.position = 0; this.previous = 0; }
  process(inputs) {
    const channel = inputs[0]?.[0]; if (!channel) return true;
    const step = sampleRate / 24000;
    while (this.position < channel.length) {
      const index = Math.floor(this.position); const fraction = this.position - index;
      const a = index < 0 ? this.previous : channel[index]; const b = channel[Math.min(channel.length - 1, index + 1)];
      const value = Math.max(-1, Math.min(1, a + (b - a) * fraction));
      this.pending.push(Math.round(value * (value < 0 ? 32768 : 32767))); this.position += step;
      if (this.pending.length === 2400) { const pcm = new Int16Array(this.pending); this.port.postMessage(pcm.buffer, [pcm.buffer]); this.pending = []; }
    }
    this.position -= channel.length; this.previous = channel[channel.length - 1]; return true;
  }
}
registerProcessor('oye-capture', OyeCapture);
