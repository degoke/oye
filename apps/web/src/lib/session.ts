import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession, savePreferences, clearHistory } from './api';
import { cacheScope, clearSavedLessons } from './saved-lessons';

export function useSession() { return useQuery({ queryKey: ['session'], queryFn: async () => { const session = await getSession(); if (session.cacheScope) { try { cacheScope(session.cacheScope); } catch {} } return session; }, staleTime: 60_000, retry: 1 }); }
export function useSavePreferences() {
  const client = useQueryClient();
  return useMutation({ mutationFn: savePreferences,
    onMutate: values => {
      const previous = client.getQueryData<Awaited<ReturnType<typeof getSession>>>(['session']);
      const optimistic = { ...values }; delete optimistic.language; delete optimistic.readingSupport;
      if (previous) client.setQueryData(['session'], { ...previous, preferences: { ...previous.preferences, ...optimistic } });
      return { previous };
    },
    onError: (_error, _values, context) => { if (context?.previous) client.setQueryData(['session'], context.previous); },
    onSuccess: preferences => {
    client.setQueryData(['session'], (old: Awaited<ReturnType<typeof getSession>> | undefined) => old ? { ...old, preferences } : undefined);
    for (const key of ['journey', 'journeys', 'assessment', 'lesson', 'progress', 'jobs']) void client.invalidateQueries({ queryKey: [key] });
  } });
}
export function useClearHistory() {
  const client = useQueryClient();
  return useMutation({ mutationFn: clearHistory, onSuccess: async () => {
    clearSavedLessons();
    client.removeQueries({ predicate: query => query.queryKey[0] !== 'session' });
    await client.invalidateQueries({ queryKey: ['session'] });
  } });
}
