import { createFileRoute } from '@tanstack/react-router'
import FAQsPage from '@/Pages/FAQsPage';

export const Route = createFileRoute('/dashboard/faq')({
  component: FAQsPage,
})
