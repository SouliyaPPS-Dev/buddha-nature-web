import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/video/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/video/"!</div>
}
