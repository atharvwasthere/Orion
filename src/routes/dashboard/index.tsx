import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '@/Pages/Dashboard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

