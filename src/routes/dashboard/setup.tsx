import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/setup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/setup"!</div>
}
