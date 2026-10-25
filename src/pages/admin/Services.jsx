import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Button from '../../components/common/Button'
import { Badge } from '../../components/common/Badges'
import { useApp } from '../../app/AppContext'
import { categories, categoryById } from '../../data/categories'
import { formatPrice } from '../../utils/format'

export default function AdminServices() {
  const { services, providers, providerOf, togglePublish } = useApp()
  const [prov, setProv] = useState(''), [cat, setCat] = useState(''), [pub, setPub] = useState('')
  const rows = services.filter((s) => (!prov || s.providerId === prov) && (!cat || s.category === cat) && (!pub || String(s.published) === pub))
  return (
    <>
      <PageHeader title="Services" text={`${rows.length} listings`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="ap">Provider</label><select id="ap" className="input sm:!w-52" value={prov} onChange={(e) => setProv(e.target.value)}><option value="">All providers</option>{providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <label className="sr-only" htmlFor="ac">Category</label><select id="ac" className="input sm:!w-52" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <label className="sr-only" htmlFor="apub">Status</label><select id="apub" className="input sm:!w-44" value={pub} onChange={(e) => setPub(e.target.value)}><option value="">Any status</option><option value="true">Published</option><option value="false">Unpublished</option></select>
      </div>
      <DataTable empty="No services match these filters." rows={rows} columns={[
        { key: 't', header: 'Service', render: (s) => <span className="font-medium">{s.title}</span> }, { key: 'p', header: 'Provider', render: (s) => providerOf(s.providerId)?.name },
        { key: 'c', header: 'Category', render: (s) => categoryById(s.category)?.name }, { key: 'pr', header: 'Price', render: (s) => formatPrice(s.price) },
        { key: 'st', header: 'Status', render: (s) => <Badge tone={s.published ? 'green' : 'slate'}>{s.published ? 'Published' : 'Unpublished'}</Badge> },
        { key: 'a', header: 'Moderation', render: (s) => <Button size="sm" variant="secondary" onClick={() => togglePublish(s.id)}>{s.published ? 'Unpublish' : 'Publish'}</Button> }]} />
    </>
  )
}
