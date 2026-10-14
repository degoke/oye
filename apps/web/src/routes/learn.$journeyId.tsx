import { useI18n } from '../lib/i18n';
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useAssessment, useJobs, useJourney } from '../lib/learning';
import { Failure, FixtureNotice, Loading } from '../components/QueryState';
import { GenerationStatus } from '../components/GenerationStatus';
import { LanguageGate } from '../components/LanguageGate';
import { useSession } from '../lib/session';

function JourneyPage() { const { t, date } = useI18n();
  const { journeyId } = Route.useParams();
  const child = useRouterState({ select: state => state.location.pathname !== `/learn/${journeyId}` && state.location.pathname !== `/learn/${journeyId}/` });
  const journey = useJourney(journeyId);
  const session = useSession();
  const assessment = useAssessment(journeyId, !!journey.data && !['generating', 'failed'].includes(journey.data.status));
  const jobs = useJobs(journeyId);
  if (child) return <Outlet />;
  if (journey.isError) return <Failure error={journey.error} retry={() => void journey.refetch()} />;
  if (!journey.data) return <Loading />;
  const j = journey.data;
  if (!j.languageReady) return <LanguageGate key={session.data?.preferences.language} journey={j} />;
  return <div className="narrow">
    {j.mode === 'fixture' && <FixtureNotice />}
    <Text c="dimmed" size="sm" mb="sm">{j.scope === 'concept' ? t("A concept to understand") : t("Your starter pathway")}</Text>
    <h1 className="page-title">{j.title}</h1><Text c="dimmed" mb="xl">{j.objective}</Text>
    {['generating', 'failed'].includes(j.status) ? <GenerationStatus journeyId={journeyId} job={jobs.data?.find(job => job.type === 'plan')} /> : j.status === 'assessment' ? <Button component={Link} to={`/learn/${journeyId}/assessment`}>{t("Find my starting point")}</Button> : <>
      <Text mb="lg">{assessment.data?.status === 'skipped' ? t("We will start with the basics. Your understanding is still unknown.") : t("Your starting answers are saved. Lessons will build on what you already know.")}</Text>
      <Stack>{j.concepts.map((concept, index) => <Paper key={concept.id} withBorder p="lg" radius="md">
        <Group justify="space-between" mb="sm"><Text fw={600}>{index + 1}{t(". ")}{concept.title}</Text><Badge color="gray" variant="light">{t(concept.understanding.replace('_', ' '))}</Badge></Group>
        <Text size="sm" c="dimmed">{concept.objective}</Text>
        <Button component={Link} to={`/learn/${journeyId}/concepts/${concept.id}`} variant="light" mt="md">{t("Open concept")}</Button>
      </Paper>)}</Stack>
    </>}
  </div>;
}
export const Route = createFileRoute('/learn/$journeyId')({ component: JourneyPage });
