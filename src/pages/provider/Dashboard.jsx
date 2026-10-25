import { Link } from 'react-router-dom'
import { CalendarCheck, Inbox, Clock, Briefcase, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import { StatusBadge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { formatDate, TODAY } from '../../utils/format'

export default function ProviderDashboard() {
  const { user, bookings, services, serviceOf, userOf, activity } = useApp()
  const pid = user.providerId
  const mine = bookings.filter((b) => b.providerId === pid)
  const pending = mine.filter((b) => b.status === 'pending')
  const upcoming = mine.filter((b) => b.status === 'confirmed' && b.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))
  const own = services.filter((s) => s.providerId === pid)
  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(' ')[0]}`} text="Your requests and appointments at a glance." action={<Button to="/provider/services"><Plus size={16} /> Add a service</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Total bookings" value={mine.length} />
        <StatCard icon={Inbox} label="Pending requests" value={pending.length} note={pending.length ? 'Waiting for your reply' : 'All caught up'} />
        <StatCard icon={Clock} label="Upcoming appointments" value={upcoming.length} />
        <StatCard icon={Briefcase} label="Published services" value={own.filter((s) => s.published).length} note={`${own.length} total`} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="pr"><div className="mb-3 flex justify-between"><h2 id="pr" className="text-lg font-semibold">Pending requests</h2><Link to="/provider/bookings" className="text-sm font-semibold text-brand-800 hover:underline">Manage</Link></div>
          {pending.length === 0 ? <p className="card p-4 text-ink-soft">No pending requests.</p> : <ul className="space-y-3">{pending.slice(0, 4).map((b) => <li key={b.id} className="card flex items-center justify-between p-4"><div><p className="font-semibold">{serviceOf(b.serviceId)?.title}</p><p className="text-sm text-ink-soft">{userOf(b.customerId)?.name} · {formatDate(b.date)}</p></div><StatusBadge status={b.status} /></li>)}</ul>}</section>
        <section aria-labelledby="ac"><h2 id="ac" className="mb-3 text-lg font-semibold">Recent activity</h2>
          {activity.length === 0 ? <p className="card p-4 text-ink-soft">Actions you take will be listed here.</p> : <ul className="card divide-y divide-line">{activity.slice(0, 5).map((a) => <li key={a.id} className="px-4 py-3 text-sm">{a.text}</li>)}</ul>}</section>
        <section aria-labelledby="qa" className="lg:col-span-2"><h2 id="qa" className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="card flex flex-wrap gap-2 p-4">{[['Manage services', '/provider/services'], ['Review requests', '/provider/bookings'], ['Set availability', '/provider/availability'], ['My Portfolio', '/provider/portfolio'], ['Edit profile', '/provider/profile']].map(([l, t]) => <Button key={l} to={t} variant="secondary">{l}</Button>)}</div></section>
      </div>
    </>
  )
}
