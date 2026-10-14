import type { RealtimeTransportLayer, RealtimeTransportEventTypes, RealtimeTransportLayerConnectOptions, RealtimeItem } from '@openai/agents/realtime';
import { voiceServerMessageSchema, type VoiceClientMessage, type VoiceServerMessage } from '@oye/shared';

/** Agents SDK transport to our cookie-owned gateway; provider credentials never reach it. */
export class OyeVoiceTransport implements RealtimeTransportLayer {
  status: RealtimeTransportLayer['status'] = 'disconnected';
  muted = false;
  private socket: WebSocket | null = null;
  private sequence = 0;
  private listeners = new Map<string | number, Set<(...values: any[]) => void>>();
  private heartbeat: ReturnType<typeof setInterval> | undefined;
  constructor(readonly sessionId: string, readonly receive: (message: VoiceServerMessage) => void, readonly disconnected: () => void) {}
  on<K extends keyof RealtimeTransportEventTypes>(event: K, listener: (...args: RealtimeTransportEventTypes[K]) => void) { const set = this.listeners.get(event) || new Set(); set.add(listener); this.listeners.set(event, set); return this; }
  off<K extends keyof RealtimeTransportEventTypes>(event: K, listener: (...args: RealtimeTransportEventTypes[K]) => void) { this.listeners.get(event)?.delete(listener); return this; }
  once<K extends keyof RealtimeTransportEventTypes>(event: K, listener: (...args: RealtimeTransportEventTypes[K]) => void) { const one = (...args: RealtimeTransportEventTypes[K]) => { this.off(event, one); listener(...args); }; return this.on(event, one); }
  emit<K extends keyof RealtimeTransportEventTypes>(event: K, ...args: RealtimeTransportEventTypes[K]) { this.listeners.get(event)?.forEach(listener => listener(...args)); return this.listeners.has(event); }
  async connect(options: RealtimeTransportLayerConnectOptions) {
    if (this.socket) throw new Error('Voice is already connected');
    const credential = typeof options.apiKey === 'function' ? await options.apiKey() : options.apiKey;
    const url = new URL('/api/voice/connect', window.location.href); url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    this.status = 'connecting'; this.emit('connection_change', 'connecting');
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(url); this.socket = ws;
      const deadline = setTimeout(() => { ws.close(); reject(new Error('Voice connection timed out. Use text or reconnect.')); }, 12000);
      ws.onopen = () => this.send({ type: 'authenticate', sessionId: this.sessionId, credential });
      ws.onmessage = event => {
        try {
          const message = voiceServerMessageSchema.parse(JSON.parse(event.data));
          if (message.type === 'ready') { clearTimeout(deadline); this.status = 'connected'; this.emit('connection_change', 'connected'); this.heartbeat = setInterval(() => this.send({ type: 'ping' }), 15000); resolve(); }
          if (message.type === 'turn') { const turn = message.turn; const item: RealtimeItem = { itemId: turn.id, type: 'message', role: 'user', status: turn.recognizedText ? 'completed' : 'in_progress', content: [{ type: 'input_audio', transcript: turn.confirmedText || turn.recognizedText || null }] }; this.emit('item_update', item); if (turn.assistantText) this.emit('item_update', { itemId: turn.id + '-reply', type: 'message', role: 'assistant', status: turn.status === 'completed' ? 'completed' : 'in_progress', content: [{ type: 'output_text', text: turn.assistantText }] }); }
          if (message.type === 'delta') this.emit('output_text_delta', { type: 'output_text_delta', itemId: message.turnId + '-reply', responseId: message.turnId, delta: message.text });
          if (message.type === 'interrupted') this.emit('audio_interrupted');
          this.receive(message);
        } catch { ws.close(1008, 'Invalid voice response'); }
      };
      ws.onerror = () => reject(new Error('Voice could not connect. Use text or reconnect.'));
      ws.onclose = () => { clearTimeout(deadline); clearInterval(this.heartbeat); this.socket = null; this.status = 'disconnected'; this.emit('connection_change', 'disconnected'); this.disconnected(); reject(new Error('Voice disconnected. Use text or reconnect.')); };
    });
  }
  private send(message: VoiceClientMessage) { if (this.socket?.readyState === WebSocket.OPEN) { if (this.socket.bufferedAmount > 96000) { this.close(); return; } this.socket.send(JSON.stringify(message)); } }
  sendAudio(audio: ArrayBuffer, options: { commit?: boolean } = {}) { if (this.status !== 'connected' || this.muted) return; let binary = ''; for (const byte of new Uint8Array(audio)) binary += String.fromCharCode(byte); this.send({ type: 'audio', data: btoa(binary), sequence: this.sequence++ }); if (options.commit) this.send({ type: 'commit' }); }
  commit() { this.send({ type: 'commit' }); }
  mute(muted: boolean) { this.muted = muted; this.send({ type: 'mute', muted }); }
  interrupt() { this.send({ type: 'interrupt' }); this.emit('audio_interrupted'); }
  close() { this.send({ type: 'stop' }); this.socket?.close(1000, 'Stopped'); clearInterval(this.heartbeat); }
  // Context, tools and session policy belong to the server; browser overrides are refused.
  sendEvent() { throw new Error('Use the voice controls'); }
  sendMessage() { throw new Error('Use the saved text conversation for typed questions'); }
  addImage() { throw new Error('Images are not supported in voice'); }
  updateSessionConfig() {}
  sendFunctionCallOutput() { throw new Error('Voice tools run on the server'); }
  resetHistory(_oldHistory: RealtimeItem[], _newHistory: RealtimeItem[]) { throw new Error('Voice history is saved by the server'); }
  sendMcpResponse() { throw new Error('Voice has no browser MCP tools'); }
}
