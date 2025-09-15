import { createFileRoute } from '@tanstack/react-router'
import {BookingForm} from "../../components/BookingForm.tsx";

export const Route = createFileRoute('/booking/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><BookingForm/></div>
}
