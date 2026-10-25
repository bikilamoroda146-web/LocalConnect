import { useState } from 'react'
import { CalendarX } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import Button from '../../components/common/Button'
import Field from '../../components/common/Field'
import Modal, { ConfirmDialog } from '../../components/common/Modal'
import { StatusBadge } from '../../components/common/Badges'
import { EmptyState } from '../../components/common/States'
import BookingDetails from '../../components/bookings/BookingDetails'
import { useApp } from '../../app/AppContext'
import { formatDate, TODAY } from '../../utils/format'
import { allowedNext, canReschedule } from '../../utils/bookings'

const TABS = [
  { id: 'upcoming', label: 'Upcoming', match: (b) => b.status === 'confirmed' },
  { id: 'pending', label: 'Pending', match: (b) => b.status === 'pending' },
  { id: 'completed', label: 'Completed', match: (b) => b.status === 'completed' },
  { id: 'cancelled', label: 'Cancelled', match: (b) => b.status === 'cancelled' || b.status === 'rejected' },
]

export default function CustomerBookings() {
  const { user, bookings, serviceOf, providerOf, changeBookingStatus, rescheduleBooking } = useApp()
  const [tab, setTab] = useState('upcoming')
  const [view, setView] = useState(null)
  const [cancel, setCancel] = useState(null)
  const [resched, setResched] = useState(null)
  const [date, setDate] = useState('')
  const [err, setErr] = useState('')
  const mine = bookings.filter((b) => b.customerId === user.id)
  const list = mine.filter(TABS.find((t) => t.id === tab).match).sort((a, b) => a.date.localeCompare(b.date))
  const doResched = () => {
    if (!date || date <= TODAY) return setErr('Choose a date after today.')
    rescheduleBooking(resched.id, date, resched.time); setResched(null); setDate(''); setErr('')
  }
  return (
    <>
      <PageHeader title="My bookings" text="Requests move from pending to confirmed once the provider accepts." />
      <Tabs label="Booking status" value={tab} onChange={setTab} tabs={TABS.map((t) => ({ ...t, count: mine.filter(t.match).length }))} />
      <div className="mt-5">
        {list.length === 0 ? <EmptyState icon={CalendarX} title={`No ${tab} bookings`} text="When you request a service it will show up here." actionLabel="Browse services" actionTo="/services" /> : (
          <ul className="space-y-3">{list.map((b) => {
            const s = serviceOf(b.serviceId)
            return (
              <li key={b.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="flex items-center gap-2"><p className="font-semibold">{s?.title}</p><StatusBadge status={b.status} /></div>
                  <p className="text-sm text-ink-soft">{providerOf(b.providerId)?.name} · {formatDate(b.date)} at {b.time}</p><p className="text-xs text-ink-muted">Ref {b.id}</p></div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setView(b)}>View details</Button>
                  {canReschedule(b, TODAY) && <Button size="sm" variant="secondary" onClick={() => setResched(b)}>Reschedule</Button>}
                  {allowedNext(b.status, 'customer').includes('cancelled') && <Button size="sm" variant="ghost" className="text-red-700" onClick={() => setCancel(b)}>Cancel</Button>}
                </div>
              </li>)
          })}</ul>)}
      </div>
      <BookingDetails booking={view} onClose={() => setView(null)} />
      <ConfirmDialog open={!!cancel} onClose={() => setCancel(null)} danger title="Cancel this booking?" confirmLabel="Cancel booking" message="The provider will see this booking as cancelled. You can send a new request any time." onConfirm={() => changeBookingStatus(cancel.id, 'cancelled', 'customer')} />
      <Modal open={!!resched} onClose={() => { setResched(null); setErr('') }} title="Reschedule booking" footer={<><Button variant="secondary" onClick={() => setResched(null)}>Keep current time</Button><Button onClick={doResched}>Request new date</Button></>}>
        <p className="mb-3 text-sm text-ink-soft">Rescheduling sends the request back to the provider as pending.</p>
        <Field label="New date" type="date" min={TODAY} value={date} onChange={(e) => setDate(e.target.value)} error={err} />
      </Modal>
    </>
  )
}
