import {createFileRoute, Link} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <div className={'flex-1 mt-10 p-10'}>
      <Link to={'/'}>
        Home
      </Link>
      <Link to={'/booking'}>
        Booking
      </Link>
    </div>

  </>
}
