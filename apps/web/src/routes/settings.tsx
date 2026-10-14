import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Button, Divider, Group, Loader, Modal, Select, Stack, Switch, Text } from '@mantine/core';
import { languages, type Preferences } from '@oye/shared';
import { useSession, useSavePreferences, useClearHistory } from '../lib/session';

function Settings() { const { t, date } = useI18n();
  const session = useSession(); const update = useSavePreferences(); const clear = useClearHistory();
  const [confirm, setConfirm] = useState(false);
  if (session.isPending) return <Loader aria-label={t("Loading your preferences")} />;
  if (session.isError) return <Alert color="red" title={t("Preferences could not load")}><Text>{t(session.error.message)}</Text><Button onClick={() => session.refetch()} mt="md">{t("Try again")}</Button></Alert>;
  const preferences = session.data.preferences;
  const save = (values: Partial<Preferences>) => update.mutate(values);
  return <div className="narrow"><h1 className="page-title">{t("Make learning yours.")}</h1><Text c="dimmed" mb="xl">{t("Your language, your pace, and the formats that work for you.")}</Text><Stack gap="xl">
    {update.isError && <Alert color="red" role="alert">{t(update.error.message)}</Alert>}
    <Select label={t("Learning language")} description={t("For lessons, questions, and your tutor.")} data={languages.map(l => ({ value: l.value, label: l.native }))} value={preferences.language} allowDeselect={false} disabled={update.isPending} onChange={v => { if (v) save({ language: v as Preferences['language'] }); }} />
    <Select label={t("Preferred format")} description={t("You can change this during a lesson.")} data={[{ value: 'text', label: t('Read') }, { value: 'audio', label: t('Listen') }, { value: 'video', label: t('Watch') }]} value={preferences.format} allowDeselect={false} disabled={update.isPending} onChange={v => { if (v) save({ format: v as Preferences['format'] }); }} />
    <Select label={t("Reading support")} data={[{ value: 'standard', label: t('Standard explanations') }, { value: 'simple', label: t('Shorter sentences and simpler words') }]} value={preferences.readingSupport} allowDeselect={false} disabled={update.isPending} onChange={v => { if (v) save({ readingSupport: v as Preferences['readingSupport'] }); }} />
    <Select label={t("Time for a session")} data={[{ value: '5', label: t('5 minutes') }, { value: '10', label: t('10 minutes') }, { value: '20', label: t('20 minutes') }, { value: '30', label: t('30 minutes') }]} value={String(preferences.sessionMinutes)} allowDeselect={false} disabled={update.isPending} onChange={v => { if (v) save({ sessionMinutes: Number(v) }); }} />
    <Switch label={t("Use less data")} description={t("Load text first. Download audio and video only when you choose.")} checked={preferences.lowData} disabled={update.isPending} onChange={e => save({ lowData: e.currentTarget.checked })} />
    <Text size="sm" c="dimmed" aria-live="polite">{update.isPending ? t("Saving your preferences…") : update.isSuccess ? t("Preferences saved.") : t("Your preferences are saved on this browser.")}</Text>
    <Divider /><Text size="sm" c="dimmed">{t("This demo has no account. You can return to your learning on this browser while your session is retained.")}</Text><Text size="sm" c="dimmed">{t("Your learning is removed after 30 days of inactivity.")}</Text><Button variant="outline" color="red" onClick={() => setConfirm(true)} style={{ alignSelf: 'flex-start' }}>{t("Clear my demo history")}</Button>
  </Stack><Modal opened={confirm} onClose={() => { if (!clear.isPending) setConfirm(false); }} title={t("Clear your learning history?")} closeButtonProps={{ 'aria-label': t("Keep my history"), disabled: clear.isPending }} centered><Text mb="lg">{t("Your learning history and locally saved lessons will be removed. Files you downloaded separately stay on your device.")}</Text><Text size="sm" mb="lg">{t("Anonymous usage counts remain for 31 days to enforce demo limits. They contain no learning text or recordings.")}</Text>{clear.isError && <Alert color="red" mb="md">{t(clear.error.message)}</Alert>}<Group justify="flex-end"><Button variant="default" disabled={clear.isPending} onClick={() => setConfirm(false)}>{t("Keep my history")}</Button><Button color="red" loading={clear.isPending} onClick={() => clear.mutate(undefined, { onSuccess: () => { setConfirm(false); } })}>{t("Clear history")}</Button></Group></Modal></div>;
}
export const Route = createFileRoute('/settings')({ component: Settings });
