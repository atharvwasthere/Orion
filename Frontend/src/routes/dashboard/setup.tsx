import { createFileRoute } from '@tanstack/react-router'
import SetupPage from '@/Pages/DashboardSetup'

export const Route = createFileRoute('/dashboard/setup')({
  component: SetupPage,
})

