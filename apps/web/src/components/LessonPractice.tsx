import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { Alert, Button, Group, Paper, Radio, Stack, Text } from '@mantine/core';
import type { Lesson } from '@oye/shared';
import { useConfirmPractice, usePractice } from '../lib/learning';
import { Failure } from './QueryState';

export function LessonPractice({ lesson }: { lesson: Lesson }) { const { t, date } = useI18n();
  const [index, setIndex] = useState(0); const [choice, setChoice] = useState('');
  const [requestId, setRequestId] = useState(() => crypto.randomUUID()); const [again, setAgain] = useState(false);
  const saved = usePractice(lesson.conceptId); const confirm = useConfirmPractice(lesson.conceptId);
  const question = lesson.content.practice[index]!;
  const latest = saved.data?.find(a => a.lessonId === lesson.id && a.questionId === question.id);
  const result = confirm.data?.questionId === question.id ? confirm.data : latest;
  const answered = !!result && !again;
  const move = (next: number) => { setIndex(next); setChoice(''); setRequestId(crypto.randomUUID()); setAgain(false); confirm.reset(); };
  return <section aria-labelledby="practice-heading" className="lesson-section">
    <h2 id="practice-heading" className="question-title">{t("Try it yourself")}</h2>
    <Text c="dimmed" size="sm" mb="lg">{t("Practice {current} of {total}. An answer helps us see what to work on next.", { current: index + 1, total: lesson.content.practice.length })}</Text>
    <Paper p="lg" radius="lg" withBorder>
      <h3 style={{ fontSize: 18, lineHeight: 1.6, marginTop: 0 }}>{question.prompt}</h3>
      <Radio.Group value={answered ? result.optionId ?? '__unknown__' : choice} onChange={value => { setChoice(value); setRequestId(crypto.randomUUID()); }} aria-label={question.prompt}>
        <Stack gap="sm">{question.options.map(option => <Radio key={option.id} value={option.id} label={option.text} disabled={answered || confirm.isPending} className="answer-option" />)}<Radio value="__unknown__" label={t("I'm not sure yet")} disabled={answered || confirm.isPending} className="answer-option" /></Stack>
      </Radio.Group>
      {!answered && <Button mt="lg" disabled={!choice || saved.isPending || saved.isError} loading={confirm.isPending} onClick={() => confirm.mutate({ lessonId: lesson.id, questionId: question.id, optionId: choice === '__unknown__' ? null : choice, requestId }, { onSuccess: () => setAgain(false) })}>{t("Confirm answer")}</Button>}
      {answered && <Alert mt="lg" color={result.correct ? 'forest' : 'orange'} title={result.correct === null ? t("A useful place to start") : result.correct ? t("That is correct") : t("Let's work through it")} role="status">{result.explanation}<div><Button variant="subtle" onClick={() => { setAgain(true); setChoice(''); setRequestId(crypto.randomUUID()); confirm.reset(); }}>{t("Try again")}</Button></div></Alert>}
      {confirm.isError && <Failure error={confirm.error} />}
      {saved.isError && <Failure error={saved.error} retry={() => void saved.refetch()} />}
      <Group mt="lg" justify="space-between"><Button variant="subtle" disabled={index === 0 || confirm.isPending} onClick={() => move(index - 1)}>{t("Previous")}</Button><Button variant="light" disabled={index === lesson.content.practice.length - 1 || confirm.isPending} onClick={() => move(index + 1)}>{t("Next practice")}</Button></Group>
    </Paper>
    <Text size="xs" c="dimmed" mt="sm">{t("Saved practice is separate from demonstrating understanding in your own words.")}</Text>
  </section>;
}
