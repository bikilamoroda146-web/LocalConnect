import { useState } from 'react'
import { Inbox } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import Button from '../../components/common/Button'
import { ConfirmDialog } from '../../components/common/Modal'
import { StatusBadge } from '../../components/common/Badges'
import { EmptyState } from '../../components/common/States'
import BookingDetails from '../../components/bookings/BookingDetails'
import { useApp } from '../../app/AppContext'
import { formatDate } from '../../utils/format'
import { allowedNext } from '../../utils/bookings'

const TABS = [['all', 'All'], ['pending', 'Pending'], ['confirmed', 'Confirmed'], ['completed', 'Completed'], ['closed', 'Cancelled / declined']]
const match = (tab, b) => tab === 'all' || (tab === 'closed' ? ['cancelled', 'rejected'].includes(b.status) : b.status === tab)
const LABEL = { confirmed: 'Accept', rejected: 'Decline', completed: 'Mark completed', cancelled: 'Cancel booking' }

export default function ProviderBookings() {
  const { user, bookings, serviceOf, userOf, changeBookingStatus } = useApp()
  const [tab, setTab] = useState('all')
  const [view, setView] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const mine = bookings.filter((b) => b.providerId === user.providerId)
  const list = mine.filter((b) => match(tab, b)).sort((a, b) => a.date.localeCompare(b.date))
  return (
    <>
      <PageHeader title="Booking requests" text="Accept or decline pending requests and mark finished jobs as completed." />
      <Tabs label="Booking status" value={tab} onChange={setTab} tabs={TABS.map(([id, label]) => ({ id, label, count: mine.filter((b) => match(id, b)).length }))} />
      <div className="mt-5">
        {list.length === 0 ? <EmptyState icon={Inbox} title="No bookings here" text="Requests from customers will appear in this list." /> : (
          <ul className="space-y-3">{list.map((b) => (
            <li key={b.id} className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div><div className="flex items-center gap-2"><p className="font-semibold">{serviceOf(b.serviceId)?.title}</p><StatusBadge status={b.status} /></div>
                <p className="text-sm text-ink-soft">{userOf(b.customerId)?.name} · {formatDate(b.date)} at {b.time}</p>{b.note && <p className="mt-1 text-sm text-ink-muted">“{b.note}”</p>}</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => setView(b)}>Details</Button>
                {allowedNext(b.status, 'provider').map((to) => <Button key={to} size="sm" variant={to === 'confirmed' || to === 'completed' ? 'primary' : 'secondary'} onClick={() => setConfirm({ b, to })}>{LABEL[to]}</Button>)}
              </div>
            </li>))}</ul>)}
      </div>
      <BookingDetails booking={view} onClose={() => setView(null)} viewer="provider" />
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} danger={confirm && ['rejected', 'cancelled'].includes(confirm.to)}
        title={confirm ? `${LABEL[confirm.to]}?` : ''} confirmLabel={confirm ? LABEL[confirm.to] : ''} message="The customer will see the updated status in their bookings."
        onConfirm={() => changeBookingStatus(confirm.b.id, confirm.to, 'provider')} />
    </>
  )
}
