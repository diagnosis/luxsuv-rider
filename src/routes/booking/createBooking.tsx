import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/booking/createBooking')({
  component: RouteComponent,
})

function RouteComponent() {
    

  return <div>Hello "/booking/createBooking"!</div>
}
