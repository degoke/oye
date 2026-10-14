import { useI18n } from '../lib/i18n';
import { Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useProgress } from '../lib/explain';
import { Failure, Loading } from '../components/QueryState';
import { ExplanationAttempt } from '../components/ExplainBack';
import { useState } from 'react';
import type { ExplainState } from '@oye/shared';

function SavedAttempt({ attempt, index, count, journeyId }: { attempt: ExplainState; index: number; count: number; journeyId: string }) { const { t, date } = useI18n();
  const [open, setOpen] = useState(false);
  return <details onToggle={event => setOpen(event.currentTarget.open)}><summary>{index === 0 ? t("Latest explanation") : t("Earlier explanation {number}", { number: count - index })} {t(" · ")}{t(attempt.understanding.replace('_', ' '))} {t(" · ")}{date(attempt.createdAt)}</summary>{open && <ExplanationAttempt id={attempt.id} journeyId={journeyId} />}</details>;
}

function ProgressPage() { const { t, date } = useI18n();
  const progress = useProgress();
  if (progress.isPending) return <Loading />;
  if (progress.isError) return <Failure error={progress.error} retry={() => void progress.refetch()} />;
  return <div className="narrow"><h1 className="page-title">{t("See what you understand.")}</h1>
    <Text c="dimmed" mb="xl">{t("Your explanations and fresh applications show what to build on next. Reading a lesson does not establish understanding.")}</Text>
    {!progress.data.length ? <Paper withBorder radius="lg" p="xl"><Text mb="lg">{t("Start a learning journey to see your progress.")}</Text><Button component={Link} to="/">{t("Choose something to learn")}</Button></Paper> : <Stack gap="xl">{progress.data.map(concept => {
      const latest = concept.attempts[0];
      const latestEvidence = concept.attempts.find(attempt => attempt.understanding !== 'unknown');
      const first = concept.attempts.find(attempt => attempt.understanding === 'needs_practice' && attempt.createdAt < (latestEvidence?.createdAt || 0)) || concept.attempts[concept.attempts.length - 1];
      const gap = latest?.evaluation?.findings.find(f => f.status !== 'met');
      return <Paper key={concept.conceptId} withBorder radius="lg" p="lg">
        <Text size="xs" c="dimmed" mb="xs">{concept.journeyTitle}</Text>
        <Group justify="space-between" align="start" mb="md"><h2 className="question-title" style={{ margin: 0, flex: '1 1 180px' }}>{concept.conceptTitle}</h2><Badge variant="light" color={concept.understanding === 'demonstrated' ? 'forest' : 'gray'}>{t(concept.understanding.replace('_', ' '))}</Badge></Group>
        <Text mb="sm">{t(concept.nextStep)}</Text>
        {gap && latest && <Text size="sm" c="dimmed" mb="sm">{t("Next idea to work on: ")}{latest.rubric.find(r => r.id === gap.criterionId)?.criterion}</Text>}
        <Text size="sm" c="dimmed" mb="lg">{t("{practice} confirmed practice attempts. {explanations} saved explanations.", { practice: concept.practiceCount, explanations: concept.attempts.length })}</Text>
        {first && latestEvidence && first.id !== latestEvidence.id && <Paper bg="#eef2e9" p="md" radius="md" mb="lg"><Text fw={600} size="sm">{t("Your evidence over time")}</Text><Text size="sm" mt="xs">{t("Earlier evidence: {before}. Latest usable evidence: {after}.", { before: t(first.understanding.replace('_', ' ')), after: t(latestEvidence.understanding.replace('_', ' ')) })}</Text><Text size="xs" c="dimmed" mt="xs">{t("Expand the saved attempts to compare your words and feedback.")}</Text></Paper>}
        <Button component={Link} to={`/learn/${concept.journeyId}/concepts/${concept.conceptId}`} variant="light" mb={latest ? 'lg' : 0}>{t("Resume this concept")}</Button>
        {latest && <div className="evidence-history">{concept.attempts.map((attempt, index) => <SavedAttempt key={attempt.id} attempt={attempt} index={index} count={concept.attempts.length} journeyId={concept.journeyId} />)}</div>}
      </Paper>;
    })}</Stack>}
  </div>;
}
export const Route = createFileRoute('/progress')({ component: ProgressPage });
