import { createFileRoute } from '@tanstack/react-router'
import EscalationsPage from '@/Pages/DashboardEscalations'
export const Route = createFileRoute('/dashboard/escalations')({
  component: EscalationsPage,
})

