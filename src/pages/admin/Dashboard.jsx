import { Link } from 'react-router-dom'
import { Users, Briefcase, ListChecks, CalendarCheck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import DataTable from '../../components/common/DataTable'
import Button from '../../components/common/Button'
import { StatusBadge, Badge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { formatDate } from '../../utils/format'

export default function AdminDashboard() {
  const { users, services, bookings, serviceOf, userOf, providerOf, reports, setUsers, toast } = useApp()
  const queue = users.filter((u) => u.role === 'provider' && u.status === 'pending')
  const open = reports.filter((r) => r.status === 'open')
  const approve = (u) => { setUsers((all) => all.map((x) => (x.id === u.id ? { ...x, status: 'active' } : x))); toast(`${u.name} approved (demo)`) }
  return (
    <>
      <PageHeader title="Overview" text="Sample metrics, illustrative only." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Users" value={users.filter((u) => u.role === 'customer').length} note="Customers" />
        <StatCard icon={Briefcase} label="Providers" value={users.filter((u) => u.role === 'provider').length} />
        <StatCard icon={ListChecks} label="Services" value={services.length} note={`${services.filter((s) => s.published).length} published`} />
        <StatCard icon={CalendarCheck} label="Bookings" value={bookings.length} />
      </div>
      <section className="mt-8" aria-labelledby="rb"><div className="mb-3 flex justify-between"><h2 id="rb" className="text-lg font-semibold">Recent bookings</h2><Link to="/admin/bookings" className="text-sm font-semibold text-brand-800 hover:underline">View all</Link></div>
        <DataTable rows={bookings.slice(0, 5)} columns={[
          { key: 'id', header: 'Reference' }, { key: 's', header: 'Service', render: (b) => serviceOf(b.serviceId)?.title },
          { key: 'c', header: 'Customer', render: (b) => userOf(b.customerId)?.name }, { key: 'd', header: 'Date', render: (b) => formatDate(b.date) },
          { key: 'st', header: 'Status', render: (b) => <StatusBadge status={b.status} /> }]} /></section>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="q"><h2 id="q" className="mb-3 text-lg font-semibold">Provider review queue</h2>
          {queue.length === 0 ? <p className="card p-4 text-ink-soft">No providers waiting.</p> : <ul className="card divide-y divide-line">{queue.map((u) => <li key={u.id} className="flex items-center justify-between gap-3 p-4"><div><p className="font-semibold">{u.name}</p><p className="text-sm text-ink-soft">{providerOf(u.providerId)?.profession} · joined {formatDate(u.joined)}</p></div><Button size="sm" onClick={() => approve(u)}>Approve</Button></li>)}</ul>}</section>
        <section aria-labelledby="rp"><h2 id="rp" className="mb-3 text-lg font-semibold">Reported content</h2>
          {open.length === 0 ? <p className="card p-4 text-ink-soft">No open reports.</p> : <ul className="card divide-y divide-line">{open.map((r) => <li key={r.id} className="p-4"><div className="flex justify-between gap-2"><p className="font-semibold">{r.target}</p><Badge tone="amber">Open</Badge></div><p className="text-sm text-ink-soft">{r.reason}</p></li>)}</ul>}
          <Button to="/admin/reports" variant="secondary" size="sm" className="mt-3">Go to reports</Button></section>
      </div>
    </>
  )
}
