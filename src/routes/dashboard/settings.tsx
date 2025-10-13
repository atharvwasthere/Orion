import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '@/Pages/DashboardSettings'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})
