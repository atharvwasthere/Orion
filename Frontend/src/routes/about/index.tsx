import { createFileRoute } from '@tanstack/react-router'
import AboutPage from '@/Pages/About'

export const Route = createFileRoute('/about/')({
  component: AboutPage,
})

