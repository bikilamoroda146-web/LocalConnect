import { Link } from 'react-router-dom'
import { Users, Briefcase, ListChecks, CalendarCheck, ArrowRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import DataTable from '../../components/common/DataTable'
import Button from '../../components/common/Button'
import { StatusBadge, Badge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { formatDate } from '../../utils/format'

export default function AdminDashboard() {
  const { users, services, bookings, serviceOf, userOf, providerOf, reports, setUsers, toast, activity } = useApp()
  const queue = users.filter((u) => u.role === 'provider' && u.status === 'pending')
  const open = reports.filter((r) => r.status === 'open')
  const approve = (u) => { setUsers((all) => all.map((x) => (x.id === u.id ? { ...x, status: 'active' } : x))); toast(`${u.name} approved (demo)`) }
  const recentBookings = [...bookings].sort((a, b) => (b.updated ?? b.created ?? b.date).localeCompare(a.updated ?? a.created ?? a.date)).slice(0, 5)
  const recentActivity = activity.slice(0, 5)
  return (
    <>
      <PageHeader title="Overview" text="A snapshot of the sample data stored in this browser. These figures are illustrative, not live analytics." />
      <p role="note" className="mb-5 rounded-control border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-900">
        Administrator screens are frontend-only in this demo. They do not enforce administrator permissions; server-side authorization will be required when a backend is added.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Users" value={users.length} note={`${users.filter((u) => u.role === 'customer').length} customers`} />
        <StatCard icon={Briefcase} label="Providers" value={users.filter((u) => u.role === 'provider').length} note={`${queue.length} awaiting review`} />
        <StatCard icon={ListChecks} label="Services" value={services.length} note={`${services.filter((s) => s.published).length} published`} />
        <StatCard icon={CalendarCheck} label="Bookings" value={bookings.length} note={`${bookings.filter((b) => b.status === 'pending').length} pending`} />
      </div>
      <section className="mt-8" aria-labelledby="rb"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 id="rb" className="text-lg font-semibold">Recent bookings</h2><Link to="/admin/bookings" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">View all <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <DataTable empty="No booking records are available." rows={recentBookings} columns={[
          { key: 'id', header: 'Reference' }, { key: 's', header: 'Service', render: (b) => serviceOf(b.serviceId)?.title },
          { key: 'c', header: 'Customer', render: (b) => userOf(b.customerId)?.name }, { key: 'd', header: 'Date', render: (b) => formatDate(b.date) },
          { key: 'st', header: 'Status', render: (b) => <StatusBadge status={b.status} /> }]} /></section>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="q"><div className="mb-3 flex items-center justify-between gap-2"><h2 id="q" className="text-lg font-semibold">Provider review queue</h2><Link to="/admin/users" className="text-sm font-semibold text-brand-800 hover:underline">All users</Link></div>
          {queue.length === 0 ? <p className="card p-4 text-ink-soft">No providers waiting for review.</p> : <ul className="card divide-y divide-line">{queue.map((u) => <li key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-semibold">{u.name}</p><p className="text-sm text-ink-soft">{providerOf(u.providerId)?.profession ?? 'Provider'} · joined {formatDate(u.joined)}</p><p className="break-all text-xs text-ink-muted">{u.email}</p></div><Button size="sm" onClick={() => approve(u)}>Approve (demo)</Button></li>)}</ul>}</section>
        <section aria-labelledby="rp"><div className="mb-3 flex items-center justify-between gap-2"><h2 id="rp" className="text-lg font-semibold">Reported content</h2><Badge tone="amber">{open.length} open</Badge></div>
          {open.length === 0 ? <p className="card p-4 text-ink-soft">No open reports.</p> : <ul className="card divide-y divide-line">{open.slice(0, 4).map((r) => <li key={r.id} className="p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{r.target}</p><Badge tone="amber">Open</Badge></div><p className="mt-1 text-sm text-ink-soft">{r.reason}</p><p className="mt-1 text-xs text-ink-muted">Reported {formatDate(r.date)}</p></li>)}</ul>}
          <Button to="/admin/reports" variant="secondary" size="sm" className="mt-3">Go to reports</Button></section>
        <section aria-labelledby="activity-heading" className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-2"><h2 id="activity-heading" className="text-lg font-semibold">Recent demo activity</h2><span className="text-xs text-ink-muted">Actions recorded in this browser</span></div>
          {recentActivity.length === 0 ? <p className="card p-4 text-sm text-ink-soft">Admin and demo actions will appear here when activity is recorded.</p> : (
            <ul className="card divide-y divide-line">{recentActivity.map((item) => <li key={item.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm">{item.text}</p><time className="text-xs text-ink-muted" dateTime={item.at}>{new Date(item.at).toLocaleString()}</time></li>)}</ul>
          )}
        </section>
      </div>
    </>
  )
}
