import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import Modal, { ConfirmDialog } from '../../components/common/Modal'
import { Badge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { formatDate } from '../../utils/format'

const tone = { active: 'green', pending: 'amber', suspended: 'red' }
export default function AdminUsers() {
  const { users, setUsers, toast } = useApp()
  const [q, setQ] = useState(''), [role, setRole] = useState(''), [status, setStatus] = useState(''), [page, setPage] = useState(1)
  const [sel, setSel] = useState(null), [toggle, setToggle] = useState(null)
  const rows = useMemo(() => users.filter((u) => (!role || u.role === role) && (!status || u.status === status) && (u.name + u.email).toLowerCase().includes(q.toLowerCase())), [users, q, role, status])
  const pages = Math.ceil(rows.length / 8)
  const change = (fn) => (e) => { fn(e.target.value); setPage(1) }
  const flip = (u) => { const next = u.status === 'suspended' ? 'active' : 'suspended'; setUsers((all) => all.map((x) => (x.id === u.id ? { ...x, status: next } : x))); toast(`User ${next === 'active' ? 'reactivated' : 'suspended'}`) }
  return (
    <>
      <PageHeader title="Users" text={`${rows.length} matching accounts (sample data)`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><label htmlFor="uq" className="sr-only">Search users</label><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" /><input id="uq" className="input pl-9" placeholder="Search name or email" value={q} onChange={change(setQ)} /></div>
        <label className="sr-only" htmlFor="ur">Role</label><select id="ur" className="input sm:!w-40" value={role} onChange={change(setRole)}><option value="">All roles</option><option>customer</option><option>provider</option><option>admin</option></select>
        <label className="sr-only" htmlFor="us">Status</label><select id="us" className="input sm:!w-40" value={status} onChange={change(setStatus)}><option value="">All statuses</option><option>active</option><option>pending</option><option>suspended</option></select>
      </div>
      <DataTable empty="No users match these filters." rows={rows.slice((page - 1) * 8, page * 8)} columns={[
        { key: 'name', header: 'Name', render: (u) => <span className="font-medium">{u.name}</span> }, { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role', render: (u) => <span className="capitalize">{u.role}</span> }, { key: 'status', header: 'Status', render: (u) => <Badge tone={tone[u.status]}>{u.status}</Badge> },
        { key: 'a', header: 'Actions', render: (u) => <div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setSel(u)}>Details</Button>{u.role !== 'admin' && <Button size="sm" variant="ghost" onClick={() => setToggle(u)}>{u.status === 'suspended' ? 'Reactivate' : 'Suspend'}</Button>}</div> }]} />
      <Pagination page={page} pages={pages} onChange={setPage} />
      <Modal open={!!sel} onClose={() => setSel(null)} title="User details" footer={<Button onClick={() => setSel(null)}>Close</Button>}>
        {sel && <dl className="divide-y divide-line text-sm">{[['Name', sel.name], ['Email', sel.email], ['Role', sel.role], ['Status', sel.status], ['Location', sel.area || '—'], ['Joined', formatDate(sel.joined)]].map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-ink-muted">{k}</dt><dd className="font-medium capitalize">{v}</dd></div>)}</dl>}
      </Modal>
      <ConfirmDialog open={!!toggle} onClose={() => setToggle(null)} danger={toggle?.status !== 'suspended'} title={toggle?.status === 'suspended' ? 'Reactivate user?' : 'Suspend user?'} confirmLabel={toggle?.status === 'suspended' ? 'Reactivate' : 'Suspend'} message="This only changes the demo data stored in this browser." onConfirm={() => flip(toggle)} />
    </>
  )
}
