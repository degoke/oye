import { NarrationPlayer } from '../components/NarrationPlayer';
import { VideoPlayer } from '../components/VideoPlayer';
import { SaveLesson } from '../components/SaveLesson';
import { lessonGenerationVersionForLanguage } from '@oye/shared';
import { useI18n } from '../lib/i18n';
import { useEffect, useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Anchor, Button, Paper, Stack, Text } from '@mantine/core';
import { useJobs, useJourney, useLesson, usePrepareLesson, useVisitConcept } from '../lib/learning';
import { useSession } from '../lib/session';
import { Failure, FixtureNotice, Loading } from '../components/QueryState';
import { GenerationStatus } from '../components/GenerationStatus';
import { LessonPractice } from '../components/LessonPractice';
import { LessonVisual } from '../components/LessonVisual';
import { ExplainBack } from '../components/ExplainBack';
import { useCreateConversation } from '../lib/tutor';
import { LanguageGate } from '../components/LanguageGate';

function ConceptPage() { const { t, date } = useI18n();
  const session = useSession();
  return <ConceptContent key={`${session.data?.preferences.language}:${session.data?.preferences.readingSupport}`} />;
}
function ConceptContent() { const { t, date } = useI18n();
  const { journeyId, conceptId } = Route.useParams(); const journey = useJourney(journeyId); const session = useSession();
  const language = session.data?.preferences.language || 'en'; const reading = session.data?.preferences.readingSupport || 'standard';
  const lesson = useLesson(conceptId, language, reading); const jobs = useJobs(journeyId); const prepare = usePrepareLesson(conceptId, journeyId);
  const conversation = useCreateConversation(); const navigate = useNavigate(); const [conversationRequestId] = useState(() => crypto.randomUUID());
  const visit = useVisitConcept(conceptId);
  useEffect(() => { if (lesson.data) visit.mutate(); }, [lesson.data?.id]);
  const job = jobs.data?.find(j => j.conceptId === conceptId && j.type === 'lesson' && j.generationVersion === lessonGenerationVersionForLanguage(language) && j.language === language && j.readingSupport === reading && j.status !== 'succeeded');
  useEffect(() => {
    if (journey.data?.mode === 'live' && journey.data.languageReady && journey.data.status === 'learning' && session.data && lesson.data === null && jobs.data && !job && !prepare.isPending && !prepare.isSuccess && !prepare.isError) prepare.mutate();
  }, [journey.data, session.data, lesson.data, jobs.data, job, prepare]);
  if (journey.isError || lesson.isError) return <Failure error={journey.error || lesson.error} retry={() => { void journey.refetch(); void lesson.refetch(); }} />;
  if (!journey.data) return <Loading />;
  if (!journey.data.languageReady) return <LanguageGate journey={journey.data} />;
  const concept = journey.data.concepts.find(c => c.id === conceptId);
  if (!concept) return <Failure error={new Error('This concept could not be found.')} />;
  return <div className="narrow">
    {journey.data.mode === 'fixture' && <FixtureNotice />}
    <Button component={Link} to={`/learn/${journeyId}`} variant="subtle" mb="lg">{t("Your learning pathway")}</Button>
    <h1 className="page-title">{lesson.data?.content.title || concept.title}</h1>
    <Text c="dimmed" mb="xl">{concept.objective}</Text>
    {journey.data.status === 'assessment' ? <Button component={Link} to={`/learn/${journeyId}/assessment`}>{t("Find my starting point first")}</Button> : lesson.data ? <>
      <NarrationPlayer context={{ type: 'lesson', lessonId: lesson.data.id }} journeyId={journeyId} />
      <VideoPlayer lessonId={lesson.data.id} journeyId={journeyId} />
      <SaveLesson lesson={lesson.data} />
      <Paper p="lg" radius="md" withBorder mb="xl"><Text size="lg">{lesson.data.content.summary}</Text></Paper>
      <Stack gap="xl">{lesson.data.content.sections.map((section, i) => <section key={i}><h2 className="question-title">{section.heading}</h2><Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{section.body}</Text><Text size="xs" c="dimmed" mt="xs">{t("Sources: ")}{section.sourceIds.join(', ')}</Text></section>)}</Stack>
      <LessonVisual visual={lesson.data.content.visual} />
      <section className="lesson-section"><h2 className="question-title">{t("A closer look")}</h2><Stack>{lesson.data.content.examples.map((example, i) => <Paper key={i} withBorder radius="md" p="lg"><h3 style={{ marginTop: 0, fontSize: 18 }}>{example.title}</h3><Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{example.explanation}</Text><Text size="xs" c="dimmed" mt="sm">{t("Sources: ")}{example.sourceIds.join(', ')}</Text></Paper>)}</Stack></section>
      <section className="lesson-section"><h2 className="question-title">{t("Words to know")}</h2><dl className="glossary">{lesson.data.content.glossary.map((word, i) => <div key={i}><dt>{word.term}</dt><dd>{word.meaning}</dd></div>)}</dl></section>
      <LessonPractice key={lesson.data.id} lesson={lesson.data} />
      <ExplainBack key={lesson.data.id + '-explain'} lesson={lesson.data} journeyId={journeyId} />
      <Button loading={conversation.isPending} variant="light" onClick={() => conversation.mutate({ conceptId, requestId: conversationRequestId }, { onSuccess: c => void navigate({ to: `/tutor/${c.id}` }) })}>{t("Ask the tutor about this lesson")}</Button>
      {conversation.isError && <Failure error={conversation.error} />}
      <h2 className="question-title" style={{ marginTop: 32 }}>{t("Sources for this lesson")}</h2>
      <Stack>{lesson.data.sources.map(source => <Anchor key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.id}{t(". ")}{source.title}</Anchor>)}</Stack>
    </> : journey.data.mode === 'fixture' ? <Text>{t("This fixed example checks the assessment flow. Start a live journey for a sourced lesson.")}</Text> : <GenerationStatus journeyId={journeyId} job={job} />}
    {prepare.isError && <Failure error={prepare.error} retry={() => prepare.mutate()} />}
  </div>;
}
export const Route = createFileRoute('/learn/$journeyId/concepts/$conceptId')({ component: ConceptPage });
