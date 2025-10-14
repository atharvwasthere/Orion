import { createFileRoute } from '@tanstack/react-router'
import ConversationDetailPage from '@/Pages/DashboardConversations'

export const Route = createFileRoute('/dashboard/conversations/$id')({
  component: ConversationDetailPage,
})


