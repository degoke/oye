import { useI18n } from '../lib/i18n';
import { Alert, Button, Loader, Stack } from '@mantine/core';

export function Loading({ label = 'Loading your learning…' }: { label?: string }) { const { t, date } = useI18n();
  return <Stack align="center" py="xl" role="status"><Loader size="sm" /><span>{t(label)}</span></Stack>;
}
export function Failure({ error, retry }: { error: Error | null; retry?: () => void }) { const { t, date } = useI18n();
  return <Alert color="red" title={t("Something went wrong")} role="alert">{t(error?.name === 'ZodError' ? 'This request could not be completed. Please try again.' : error?.message || 'Please try again.')}{retry && <div><Button variant="subtle" onClick={retry} mt="sm">{t("Try again")}</Button></div>}</Alert>;
}
export function FixtureNotice() { const { t, date } = useI18n();
  return <Alert color="yellow" title={t("Development example")} mb="lg">{t("This is a fixed English assessment for checking the learning flow. It is not live AI output. Understanding stays unknown until you provide independent evidence.")}</Alert>;
}
