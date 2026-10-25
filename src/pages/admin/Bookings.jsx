import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import { StatusBadge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { STATUS } from '../../utils/bookings'
import { formatDate } from '../../utils/format'

export default function AdminBookings() {
  const { bookings, serviceOf, userOf, providerOf } = useApp()
  const [status, setStatus] = useState(''), [q, setQ] = useState(''), [page, setPage] = useState(1)
  const rows = bookings.filter((b) => (!status || b.status === status) && b.id.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Bookings" text={`${rows.length} bookings`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="bq">Search by reference</label><input id="bq" className="input sm:max-w-xs" placeholder="Search reference, e.g. BK-1001" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        <label className="sr-only" htmlFor="bs">Status</label><select id="bs" className="input sm:!w-44" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}><option value="">All statuses</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
      </div>
      <DataTable empty="No bookings match these filters." rows={rows.slice((page - 1) * 8, page * 8)} columns={[
        { key: 'id', header: 'Reference', render: (b) => <span className="font-medium">{b.id}</span> }, { key: 's', header: 'Service', render: (b) => serviceOf(b.serviceId)?.title },
        { key: 'c', header: 'Customer', render: (b) => userOf(b.customerId)?.name }, { key: 'p', header: 'Provider', render: (b) => providerOf(b.providerId)?.name },
        { key: 'd', header: 'Date', render: (b) => formatDate(b.date) }, { key: 'st', header: 'Status', render: (b) => <StatusBadge status={b.status} /> }]} />
      <Pagination page={page} pages={Math.ceil(rows.length / 8)} onChange={setPage} />
    </>
  )
}
