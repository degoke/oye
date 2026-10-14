import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { BookOpen, MessageCircle, ChartNoAxesColumnIncreasing, Settings, Bookmark } from 'lucide-react';
import { useEffect } from 'react';
import { useI18n } from '../lib/i18n';

const navigation = [{ to: '/', label: 'Learning', Icon: BookOpen }, { to: '/tutor', label: 'Tutor', Icon: MessageCircle }, { to: '/progress', label: 'Progress', Icon: ChartNoAxesColumnIncreasing }] as const;
function Navigation() { const { t } = useI18n(); return <>{navigation.map(({ to, label, Icon }) => <Link key={to} to={to} className="nav-link" activeOptions={{ exact: to === '/' }}><Icon size={19} strokeWidth={1.6} aria-hidden="true" />{t(label)}</Link>)}<Link to="/saved" className="nav-link"><Bookmark size={19} strokeWidth={1.6} aria-hidden="true" />{t('Saved')}</Link></>; }
function Shell() { const { language, t } = useI18n(); useEffect(() => { document.documentElement.lang = language; document.title = 'òye. · ' + t('Learning that understands you.'); }, [language]); return <div className="shell"><a className="skip-link" href="#main">{t("Skip to content")}</a><header className="header"><Link className="wordmark" to="/" aria-label={t("òye. home")}>òye.</Link><nav className="desktop-nav" aria-label={t("Main navigation")}><Navigation /></nav><Link to="/settings" className="settings-link" aria-label={t("Learning preferences")}><Settings size={18} strokeWidth={1.5} /></Link></header><main id="main" tabIndex={-1} className="main"><Outlet /></main><nav className="mobile-nav" aria-label={t("Mobile navigation")}><Navigation /></nav></div>; }
function NotFound() { const { t, date } = useI18n(); return <div className="empty-state"><h1>{t("We couldn't find this page.")}</h1><Link to="/">{t("Back to learning")}</Link></div>; }
function RouteFailure({ reset }: { reset: () => void }) { const { t, date } = useI18n(); return <div role="alert"><h1>{t("This page could not load.")}</h1><p>{t("Try again, or return to your learning.")}</p><button onClick={reset}>{t("Try again")}</button></div>; }
export const Route = createRootRoute({ component: Shell, notFoundComponent: NotFound, errorComponent: RouteFailure });
