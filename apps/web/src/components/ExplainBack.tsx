import { VoiceConversation } from './VoiceConversation';
import { SpokenAnswer } from './SpokenAnswer';
import { useI18n } from '../lib/i18n';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Badge, Button, Group, Paper, Stack, Text, Textarea } from '@mantine/core';
import { languages, type Lesson } from '@oye/shared';
import { useExplanation, useExplanations, useExplainJob, useRespondExplanation, useStartExplanation } from '../lib/explain';
import { GenerationStatus } from './GenerationStatus';
import { Failure, Loading } from './QueryState';

export function ExplainBack({ lesson, journeyId }: { lesson: Lesson; journeyId: string }) { const { t, date } = useI18n();
  const list = useExplanations(lesson.conceptId); const start = useStartExplanation(lesson.conceptId);
  const [activeId, setActiveId] = useState<string | null>(null); const [newAttempt, setNewAttempt] = useState(false);
  const [transcriptionId, setTranscriptionId] = useState<string | undefined>();
  const [text, setText] = useState(''); const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const latest = list.data?.find(a => a.lessonId === lesson.id);
  const id = activeId || (!newAttempt ? latest?.id : null);
  return <section className="lesson-section" aria-labelledby="explain-heading"><h2 id="explain-heading" className="question-title">{t("Explain it in your words")}</h2>
    <Text c="dimmed" mb="lg">{t("Imagine helping a friend understand this idea. Start with your own explanation. We will ask a short follow-up before offering feedback.")}</Text>
    {list.isPending ? <Loading /> : list.isError ? <Failure error={list.error} retry={() => void list.refetch()} /> : id ? <ExplanationAttempt key={id} id={id} journeyId={journeyId} onAgain={() => { setActiveId(null); setNewAttempt(true); setText(''); setRequestId(crypto.randomUUID()); }} /> : <Paper withBorder p="lg" radius="lg">
      <Textarea label={t("Your independent explanation")} placeholder={t("How would you explain the idea?")} autosize minRows={4} maxLength={6000} value={text} onChange={e => { setText(e.currentTarget.value); setTranscriptionId(undefined); setRequestId(crypto.randomUUID()); }} disabled={start.isPending} />
      <SpokenAnswer context={{ type: 'explain', lessonId: lesson.id }} disabled={start.isPending} onConfirmed={(words, id) => { setText(words); setTranscriptionId(id); setRequestId(crypto.randomUUID()); }} />
      <VoiceConversation context={{ type: 'explain', lessonId: lesson.id }} disabled={start.isPending} onConfirmed={(words, id) => { setText(words); setTranscriptionId(id); setRequestId(crypto.randomUUID()); }} />
      <Button mt="md" disabled={text.trim().length < 3} loading={start.isPending} onClick={() => start.mutate({ lessonId: lesson.id, explanation: text, requestId, transcriptionId }, { onSuccess: attempt => { setActiveId(attempt.id); setNewAttempt(false); } })}>{t("Save explanation")}</Button>
      {start.isError && <Failure error={start.error} />}
    </Paper>}
  </section>;
}
export function ExplanationAttempt({ id, journeyId, onAgain }: { id: string; journeyId: string; onAgain?: () => void }) { const { t, date, language } = useI18n();
  const query = useExplanation(id); const response = useRespondExplanation(id); const client = useQueryClient();
  const job = useExplainJob(query.data?.jobId || '');
  const [transcriptionId, setTranscriptionId] = useState<string | undefined>();
  const [answer, setAnswer] = useState(''); const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  useEffect(() => { if (query.data && query.data.status !== 'processing') { void client.invalidateQueries({ queryKey: ['progress'] }); void client.invalidateQueries({ queryKey: ['journey'] }); } }, [query.data?.status, client]);
  useEffect(() => { setAnswer(''); setTranscriptionId(undefined); setRequestId(crypto.randomUUID()); }, [query.data?.revision, query.data?.status]);
  if (query.isPending) return <Loading />;
  if (query.isError) return <Failure error={query.error} retry={() => void query.refetch()} />;
  const attempt = query.data; const feedback = attempt.evaluation;
  return <Stack gap="lg">
    <Paper withBorder p="lg" radius="md"><Group justify="space-between" mb="sm"><Text fw={600}>{t("Your explanation")}</Text><Badge variant="light" color="gray">{t(attempt.understanding.replace('_', ' '))}</Badge></Group><Text lang={attempt.language} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{attempt.explanation}</Text>{attempt.answers.map((turn, i) => <div key={i} style={{ marginTop: 20 }}><Text lang={attempt.language} size="sm" fw={600}>{turn.question}</Text><Text lang={attempt.language} size="sm" c="dimmed" mt="xs" style={{ whiteSpace: 'pre-wrap' }}>{turn.answer}</Text></div>)}</Paper>
    {attempt.status === 'processing' && <GenerationStatus journeyId={journeyId} job={job.data} />}
    {job.isError && <Failure error={job.error} retry={() => void job.refetch()} />}
    {attempt.status === 'followup' && <Paper withBorder p="lg" radius="md"><Text lang={attempt.language} fw={600} mb="md">{attempt.question}</Text><Textarea label={t("Your follow-up answer")} value={answer} onChange={e => { setAnswer(e.currentTarget.value); setTranscriptionId(undefined); setRequestId(crypto.randomUUID()); }} autosize minRows={3} maxLength={4000} disabled={response.isPending} /><SpokenAnswer key={attempt.revision} context={{ type: 'response', attemptId: id, revision: attempt.revision }} disabled={response.isPending} onConfirmed={(words, id) => { setAnswer(words); setTranscriptionId(id); setRequestId(crypto.randomUUID()); }} /><VoiceConversation key={'voice-' + attempt.revision} context={{ type: 'response', attemptId: id, revision: attempt.revision }} disabled={response.isPending} onConfirmed={(words, id) => { setAnswer(words); setTranscriptionId(id); setRequestId(crypto.randomUUID()); }} /><Button mt="md" disabled={!answer.trim()} loading={response.isPending} onClick={() => response.mutate({ answer, requestId, revision: attempt.revision, transcriptionId })}>{t("Save answer")}</Button><Text c="dimmed" size="xs" mt="sm">{t("It's okay to say you are unsure. Your words are saved before feedback.")}</Text></Paper>}
    {feedback && <>
      <Alert color="forest" title={t("What your explanation shows")}><Text lang={attempt.language}>{feedback.summary}</Text></Alert>
      <Stack gap="sm">{feedback.findings.map(finding => <Paper key={finding.criterionId} p="lg" withBorder radius="md"><Group justify="space-between"><Text lang={attempt.language} fw={600} size="sm">{attempt.rubric.find(r => r.id === finding.criterionId)?.criterion}</Text><Badge color={finding.status === 'met' ? 'forest' : 'orange'} variant="light">{t(finding.status)}</Badge></Group><Text lang={attempt.language} mt="sm" size="sm">{finding.explanation}</Text>{finding.quote && <blockquote lang={attempt.language} className="evidence-quote">{finding.quote}</blockquote>}<Text size="xs" c="dimmed">{finding.certainty === 'limited' ? t("Evidence is limited. This finding cannot demonstrate understanding.") : t("Supported by the saved learner response.")}</Text></Paper>)}</Stack>
      {feedback.repair && <Paper bg="#eef2e9" p="lg" radius="md"><h3 lang={attempt.language} style={{ marginTop: 0 }}>{feedback.repair.heading}</h3><Text lang={attempt.language} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{feedback.repair.body}</Text><Text lang={attempt.language} mt="md" style={{ whiteSpace: 'pre-wrap' }}>{feedback.repair.example}</Text><Text size="xs" c="dimmed" mt="sm">{t("Sources: ")}{feedback.repair.sourceIds.join(', ')}</Text></Paper>}
      {attempt.status === 'feedback' && <Paper withBorder p="lg" radius="md"><h3 style={{ marginTop: 0 }}>{t("Try a fresh example")}</h3><Text lang={attempt.language} mb="md">{feedback.application.question}</Text><Textarea label={t("Your application answer")} autosize minRows={3} maxLength={4000} value={answer} onChange={e => { setAnswer(e.currentTarget.value); setTranscriptionId(undefined); setRequestId(crypto.randomUUID()); }} disabled={response.isPending} /><SpokenAnswer key={attempt.revision} context={{ type: 'response', attemptId: id, revision: attempt.revision }} disabled={response.isPending} onConfirmed={(words, id) => { setAnswer(words); setTranscriptionId(id); setRequestId(crypto.randomUUID()); }} /><VoiceConversation key={'voice-' + attempt.revision} context={{ type: 'response', attemptId: id, revision: attempt.revision }} disabled={response.isPending} onConfirmed={(words, id) => { setAnswer(words); setTranscriptionId(id); setRequestId(crypto.randomUUID()); }} /><Button mt="md" disabled={!answer.trim()} loading={response.isPending} onClick={() => response.mutate({ answer, requestId, revision: attempt.revision, transcriptionId })}>{t("Check my application")}</Button></Paper>}
    </>}
    {attempt.applicationAnswer && <Paper withBorder p="lg" radius="md"><Text fw={600} mb="sm">{t("Your fresh application")}</Text>{feedback && <Text lang={attempt.language} size="sm" c="dimmed" mb="md">{feedback.application.question}</Text>}<Text lang={attempt.language} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{attempt.applicationAnswer}</Text></Paper>}
    {attempt.applicationEvaluation && <Alert color={attempt.understanding === 'demonstrated' ? 'forest' : 'orange'} title={attempt.understanding === 'demonstrated' ? t("Understanding demonstrated") : t("Your next learning step")}><span lang={attempt.language}>{attempt.applicationEvaluation.explanation}</span>{attempt.applicationEvaluation.quote && <blockquote lang={attempt.language} className="evidence-quote">{attempt.applicationEvaluation.quote}</blockquote>}<Text mt="sm" size="sm">{attempt.understanding === 'demonstrated' ? t("Your explanation covered each essential idea and your fresh application was correct.") : t("Use the feedback, then explain the idea again. Earlier attempts stay saved.")}</Text></Alert>}
    {response.isError && <Failure error={response.error} />}
    {onAgain && (['feedback', 'completed'].includes(attempt.status) || ['failed', 'cancelled'].includes(job.data?.status || '')) && <Button variant="light" onClick={onAgain}>{t("Explain again with what you learned")}</Button>}
    <Text size="xs" c="dimmed">{t("Rubric version {version}. Saved {date}.", { version: attempt.rubricVersion.slice(0, 8), date: date(attempt.createdAt) })}</Text>
    {language !== attempt.language && <Text size="xs" c="dimmed">{t('Saved in {language}', { language: languages.find(l => l.value === attempt.language)?.native || attempt.language })}</Text>}
  </Stack>;
}
