import { useI18n } from '../lib/i18n';
import { Alert, Button, Group, Loader, Text } from '@mantine/core';
import type { GenerationJob } from '@oye/shared';
import { useJobAction } from '../lib/learning';
import { Failure } from './QueryState';

export function GenerationStatus({ journeyId, job }: { journeyId: string; job?: GenerationJob }) { const { t, date } = useI18n();
  const action = useJobAction(journeyId);
  if (!job) return <Text c="dimmed">{t("Preparing your learning…")}</Text>;
  const running = ['queued', 'running'].includes(job.status);
  return <Alert color={running ? 'forest' : 'orange'} title={running ? t("Preparing your learning") : t("Preparation paused")}><Group mb="sm">{running && <Loader size="xs" />}<Text size="sm">{job.message ? t(job.message) : (job.type === 'plan' ? t("Finding sources and shaping your starting questions.") : job.type === 'explain' ? t("Reading your explanation and checking the evidence.") : job.type === 'video' ? t('Rendering video from your saved lesson and reviewed audio.') : job.type === 'narration' ? t('Preparing the audio for your saved text.') : job.type === 'localize' ? t("Checking your translated questions and learning goals.") : t("Writing a lesson that builds on your starting answers."))}</Text></Group><Text size="xs" c="dimmed">{t("You can leave this page and return. Your request is saved.")}</Text><Button variant="subtle" mt="sm" loading={action.isPending} onClick={() => action.mutate({ id: job.id, action: running ? 'cancel' : 'retry' })}>{running ? t("Cancel preparation") : t("Retry preparation")}</Button>{action.isError && <Failure error={action.error} />}</Alert>;
}
