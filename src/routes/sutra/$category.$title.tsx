import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sutra/$category/$title')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sutra/$category/$title"!</div>
}
