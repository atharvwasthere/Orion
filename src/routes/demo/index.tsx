import { createFileRoute } from '@tanstack/react-router'
import DemoPage from '@/Pages/Demo'

export const Route = createFileRoute('/demo/')({
  component: DemoPage,
})

