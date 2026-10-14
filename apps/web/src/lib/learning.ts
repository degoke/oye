import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentSchema, jobSchema, journeySchema, lessonSchema, practiceAttemptSchema, type Language } from '@oye/shared';
import { api } from './api';
import { useSession } from './session';

export const useJourneys = () => { const { data } = useSession(); return useQuery({ queryKey: ['journeys', data?.preferences.language], enabled: !!data, queryFn: async () => journeySchema.array().parse(await api('/journeys')) }); };
export const useJourney = (id: string) => { const { data } = useSession(); return useQuery({ queryKey: ['journey', id, data?.preferences.language], enabled: !!data, queryFn: async () => journeySchema.parse(await api('/journeys/' + id)), refetchInterval: q => q.state.data?.status === 'generating' || q.state.data?.languageReady === false ? 1500 : false }); };
export const useAssessment = (id: string, enabled = true, contentVersion?: string) => { const { data } = useSession(); return useQuery({ queryKey: ['assessment', id, data?.preferences.language, contentVersion], enabled: enabled && !!data, queryFn: async () => assessmentSchema.parse(await api(`/journeys/${id}/assessment`)) }); };
export const useCapabilities = () => useQuery({ queryKey: ['capabilities'], queryFn: () => api<{ text: { provider: string; model: string; configured: boolean }; fixtures: boolean }>('/capabilities') });
export const useJobs = (journeyId: string) => useQuery({ queryKey: ['jobs', journeyId], queryFn: async () => jobSchema.array().parse(await api(`/journeys/${journeyId}/jobs`)), refetchInterval: q => q.state.data?.some(job => ['queued', 'running'].includes(job.status)) ? 1500 : false });
export const useLesson = (id: string, language: Language, readingSupport: string) => useQuery({ queryKey: ['lesson', id, language, readingSupport], queryFn: async () => lessonSchema.nullable().parse(await api(`/concepts/${id}/lesson`)), refetchInterval: q => q.state.data === null ? 2000 : false });
export function usePrepareLesson(id: string, journeyId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: () => api(`/concepts/${id}/lesson`, { method: 'POST' }), onSuccess: () => client.invalidateQueries({ queryKey: ['jobs', journeyId] }) });
}
export function useJobAction(journeyId: string) {
  const client = useQueryClient();
    return useMutation({ mutationFn: ({ id, action }: { id: string; action: 'retry' | 'cancel' }) => api(`/jobs/${id}/${action}`, { method: 'POST' }), onSuccess: () => { void client.invalidateQueries({ queryKey: ['jobs', journeyId] }); void client.invalidateQueries({ queryKey: ['journey', journeyId] }); void client.invalidateQueries({ queryKey: ['narration-job'] }); void client.invalidateQueries({ queryKey: ['video-job'] }); void client.invalidateQueries({ queryKey: ['explain-job'] }); void client.invalidateQueries({ queryKey: ['explanation'] }); } });
}
export const usePractice = (id: string) => useQuery({ queryKey: ['practice', id], queryFn: async () => practiceAttemptSchema.array().parse(await api(`/concepts/${id}/practice`)) });
export function useConfirmPractice(id: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (values: { lessonId: string; questionId: string; optionId: string | null; requestId: string }) => practiceAttemptSchema.parse(await api(`/concepts/${id}/practice`, { method: 'POST', body: JSON.stringify(values) })), onSuccess: () => { void client.invalidateQueries({ queryKey: ['practice', id] }); void client.invalidateQueries({ queryKey: ['journey'] }); } });
}
export function useVisitConcept(id: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: () => api(`/concepts/${id}/visit`, { method: 'POST' }), onSuccess: () => client.invalidateQueries({ queryKey: ['journeys'] }) });
}
export function useCreateJourney() {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (values: { objective: string; language: Language; mode: 'fixture' | 'live'; requestId: string; transcriptionId?: string }) => journeySchema.parse(await api('/journeys', { method: 'POST', body: JSON.stringify(values) })), onSuccess: () => client.invalidateQueries({ queryKey: ['journeys'] }) });
}
export function useAnswer(id: string) {
  const client = useQueryClient(); const session = useSession();
  return useMutation({ mutationFn: async (answer: { questionId: string; optionId: string | null; transcriptionId?: string }) => assessmentSchema.parse(await api(`/journeys/${id}/assessment`, { method: 'PATCH', body: JSON.stringify(answer) })), onSuccess: data => {  void client.invalidateQueries({ queryKey: ['assessment', id] }); } });
}
export function useSubmitAssessment(id: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (skip: boolean) => journeySchema.parse(await api(`/journeys/${id}/assessment`, { method: 'POST', body: JSON.stringify({ skip }) })), onSuccess: () => { void client.invalidateQueries({ queryKey: ['journey', id] }); void client.invalidateQueries({ queryKey: ['assessment', id] }); void client.invalidateQueries({ queryKey: ['journeys'] }); } });
}
export function usePrepareLanguage(id: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: () => api(`/journeys/${id}/language`, { method: 'POST' }), onSuccess: () => { void client.invalidateQueries({ queryKey: ['jobs', id] }); void client.invalidateQueries({ queryKey: ['journey', id] }); } });
}
