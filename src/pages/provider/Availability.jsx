import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import { useApp } from '../../app/AppContext'
import { validateRanges } from '../../utils/validation'

export default function Availability() {
  const { user, getAvailability, saveAvailability, DAYS, toast } = useApp()
  const saved = getAvailability(user.providerId)
  const [a, setA] = useState(structuredClone(saved))
  const [errs, setErrs] = useState({})
  const dirty = JSON.stringify(a) !== JSON.stringify(saved)
  const patch = (day, fn) => setA((cur) => ({ ...cur, [day]: fn(cur[day]) }))
  const save = () => {
    const e = {}
    DAYS.forEach((d) => { if (a[d].on) { const m = a[d].slots.length ? validateRanges(a[d].slots) : 'Add at least one time slot or turn the day off.'; if (m) e[d] = m } })
    setErrs(e)
    if (Object.keys(e).length) return toast('Fix the highlighted days before saving.', 'error')
    saveAvailability(user.providerId, a)
  }
  return (
    <>
      <PageHeader title="Availability" text="Set the days and hours customers can request." action={<div className="flex gap-2"><Button variant="secondary" disabled={!dirty} onClick={() => { setA(structuredClone(saved)); setErrs({}) }}>Discard changes</Button><Button disabled={!dirty} onClick={save}>Save availability</Button></div>} />
      <ul className="space-y-3">{DAYS.map((d) => (
        <li key={d} className="card p-4">
          <div className="flex items-center justify-between">
            <label className="flex min-h-11 items-center gap-3 font-semibold"><input type="checkbox" className="h-5 w-5 accent-brand" checked={a[d].on} onChange={(e) => patch(d, (x) => ({ ...x, on: e.target.checked }))} />{d}</label>
            {a[d].on && <Button size="sm" variant="ghost" onClick={() => patch(d, (x) => ({ ...x, slots: [...x.slots, { start: '13:00', end: '15:00' }] }))}><Plus size={14} /> Add slot</Button>}
          </div>
          {a[d].on && <div className="mt-2 space-y-2">{a[d].slots.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor={`${d}s${i}`}>{d} slot {i + 1} start</label><input id={`${d}s${i}`} type="time" className="input !w-auto" value={s.start} onChange={(e) => patch(d, (x) => ({ ...x, slots: x.slots.map((y, j) => j === i ? { ...y, start: e.target.value } : y) }))} />
              <span className="text-ink-muted">to</span>
              <label className="sr-only" htmlFor={`${d}e${i}`}>{d} slot {i + 1} end</label><input id={`${d}e${i}`} type="time" className="input !w-auto" value={s.end} onChange={(e) => patch(d, (x) => ({ ...x, slots: x.slots.map((y, j) => j === i ? { ...y, end: e.target.value } : y) }))} />
              <button aria-label={`Remove ${d} slot ${i + 1}`} onClick={() => patch(d, (x) => ({ ...x, slots: x.slots.filter((_, j) => j !== i) }))} className="flex h-10 w-10 items-center justify-center rounded text-ink-muted hover:bg-slate-100"><Trash2 size={16} /></button>
            </div>))}
            {errs[d] && <p role="alert" className="text-sm text-red-700">{errs[d]}</p>}</div>}
          {!a[d].on && <p className="text-sm text-ink-muted">Unavailable</p>}
        </li>))}</ul>
    </>
  )
}
