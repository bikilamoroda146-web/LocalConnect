import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Briefcase } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Field from '../../components/common/Field'
import Modal, { ConfirmDialog } from '../../components/common/Modal'
import ServiceArt from '../../components/common/ServiceArt'
import { Badge } from '../../components/common/Badges'
import { EmptyState } from '../../components/common/States'
import { useApp } from '../../app/AppContext'
import { categories, categoryById } from '../../data/categories'
import { priceLabel } from '../../utils/format'

const blank = { title: '', category: 'home-repairs', desc: '', price: '', unit: 'per visit', area: '', image: '', includesText: '' }

function ServiceForm({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial)
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const errors = {}
    if (f.title.trim().length < 4) errors.title = 'Enter a title of at least 4 characters.'
    if (f.desc.trim().length < 20) errors.desc = 'Describe the service in at least 20 characters.'
    if (!(Number(f.price) > 0)) errors.price = 'Enter a price greater than 0.'
    if (!f.area.trim()) errors.area = 'Enter the area you serve.'
    if (f.image && !/^https?:\/\//.test(f.image)) errors.image = 'Use an image link starting with http:// or https://.'
    setErr(errors)
    if (Object.keys(errors).length) return
    const { includesText, ...rest } = f
    onSave({ ...rest, title: f.title.trim(), desc: f.desc.trim(), price: Number(f.price), includes: includesText.split('\n').map((x) => x.trim()).filter(Boolean) })
    onClose()
  }
  return (
    <Modal open onClose={onClose} title={f.id ? 'Edit service' : 'Add a service'} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="svc-form">{f.id ? 'Save changes' : 'Publish service'}</Button></>}>
      <form id="svc-form" onSubmit={submit} noValidate className="space-y-4">
        <Field label="Title" value={f.title} onChange={set('title')} error={err.title} />
        <Field label="Category" as="select" value={f.category} onChange={set('category')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Field>
        <Field label="Description" as="textarea" rows={3} value={f.desc} onChange={set('desc')} error={err.desc} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price (ETB)" type="number" min="1" value={f.price} onChange={set('price')} error={err.price} />
          <Field label="Price type" as="select" value={f.unit} onChange={set('unit')}>{['per visit', 'per hour', 'per item', 'estimate', 'from'].map((u) => <option key={u}>{u}</option>)}</Field>
        </div>
        <Field label="Service area" value={f.area} onChange={set('area')} error={err.area} />
        <Field label="What’s included (one per line)" as="textarea" rows={3} value={f.includesText} onChange={set('includesText')} />
        <Field label="Image link (optional)" type="url" value={f.image} onChange={set('image')} error={err.image} hint="Preview appears below if the link loads." />
        <ServiceArt category={f.category} src={!err.image && f.image ? f.image : undefined} className="h-32 rounded-md" alt="Image preview" />
      </form>
    </Modal>
  )
}

export default function ProviderServices() {
  const { user, services, saveService, togglePublish, deleteService } = useApp()
  const [q, setQ] = useState('')
  const [form, setForm] = useState(null)
  const [del, setDel] = useState(null)
  const own = services.filter((s) => s.providerId === user.providerId && s.title.toLowerCase().includes(q.toLowerCase()))
  const open = (s) => setForm(s ? { ...s, includesText: (s.includes ?? []).join('\n'), image: s.image ?? '' } : { ...blank, area: '' })
  return (
    <>
      <PageHeader title="My services" text="Published services appear in search. Unpublished ones stay hidden." action={<Button onClick={() => open()}><Plus size={16} /> Add a service</Button>} />
      <div className="relative mb-4 max-w-sm"><label htmlFor="sq" className="sr-only">Search your services</label><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" /><input id="sq" className="input pl-9" placeholder="Search your services" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {own.length === 0 ? <EmptyState icon={Briefcase} title={q ? 'No matching services' : 'You have no services yet'} text="Add a service with a clear price and service area." actionLabel="Add a service" onAction={() => open()} /> : (
        <ul className="space-y-3">{own.map((s) => (
          <li key={s.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <ServiceArt category={s.category} src={s.image} className="h-20 w-full rounded-md sm:w-28" size={28} alt="" />
            <div className="flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{s.title}</p><Badge tone={s.published ? 'green' : 'slate'}>{s.published ? 'Published' : 'Unpublished'}</Badge></div>
              <p className="text-sm text-ink-soft">{categoryById(s.category)?.name} · {s.area} · {priceLabel(s)}</p></div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => open(s)}><Pencil size={14} /> Edit</Button>
              <Button size="sm" variant="secondary" onClick={() => togglePublish(s.id)}>{s.published ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}</Button>
              <Button size="sm" variant="ghost" className="text-red-700" onClick={() => setDel(s)}><Trash2 size={14} /> Delete</Button>
            </div>
          </li>))}</ul>)}
      {form && <ServiceForm initial={form} onClose={() => setForm(null)} onSave={(d) => saveService({ ...d, providerId: user.providerId })} />}
      <ConfirmDialog open={!!del} danger onClose={() => setDel(null)} title="Delete this service?" confirmLabel="Delete service" message={`“${del?.title}” will be removed permanently from this demo.`} onConfirm={() => deleteService(del.id)} />
    </>
  )
}
