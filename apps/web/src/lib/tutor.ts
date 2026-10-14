import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationSchema, conversationDetailSchema, tutorEventSchema, type TutorTurn } from '@oye/shared';
import { api } from './api';

export const useConversations = () => useQuery({ queryKey: ['conversations'], queryFn: async () => conversationSchema.array().parse(await api('/conversations')) });
export const useConversation = (id: string) => useQuery({ queryKey: ['conversation', id], queryFn: async () => conversationDetailSchema.parse(await api(`/conversations/${id}`)), refetchInterval: q => q.state.data?.turns.some(t => t.status === 'streaming') ? 2000 : false });
export function useCreateConversation() {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (input: { conceptId: string | null; requestId: string }) => conversationSchema.parse(await api('/conversations', { method: 'POST', body: JSON.stringify(input) })), onSuccess: () => client.invalidateQueries({ queryKey: ['conversations'] }) });
}
export function useTutorStream(id: string) {
  const client = useQueryClient(); const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null); const [live, setLive] = useState<TutorTurn | null>(null);
  useEffect(() => () => controller.current?.abort(), [id]);
  const send = async (text: string, requestId: string) => {
    if (controller.current) return;
    const abort = new AbortController(); controller.current = abort; setBusy(true); setError(null); setLive(null);
    let completed = false;
    try {
      const response = await fetch(`/api/conversations/${id}/turns`, { method: 'POST', credentials: 'same-origin', signal: abort.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, requestId }) });
      if (!response.ok) { const failure = await response.json().catch(() => null); throw new Error(failure?.error?.message || 'This reply could not be started.'); }
      if (!response.body) throw new Error('Streaming is unavailable.');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
      for (;;) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
        let boundary: number;
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const packet = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
          const data = packet.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n');
          if (!data) continue;
          const event = tutorEventSchema.parse(JSON.parse(data));
          if (event.type === 'turn' || event.type === 'done') { setLive(event.turn); if (event.type === 'done') completed = true; }
          if (event.type === 'delta') setLive(old => old ? { ...old, assistantText: old.assistantText + event.text } : old);
          if (event.type === 'error') throw new Error(event.message);
        }
      }
      if (!completed) throw new Error('The reply was interrupted. You can retry it.');
    } catch (cause) { setError(abort.signal.aborted ? 'Reply stopped. Your question is saved.' : cause instanceof TypeError ? 'Could not connect. Check your connection and try again.' : cause instanceof Error ? cause.message : 'The reply could not be completed.'); }
    finally { controller.current = null; setBusy(false); await client.invalidateQueries({ queryKey: ['conversation', id] }); await client.invalidateQueries({ queryKey: ['conversations'] }); setLive(null); }
    return completed;
  };
  const stop = async () => { try { await api(`/conversations/${id}/stop`, { method: 'POST' }); } finally { controller.current?.abort(); await client.invalidateQueries({ queryKey: ['conversation', id] }); } };
  return { send, stop, busy, error, live };
}
