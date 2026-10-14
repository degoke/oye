import { useEffect } from 'react';
import { Text } from '@mantine/core';
import type { Journey } from '@oye/shared';
import { useJobs, usePrepareLanguage } from '../lib/learning';
import { useI18n } from '../lib/i18n';
import { GenerationStatus } from './GenerationStatus';
import { Failure } from './QueryState';

export function LanguageGate({ journey }: { journey: Journey }) {
  const { language, t } = useI18n(); const prepare = usePrepareLanguage(journey.id); const jobs = useJobs(journey.id);
  const job = jobs.data?.find(j => j.type === 'localize' && j.language === language && j.contentVersion === journey.contentVersion);
  useEffect(() => { if (jobs.data && !job && !prepare.isPending && !prepare.isSuccess && !prepare.isError) prepare.mutate(); }, [jobs.data, job, prepare]);
  return <div className="narrow"><h1 className="page-title">{t('Preparing your language version')}</h1><Text mb="xl">{t('Your answers and progress stay saved while we prepare this language.')}</Text><GenerationStatus journeyId={journey.id} job={job} />{prepare.isError && <Failure error={prepare.error} retry={() => prepare.mutate()} />}{jobs.isError && <Failure error={jobs.error} retry={() => void jobs.refetch()} />}</div>;
}
