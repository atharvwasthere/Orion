import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/conversations/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/conversations/$id"!</div>
}
