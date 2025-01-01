import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/calendar/$title')({
  component: RouteComponent,
})

function RouteComponent() {
  const { title } = Route.useParams();

  return <div>Hello "/calendar/$title"! {title}</div>
}
