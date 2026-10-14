import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Alert, Button, Group, Paper, Stack, Text } from '@mantine/core';
import type { Lesson } from '@oye/shared';
import { useSession } from '../lib/session';
import { useI18n } from '../lib/i18n';
import { downloadText, saveLesson } from '../lib/saved-lessons';

export function SaveLesson({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n(); const session = useSession(); const [saved, setSaved] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  return <Paper withBorder p="lg" radius="md" mb="xl"><Stack gap="sm"><Text fw={600}>{t('Keep learning offline')}</Text><Text size="sm" c="dimmed">{t('Save text and sources on this browser for 30 days. Up to 10 lessons. Tutor, feedback and media need a connection.')}</Text><Group><Button variant="light" loading={busy} disabled={!session.data?.cacheScope} onClick={async () => { setBusy(true); setError(''); try { await saveLesson(lesson, session.data!.cacheScope!); setSaved(true); } catch (cause) { setError(cause instanceof Error ? cause.message : 'This lesson could not be saved. Download the text instead.'); } finally { setBusy(false); } }}>{t('Save text offline')}</Button><Button variant="subtle" onClick={() => downloadText(lesson)}>{t('Download lesson text')}</Button><Button component={Link} to="/saved" variant="subtle">{t('Saved text lessons')}</Button></Group>{saved && <Text role="status" size="sm">{t('Text lesson saved on this browser.')}</Text>}{error && <Alert role="alert" color="orange">{t(error)}</Alert>}</Stack></Paper>;
}
