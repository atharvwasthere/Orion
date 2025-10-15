import { createFileRoute } from '@tanstack/react-router'
import ConversationsListPage from '@/Pages/ConversationsPage'

export const Route = createFileRoute('/dashboard/conversations/')({
  component: ConversationsListPage,
})
