import { createFileRoute } from '@tanstack/react-router'
import ChatPage from '@/Pages/ChatPage'


export const Route = createFileRoute('/chat/')({
  component: ChatPage
})
