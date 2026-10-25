import { Link } from 'react-router-dom'
import { CalendarCheck, Clock, CheckCircle2, Heart, Search } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import { StatusBadge } from '../../components/common/Badges'
import { EmptyState } from '../../components/common/States'
import { useApp } from '../../app/AppContext'
import { formatDate, TODAY } from '../../utils/format'
import { isUpcoming } from '../../utils/bookings'

export default function CustomerDashboard() {
  const { user, bookings, serviceOf, providerOf, favorites, recent, activity } = useApp()
  const mine = bookings.filter((b) => b.customerId === user.id)
  const upcoming = mine.filter((b) => isUpcoming(b, TODAY)).sort((a, b) => a.date.localeCompare(b.date))
  const count = (s) => mine.filter((b) => b.status === s).length
  const recentItems = recent.map((k) => (k.startsWith('p') ? { k, label: providerOf(k)?.name, to: `/providers/${k}` } : { k, label: serviceOf(k)?.title, to: `/services/${k}` })).filter((x) => x.label).slice(0, 4)
  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} text="Here is what is happening with your bookings." action={<Button to="/services"><Search size={16} /> Find a service</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Upcoming" value={upcoming.length} />
        <StatCard icon={Clock} label="Pending" value={count('pending')} />
        <StatCard icon={CheckCircle2} label="Completed" value={count('completed')} />
        <StatCard icon={Heart} label="Favorites" value={favorites.length} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="up"><div className="mb-3 flex justify-between"><h2 id="up" className="text-lg font-semibold">Upcoming bookings</h2><Link to="/customer/bookings" className="text-sm font-semibold text-brand-800 hover:underline">View all</Link></div>
          {upcoming.length === 0 ? <EmptyState icon={CalendarCheck} title="No upcoming bookings" text="Confirmed appointments will show here." actionLabel="Browse services" actionTo="/services" /> :
            <ul className="space-y-3">{upcoming.slice(0, 3).map((b) => <li key={b.id} className="card flex items-center justify-between gap-3 p-4"><div><p className="font-semibold">{serviceOf(b.serviceId)?.title}</p><p className="text-sm text-ink-soft">{providerOf(b.providerId)?.name} · {formatDate(b.date)} at {b.time}</p></div><StatusBadge status={b.status} /></li>)}</ul>}</section>
        <section aria-labelledby="qa"><h2 id="qa" className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="card grid gap-2 p-4 sm:grid-cols-2">{[['Browse services', '/services'], ['My bookings', '/customer/bookings'], ['Saved favorites', '/customer/favorites'], ['Edit profile', '/customer/profile']].map(([l, t]) => <Button key={l} to={t} variant="secondary">{l}</Button>)}</div></section>
        <section aria-labelledby="rv"><h2 id="rv" className="mb-3 text-lg font-semibold">Recently viewed</h2>
          {recentItems.length === 0 ? <p className="card p-4 text-ink-soft">Services and providers you open will appear here.</p> : <ul className="card divide-y divide-line">{recentItems.map((r) => <li key={r.k}><Link className="block px-4 py-3 text-sm font-medium hover:bg-slate-50" to={r.to}>{r.label}</Link></li>)}</ul>}</section>
        <section aria-labelledby="act"><h2 id="act" className="mb-3 text-lg font-semibold">Recent activity</h2>
          {activity.length === 0 ? <p className="card p-4 text-ink-soft">Your booking actions will be listed here.</p> : <ul className="card divide-y divide-line">{activity.slice(0, 5).map((a) => <li key={a.id} className="px-4 py-3 text-sm">{a.text}</li>)}</ul>}</section>
      </div>
    </>
  )
}
