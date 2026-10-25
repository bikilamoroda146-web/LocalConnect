import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import { Badge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { categories } from '../../data/categories'
import { STATUS } from '../../utils/bookings'
import { Users, Briefcase } from 'lucide-react'

function Bars({ data, label }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <ul className="space-y-3" aria-label={label}>{data.map((d) => (
      <li key={d.label}><div className="mb-1 flex justify-between text-sm"><span>{d.label}</span><span className="font-semibold">{d.value}</span></div>
        <div className="h-2.5 rounded bg-slate-100" role="presentation"><div className="h-full rounded bg-brand" style={{ width: `${(d.value / max) * 100}%` }} /></div></li>))}</ul>
  )
}

export default function AdminReports() {
  const { bookings, services, users, reports, resolveReport } = useApp()
  const byStatus = Object.entries(STATUS).map(([k, v]) => ({ label: v.label, value: bookings.filter((b) => b.status === k).length }))
  const byCat = categories.map((c) => ({ label: c.name, value: services.filter((s) => s.category === c.id).length }))
  const months = ['Aug', 'Sep', 'Oct', 'Nov']
  const byMonth = months.map((m, i) => ({ label: m, value: bookings.filter((b) => b.date.slice(5, 7) === String(8 + i).padStart(2, '0')).length }))
  return (
    <>
      <PageHeader title="Reports" text="All figures are calculated from sample data in this browser and are illustrative." />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={Users} label="Customers" value={users.filter((u) => u.role === 'customer').length} />
        <StatCard icon={Briefcase} label="Providers" value={users.filter((u) => u.role === 'provider').length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="m"><h2 id="m" className="mb-4 font-semibold">Booking activity by appointment month</h2><Bars data={byMonth} label="Bookings per month" /></section>
        <section className="card p-5" aria-labelledby="s"><h2 id="s" className="mb-4 font-semibold">Status breakdown</h2><Bars data={byStatus} label="Bookings by status" /></section>
        <section className="card p-5 lg:col-span-2" aria-labelledby="c"><h2 id="c" className="mb-4 font-semibold">Services by category</h2><Bars data={byCat} label="Services by category" /></section>
      </div>
      <section className="mt-8" aria-labelledby="r"><h2 id="r" className="mb-3 text-lg font-semibold">Reported content</h2>
        <ul className="card divide-y divide-line">{reports.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-semibold">{r.target}</p><p className="text-sm text-ink-soft">{r.reason}</p></div>
            <div className="flex items-center gap-3"><Badge tone={r.status === 'open' ? 'amber' : 'green'}>{r.status === 'open' ? 'Open' : 'Resolved'}</Badge>{r.status === 'open' && <Button size="sm" variant="secondary" onClick={() => resolveReport(r.id)}>Resolve</Button>}</div>
          </li>))}</ul></section>
    </>
  )
}
