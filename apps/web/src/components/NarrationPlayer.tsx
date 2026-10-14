import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Anchor, Button, Group, NativeSelect, Paper, Stack, Text } from '@mantine/core';
import { jobSchema, narrationStateSchema, type NarrationContext } from '@oye/shared';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import { useSession } from '../lib/session';
import { Failure } from './QueryState';
import { GenerationStatus } from './GenerationStatus';

export function NarrationPlayer({ context, journeyId }: { context: NarrationContext; journeyId: string }) {
  const { t, language } = useI18n(); const session = useSession(); const client = useQueryClient(); const audio = useRef<HTMLAudioElement>(null); const [playbackError, setPlaybackError] = useState(false);
  const key = ['narration', JSON.stringify(context), language];
  const state = useQuery({ queryKey: key, queryFn: async () => narrationStateSchema.parse(await api('/narrations/read', { method: 'POST', body: JSON.stringify(context) })) });
  const prepare = useMutation({ mutationFn: async () => jobSchema.parse(await api('/narrations', { method: 'POST', body: JSON.stringify(context) })), onSuccess: () => client.invalidateQueries({ queryKey: key }) });
  const job = useQuery({ queryKey: ['narration-job', state.data?.jobId], enabled: !!state.data?.jobId, queryFn: async () => jobSchema.parse(await api('/jobs/' + state.data!.jobId)), refetchInterval: q => ['queued', 'running'].includes(q.state.data?.status || '') ? 1500 : false });
  useEffect(() => { if (job.data?.status === 'succeeded') void client.invalidateQueries({ queryKey: key }); }, [job.data?.status, client, JSON.stringify(key)]);
  const narration = state.data?.narration;
  return <Paper withBorder radius="md" p="lg" mb="xl"><Stack gap="sm"><Text fw={600}>{t('Listen')}</Text><Text size="sm" c="dimmed">{t('AI-generated voice. The transcript is the lesson text.')}</Text>
    {['yo', 'ig'].includes(narration?.language || language) && <Text size="xs" c="dimmed">{t('AI narration is experimental in this language. Follow the transcript if pronunciation is unclear.')}</Text>}
    {session.data?.preferences.lowData && <Text size="xs" c="dimmed">{t('Low-data mode: audio downloads only when you play or download it.')}</Text>}
    {narration ? <>
      <audio ref={audio} controls preload="none" src={`/api/narrations/${narration.id}/audio`} aria-label={context.type === 'lesson' ? t('Lesson narration') : t('Listen')} style={{ width: '100%' }} onError={() => setPlaybackError(true)} onCanPlay={() => setPlaybackError(false)} />
      {playbackError && <Text role="alert" size="sm">{t('Audio could not play. Try downloading it, or read the transcript.')}</Text>}
      <Group justify="space-between"><Text size="xs" c="dimmed">{t('{minutes} min · {size} MB', { minutes: Math.ceil(narration.duration / 60), size: (narration.bytes / 1048576).toFixed(1) })}</Text><NativeSelect label={t('Playback speed')} data={['0.75', '1', '1.25', '1.5']} defaultValue="1" onChange={e => { if (audio.current) audio.current.playbackRate = Number(e.currentTarget.value); }} /></Group>
      <Anchor href={`/api/narrations/${narration.id}/audio`} download="oye-narration.mp3">{t('Download audio')}</Anchor>
      <details><summary>{t('Read transcript')}</summary><Text lang={narration.language} size="sm" mt="md" style={{ whiteSpace: 'pre-wrap' }}>{narration.transcript}</Text></details>
    </> : job.data ? <GenerationStatus journeyId={journeyId} job={job.data} /> : <Button variant="light" loading={prepare.isPending || state.isPending} onClick={() => prepare.mutate()}>{t('Prepare audio')}</Button>}
    {state.isError && <Failure error={state.error} retry={() => void state.refetch()} />}{prepare.isError && <Failure error={prepare.error} retry={() => prepare.mutate()} />}{job.isError && <Failure error={job.error} retry={() => void job.refetch()} />}
  </Stack></Paper>;
}
