import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Anchor, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { jobSchema, languages, videoStateSchema } from '@oye/shared';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import { useSession } from '../lib/session';
import { GenerationStatus } from './GenerationStatus';
import { Failure } from './QueryState';

export function VideoPlayer({ lessonId, journeyId }: { lessonId: string; journeyId: string }) {
  const { t, language } = useI18n(); const session = useSession(); const client = useQueryClient(); const [playbackError, setPlaybackError] = useState(false); const [showPlayer, setShowPlayer] = useState(false);
  const key = ['video', lessonId]; const body = JSON.stringify({ lessonId });
  const state = useQuery({ queryKey: key, queryFn: async () => videoStateSchema.parse(await api('/videos/read', { method: 'POST', body })) });
  const prepare = useMutation({ mutationFn: async () => jobSchema.parse(await api('/videos', { method: 'POST', body })), onSuccess: () => client.invalidateQueries({ queryKey: key }) });
  const job = useQuery({ queryKey: ['video-job', state.data?.jobId], enabled: !!state.data?.jobId, queryFn: async () => jobSchema.parse(await api('/jobs/' + state.data!.jobId)), refetchInterval: query => ['queued', 'running'].includes(query.state.data?.status || '') ? 1500 : false });
  useEffect(() => { if (job.data?.status === 'succeeded') void client.invalidateQueries({ queryKey: key }); }, [job.data?.status, lessonId, client]);
  const video = state.data?.video;
  return <Paper withBorder radius="md" p="lg" mb="xl"><Stack gap="sm"><Text fw={600}>{t('Watch')}</Text><Text size="sm" c="dimmed">{t('A visual lesson with reviewed narration, captions and the same saved text.')}</Text>
    {['yo', 'ig'].includes(video?.language || language) && <Text size="xs" c="dimmed">{t('AI voice is experimental in this language. Read the text if audio is unclear or unavailable.')}</Text>}
    {session.data?.preferences.lowData && <Text size="xs" c="dimmed">{t('Low-data mode: video downloads only when you open or download it.')}</Text>}
    {video ? <>
      {showPlayer ? <video controls preload="none" playsInline aria-label={t('Lesson video')} src={`/api/videos/${video.id}/file`} onError={() => setPlaybackError(true)} style={{ width: '100%', aspectRatio: '16 / 9', background: '#17291f', borderRadius: 8 }}><track kind="captions" src={`/api/videos/${video.id}/captions`} srcLang={video.language} label={languages.find(item => item.value === video.language)?.native || video.language} default /></video> : <Button variant="light" onClick={() => setShowPlayer(true)}>{t('Open video')}</Button>}
      {playbackError && <Text role="alert" size="sm">{t('Video could not play. Download it, or read the transcript.')}</Text>}
      <Text size="xs" c="dimmed">{t('{minutes} min · {size} MB', { minutes: Math.ceil(video.duration / 60), size: (video.bytes / 1048576).toFixed(1) })}</Text>
      <Text size="xs" c="dimmed">{t('Caption timing is approximate. The full transcript is available below.')}</Text>
      <Group><Anchor href={`/api/videos/${video.id}/file`} download="oye-lesson.mp4">{t('Download video')}</Anchor><Anchor href={`/api/videos/${video.id}/captions`} download="oye-captions.vtt">{t('Download captions')}</Anchor></Group>
      <details><summary>{t('Read transcript')}</summary><Text lang={video.language} size="sm" mt="md" style={{ whiteSpace: 'pre-wrap' }}>{video.transcript}</Text><Text size="xs" mt="sm">{t('Sources: ')}{video.sourceIds.join(', ')}</Text></details>
    </> : job.data ? <GenerationStatus journeyId={journeyId} job={job.data} /> : <Button variant="light" loading={prepare.isPending || state.isPending} onClick={() => prepare.mutate()}>{t('Prepare video')}</Button>}
    <Text size="xs" c="dimmed">{t('If media preparation fails, continue with the text lesson.')}</Text>
    {state.isError && <Failure error={state.error} retry={() => void state.refetch()} />}{prepare.isError && <Failure error={prepare.error} retry={() => prepare.mutate()} />}{job.isError && <Failure error={job.error} retry={() => void job.refetch()} />}
  </Stack></Paper>;
}
