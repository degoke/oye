import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { explainStateSchema, jobSchema, progressSchema } from '@oye/shared';
import { api } from './api';

export const useExplanations = (conceptId: string) => useQuery({ queryKey: ['explanations', conceptId], queryFn: async () => explainStateSchema.array().parse(await api(`/concepts/${conceptId}/explanations`)) });
export const useExplanation = (id: string) => useQuery({ queryKey: ['explanation', id], queryFn: async () => explainStateSchema.parse(await api(`/explanations/${id}`)), refetchInterval: q => q.state.data?.status === 'processing' ? 1200 : false });
export const useExplainJob = (id: string) => useQuery({ queryKey: ['explain-job', id], enabled: !!id, queryFn: async () => jobSchema.parse(await api(`/jobs/${id}`)), refetchInterval: q => ['queued', 'running'].includes(q.state.data?.status || '') ? 1200 : false });
export const useProgress = () => useQuery({ queryKey: ['progress'], queryFn: async () => progressSchema.parse(await api('/progress')) });
export function useStartExplanation(conceptId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (values: { lessonId: string; explanation: string; requestId: string; transcriptionId?: string }) => explainStateSchema.parse(await api(`/concepts/${conceptId}/explanations`, { method: 'POST', body: JSON.stringify(values) })), onSuccess: () => client.invalidateQueries({ queryKey: ['explanations', conceptId] }) });
}
export function useRespondExplanation(id: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (values: { answer: string; revision: number; requestId: string; transcriptionId?: string }) => explainStateSchema.parse(await api(`/explanations/${id}/responses`, { method: 'POST', body: JSON.stringify(values) })), onSuccess: data => { client.setQueryData(['explanation', id], data); void client.invalidateQueries({ queryKey: ['explanations'] }); void client.invalidateQueries({ queryKey: ['progress'] }); void client.invalidateQueries({ queryKey: ['journey'] }); } });
}
