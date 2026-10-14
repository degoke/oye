import { VoiceConversation } from './VoiceConversation';
import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '@tanstack/react-router';
import { Alert, Anchor, Button, Group, Paper, Stack, Text, Textarea } from '@mantine/core';
import { useConversation, useTutorStream } from '../lib/tutor';
import { useCreateJourney } from '../lib/learning';
import { useSession } from '../lib/session';
import { Failure, Loading } from './QueryState';

export function TutorConversation({ id }: { id: string }) { const { t, date } = useI18n();
  const conversation = useConversation(id); const stream = useTutorStream(id); const session = useSession(); const journey = useCreateJourney(); const navigate = useNavigate();
  const [draft, setDraft] = useState(''); const [requestId, setRequestId] = useState(() => crypto.randomUUID()); const [journeyRequestId] = useState(() => crypto.randomUUID());
  if (conversation.isPending) return <Loading label={t("Loading your conversation…")} />;
  if (conversation.isError) return <Failure error={conversation.error} retry={() => void conversation.refetch()} />;
  const turns = [...conversation.data.turns];
  if (stream.live) { const index = turns.findIndex(t => t.id === stream.live!.id); if (index === -1) turns.push(stream.live); else turns[index] = stream.live; }
  const busy = stream.busy || turns.some(t => t.status === 'streaming');
  const send = async () => { if (!draft.trim()) return; const text = draft; const complete = await stream.send(text, requestId); if (complete) { setDraft(''); setRequestId(crypto.randomUUID()); } };
  const quick = (text: string) => { void stream.send(text, crypto.randomUUID()); };
  return <section aria-label={t("Tutor conversation")}>
    {turns.length === 0 && <Text c="dimmed" mb="lg">{t("Ask what is puzzling you. We can take it one idea at a time.")}</Text>}
    <Stack gap="lg">{turns.map(turn => <div key={turn.id}>
      <Paper p="lg" withBorder radius="lg" bg="#eef2e9"><Text size="xs" c="dimmed" mb="xs">{t("You")}</Text><Text lang={turn.language} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{turn.userText}</Text></Paper>
      <div className="tutor-reply"><Text size="xs" c="dimmed" mb="xs">òye.</Text><div className="tutor-markdown" lang={turn.language}><Markdown skipHtml components={{ a: ({ href, children }) => conversation.data.sources.some(s => s.url === href) ? <Anchor href={href} target="_blank" rel="noopener noreferrer">{children}</Anchor> : <span>{children}</span>, img: () => null }}>{turn.assistantText || (turn.status === 'streaming' ? t("Thinking…") : t("The reply did not finish."))}</Markdown></div>
        {['failed', 'interrupted'].includes(turn.status) && <><Text c="dimmed" size="xs" mt="sm">{turn.status === 'interrupted' ? t("Interrupted reply") : t("Failed reply")}{t(". This partial answer is not used in later conversation context.")}</Text><Button variant="subtle" disabled={busy} onClick={() => void stream.send(turn.userText, turn.requestId)}>{t("Retry reply")}</Button></>}
      </div>
    </div>)}</Stack>
    {stream.error && <Alert color="orange" mt="md" role="alert">{t(stream.error)}</Alert>}
    {turns.length > 0 && <Group gap="xs" my="lg">{['Explain more simply', 'Give me another example', 'Help me practice'].map(action => <Button key={action} variant="light" size="xs" disabled={busy} onClick={() => quick(t(action))}>{t(action)}</Button>)}</Group>}
    <VoiceConversation context={{ type: 'tutor', conversationId: id }} disabled={busy} /><div className="tutor-composer"><Textarea label={t("Your question")} placeholder={t("What would help you understand?")} value={draft} maxLength={3000} onChange={e => { setDraft(e.currentTarget.value); setRequestId(crypto.randomUUID()); }} autosize minRows={2} disabled={busy} /><Group justify="flex-end" mt="sm">{busy ? <Button variant="light" onClick={() => void stream.stop()}>{t("Stop reply")}</Button> : <Button disabled={!draft.trim()} onClick={() => void send()}>{t("Send question")}</Button>}</Group><Text role="status" size="xs" c="dimmed" mt="sm">{busy ? t("Replying…") : t("Your completed conversation is saved.")}</Text></div>
    {conversation.data.sources.length > 0 && <section className="lesson-section"><h2 className="question-title">{t("Conversation sources")}</h2><Stack gap="xs">{conversation.data.sources.map(source => <Anchor key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.id}{t(". ")}{source.title}</Anchor>)}</Stack></section>}
    {!conversation.data.conceptId && turns.some(t => t.status === 'completed') && <Paper withBorder p="lg" radius="md" mt="xl"><Text mb="md">{t("Want to build on this question?")}</Text><Button loading={journey.isPending} onClick={() => journey.mutate({ objective: turns[0]!.userText.slice(0,600), language: session.data?.preferences.language || 'en', mode: 'live', requestId: journeyRequestId }, { onSuccess: j => void navigate({ to: `/learn/${j.id}` }) })}>{t("Make a learning journey")}</Button>{journey.isError && <Failure error={journey.error} />}</Paper>}
  </section>;
}
