import Modal from '../common/Modal'
import Button from '../common/Button'
import { StatusBadge } from '../common/Badges'
import { formatDate, priceLabel } from '../../utils/format'
import { useApp } from '../../app/AppContext'

export default function BookingDetails({ booking, onClose, viewer = 'customer' }) {
  const { serviceOf, providerOf, userOf } = useApp()
  if (!booking) return null
  const s = serviceOf(booking.serviceId), p = providerOf(booking.providerId), c = userOf(booking.customerId)
  const rows = [['Reference', booking.id], ['Service', s?.title], ['Provider', p?.name], ['Customer', c?.name], ['Date', formatDate(booking.date)], ['Time', booking.time], ['Estimate', s && priceLabel(s)], ['Requested', formatDate(booking.created)]]
  return (
    <Modal open onClose={onClose} title="Booking details" footer={<Button onClick={onClose}>Close</Button>}>
      <div className="mb-3"><StatusBadge status={booking.status} /></div>
      <dl className="divide-y divide-line text-sm">{rows.filter(([, v]) => v).map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-ink-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
      {booking.note && <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm"><p className="font-medium">Note</p><p className="text-ink-soft">{booking.note}</p></div>}
    </Modal>
  )
}
