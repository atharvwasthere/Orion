import { createFileRoute } from '@tanstack/react-router'
import AnalyticsPage from '@/Pages/DashboardAnalytics'

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
})
