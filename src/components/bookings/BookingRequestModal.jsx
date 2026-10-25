import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Field from '../common/Field'
import { useApp } from '../../app/AppContext'
import { TODAY, priceLabel } from '../../utils/format'

export default function BookingRequestModal({ service, open, onClose }) {
  const { user, createBooking } = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const [f, setF] = useState({ date: '', time: '10:00', note: '' })
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  if (open && !user) {
    return (
      <Modal open onClose={onClose} title="Sign in to request a booking"
        footer={<><Button variant="secondary" onClick={onClose}>Not now</Button><Button onClick={() => nav('/login', { state: { from: loc.pathname } })}>Sign in</Button></>}>
        <p className="text-ink-soft">Use a demo customer account to send a request. No real account is created.</p>
      </Modal>
    )
  }
  if (open && user.role !== 'customer') {
    return <Modal open onClose={onClose} title="Customer accounts only" footer={<Button onClick={onClose}>Close</Button>}><p className="text-ink-soft">Sign in as a customer to request a booking.</p></Modal>
  }
  const submit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!f.date) errors.date = 'Choose a date.'
    else if (f.date <= TODAY) errors.date = 'Choose a date after today.'
    if (!f.time) errors.time = 'Choose a time.'
    setErr(errors)
    if (Object.keys(errors).length) return
    createBooking({ serviceId: service.id, ...f })
    onClose()
    nav('/customer/bookings')
  }
  return (
    <Modal open={open} onClose={onClose} title="Request a booking"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="booking-form">Send request</Button></>}>
      <form id="booking-form" onSubmit={submit} noValidate className="space-y-4">
        <div className="rounded-md bg-slate-50 p-3 text-sm"><p className="font-semibold">{service.title}</p><p className="text-ink-soft">{priceLabel(service)} · estimate only, no payment is taken</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred date" type="date" min={TODAY} value={f.date} onChange={set('date')} error={err.date} />
          <Field label="Preferred time" type="time" value={f.time} onChange={set('time')} error={err.time} />
        </div>
        <Field label="What do you need done? (optional)" as="textarea" rows={3} value={f.note} onChange={set('note')} maxLength={300} />
      </form>
    </Modal>
  )
}
