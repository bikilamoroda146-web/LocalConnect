import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, X, SearchX, Search } from 'lucide-react'
import ServiceCard from '../../components/services/ServiceCard'
import Pagination from '../../components/common/Pagination'
import { EmptyState, CardSkeleton } from '../../components/common/States'
import Button from '../../components/common/Button'
import Field from '../../components/common/Field'
import { categories, locations } from '../../data/categories'
import { filterServices, activeFilterChips, defaultFilters } from '../../utils/filters'
import { useApp } from '../../app/AppContext'

const PAGE_SIZE = 6

function FilterPanel({ f, set, clear }) {
  return (
    <div className="space-y-5">
      <Field label="Category" as="select" value={f.category} onChange={(e) => set({ category: e.target.value })}>
        <option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Field>
      <Field label="Location" as="select" value={f.location} onChange={(e) => set({ location: e.target.value })}>
        <option value="">Any location</option>{locations.map((l) => <option key={l}>{l}</option>)}
      </Field>
      <fieldset><legend className="mb-1.5 text-sm font-medium">Price (ETB)</legend>
        <div className="flex gap-2">
          <input aria-label="Minimum price" type="number" min="0" inputMode="numeric" placeholder="Min" className="input" value={f.min} onChange={(e) => set({ min: e.target.value })} />
          <input aria-label="Maximum price" type="number" min="0" inputMode="numeric" placeholder="Max" className="input" value={f.max} onChange={(e) => set({ max: e.target.value })} />
        </div>
      </fieldset>
      <Field label="Minimum rating" as="select" value={f.rating} onChange={(e) => set({ rating: Number(e.target.value) })}>
        <option value={0}>Any rating</option><option value={4}>4.0 and up</option><option value={4.5}>4.5 and up</option><option value={4.8}>4.8 and up</option>
      </Field>
      <Button variant="secondary" className="w-full" onClick={clear}>Clear all filters</Button>
    </div>
  )
}

export default function Services() {
  const { services } = useApp()
  const [params, setParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [layout, setLayout] = useState('grid')
  const [drawer, setDrawer] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t) }, [])

  const f = useMemo(() => ({
    ...defaultFilters,
    q: params.get('q') ?? '', category: params.get('category') ?? '', location: params.get('location') ?? '',
    min: params.get('min') ?? '', max: params.get('max') ?? '', rating: Number(params.get('rating') ?? 0), sort: params.get('sort') ?? 'relevance',
  }), [params])
  const set = (patch) => {
    const next = { ...f, ...patch }
    const p = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v !== '' && v !== 0 && !(k === 'sort' && v === 'relevance')) p.set(k, v) })
    setParams(p, { replace: true }); setPage(1)
  }
  const clear = () => { setParams({}, { replace: true }); setPage(1) }
  const results = useMemo(() => filterServices(services, f), [services, f])
  const pages = Math.ceil(results.length / PAGE_SIZE)
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const chips = activeFilterChips(f)

  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-3xl font-semibold">Browse services</h1>
      <p className="mt-1 text-ink-soft">Search local professionals, compare prices and request a booking.</p>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mt-5 max-w-2xl">
        <label htmlFor="dq" className="sr-only">Search by service, provider or keyword</label>
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input id="dq" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search by service, provider or keyword" className="input pl-10" />
      </form>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters"><div className="card sticky top-24 p-5"><FilterPanel f={f} set={set} clear={clear} /></div></aside>
        <section aria-label="Results">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft" aria-live="polite"><span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'service' : 'services'} found</p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal size={16} /> Filters{chips.length > 0 && ` (${chips.length})`}</Button>
              <label className="sr-only" htmlFor="sort">Sort by</label>
              <select id="sort" className="input !w-auto !py-1.5 text-sm" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
                <option value="relevance">Relevance</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Highest rated</option>
              </select>
              <div className="hidden overflow-hidden rounded-md border border-slate-300 sm:flex" role="group" aria-label="Layout">
                {[['grid', LayoutGrid, 'Grid view'], ['list', List, 'List view']].map(([id, Icon, l]) => (
                  <button key={id} onClick={() => setLayout(id)} aria-pressed={layout === id} aria-label={l} className={`flex h-9 w-9 items-center justify-center ${layout === id ? 'bg-brand-50 text-brand-800' : 'bg-white text-ink-soft'}`}><Icon size={16} /></button>
                ))}
              </div>
            </div>
          </div>
          {chips.length > 0 && (
            <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map((c) => <li key={c.key}><button onClick={() => set({ [c.key]: c.key === 'rating' ? 0 : '' })} className="flex items-center gap-1 rounded bg-brand-50 px-2 py-1 text-sm text-brand-800" aria-label={`Remove filter ${c.label}`}>{c.label}<X size={14} /></button></li>)}
              <li><button onClick={clear} className="text-sm font-medium text-ink-soft underline">Clear all</button></li>
            </ul>
          )}
          <div className="mt-5">
            {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
              : shown.length === 0 ? <EmptyState icon={SearchX} title="No services match these filters" text="Try a broader search, a different location or a wider price range." actionLabel="Clear all filters" onAction={clear} />
              : <div className={layout === 'list' ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'}>{shown.map((s) => <ServiceCard key={s.id} service={s} layout={layout} />)}</div>}
          </div>
          <Pagination page={page} pages={pages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0 }) }} />
        </section>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Filters</h2><button onClick={() => setDrawer(false)} aria-label="Close filters" className="p-2"><X /></button></div>
            <FilterPanel f={f} set={set} clear={clear} />
            <Button className="mt-3 w-full" onClick={() => setDrawer(false)}>Show {results.length} results</Button>
          </div>
        </div>
      )}
    </div>
  )
}
