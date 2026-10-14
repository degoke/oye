import { useI18n } from '../lib/i18n';
import { useState } from 'react';
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button, Paper, Stack, Text } from '@mantine/core';
import { useConversations, useCreateConversation } from '../lib/tutor';
import { Failure, Loading } from '../components/QueryState';
function TutorPage() { const { t, date } = useI18n();
  const child = useRouterState({ select: s => s.location.pathname !== '/tutor' && s.location.pathname !== '/tutor/' });
  const conversations = useConversations(); const create = useCreateConversation(); const navigate = useNavigate();
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  if (child) return <Outlet />;
  return <div className="narrow"><h1 className="page-title">{t("A little help, whenever you need it.")}</h1><Text c="dimmed" mb="xl">{t("Ask a question or explore an example, in your language.")}</Text><Button mb="xl" loading={create.isPending} onClick={() => create.mutate({ conceptId: null, requestId }, { onSuccess: conversation => { setRequestId(crypto.randomUUID()); void navigate({ to: `/tutor/${conversation.id}` }); } })}>{t("Ask a new question")}</Button>{create.isError && <Failure error={create.error} />}{conversations.isPending ? <Loading /> : conversations.isError ? <Failure error={conversations.error} retry={() => void conversations.refetch()} /> : <Stack>{conversations.data.map(conversation => <Paper key={conversation.id} p="lg" radius="md" withBorder><Text fw={600} mb="sm">{t(conversation.title)}</Text><Button component={Link} to={`/tutor/${conversation.id}`} variant="light">{t("Continue conversation")}</Button></Paper>)}</Stack>}</div>;
}
export const Route = createFileRoute('/tutor')({ component: TutorPage });
