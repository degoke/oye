import { translate } from '@oye/shared';
import { useSession } from './session';

export function useI18n() {
  const session = useSession();
  const language = session.data?.preferences.language || 'en';
  return { language, t: (text: string, values?: Record<string, string | number>) => translate(language, text, values), date: (time: number) => new Intl.DateTimeFormat(language + '-NG', { dateStyle: 'medium' }).format(time) };
}
