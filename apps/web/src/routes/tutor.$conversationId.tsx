import { useI18n } from '../lib/i18n';
import { createFileRoute } from '@tanstack/react-router';
import { TutorConversation } from '../components/TutorConversation';
export const Route = createFileRoute('/tutor/$conversationId')({ component: ConversationPage });
function ConversationPage() { const { t, date } = useI18n(); const { conversationId } = Route.useParams(); return <div className="narrow"><h1 className="page-title">{t("A little help, whenever you need it.")}</h1><TutorConversation key={conversationId} id={conversationId} /></div>; }
