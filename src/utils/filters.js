import { providerById } from '../data/providers'
import { categoryById } from '../data/categories'

export const defaultFilters = { q: '', category: '', location: '', min: '', max: '', rating: 0, sort: 'relevance' }

export function filterServices(list, f) {
  const q = f.q.trim().toLowerCase()
  const out = list.filter((s) => {
    const p = providerById(s.providerId)
    if (!s.published) return false
    if (f.category && s.category !== f.category) return false
    if (f.location && s.area !== f.location) return false
    if (f.min !== '' && s.price < Number(f.min)) return false
    if (f.max !== '' && s.price > Number(f.max)) return false
    if (f.rating && (p?.rating ?? 0) < f.rating) return false
    if (q) {
      const hay = [s.title, s.desc, p?.name, p?.profession, categoryById(s.category)?.name, s.area].join(' ').toLowerCase()
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false
    }
    return true
  })
  const score = (s) => {
    if (!q) return 0
    const p = providerById(s.providerId)
    return (s.title.toLowerCase().includes(q) ? 3 : 0) + (p?.name.toLowerCase().includes(q) ? 2 : 0) + (s.desc.toLowerCase().includes(q) ? 1 : 0)
  }
  const rate = (s) => providerById(s.providerId)?.rating ?? 0
  const sorters = {
    relevance: (a, b) => score(b) - score(a) || rate(b) - rate(a),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => rate(b) - rate(a),
  }
  return [...out].sort(sorters[f.sort] ?? sorters.relevance)
}

export const activeFilterChips = (f) => {
  const chips = []
  if (f.q) chips.push({ key: 'q', label: `“${f.q}”` })
  if (f.category) chips.push({ key: 'category', label: categoryById(f.category)?.name })
  if (f.location) chips.push({ key: 'location', label: f.location })
  if (f.min !== '') chips.push({ key: 'min', label: `Min ETB ${f.min}` })
  if (f.max !== '') chips.push({ key: 'max', label: `Max ETB ${f.max}` })
  if (f.rating) chips.push({ key: 'rating', label: `${f.rating}+ stars` })
  return chips
}
