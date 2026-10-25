import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, MapPin, ChevronRight, CalendarDays } from 'lucide-react'
import ServiceArt from '../../components/common/ServiceArt'
import ProfileAvatar from '../../components/common/ProfileAvatar'
import Rating from '../../components/common/Rating'
import Button from '../../components/common/Button'
import FavoriteButton from '../../components/common/FavoriteButton'
import { VerificationBadge } from '../../components/common/Badges'
import ServiceCard from '../../components/services/ServiceCard'
import BookingRequestModal from '../../components/bookings/BookingRequestModal'
import AvailabilityPreview from '../../components/providers/AvailabilityPreview'
import NotFound from './NotFound'
import { categoryById } from '../../data/categories'
import { priceLabel } from '../../utils/format'
import { useApp } from '../../app/AppContext'

export default function ServiceDetail() {
  const { id } = useParams()
  const { serviceOf, providerOf, services, reviews, markViewed } = useApp()
  const [open, setOpen] = useState(false)
  const s = serviceOf(id)
  useEffect(() => { if (s) markViewed(s.id) }, [s?.id, markViewed]) // eslint-disable-line
  if (!s) return <NotFound message="We could not find that service." />
  const p = providerOf(s.providerId)
  const cat = categoryById(s.category)
  const related = services.filter((x) => x.id !== s.id && x.published && x.category === s.category).slice(0, 3)
  const revs = reviews.filter((r) => r.providerId === s.providerId)
  return (
    <div className="container-page py-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link to="/" className="hover:underline">Home</Link><ChevronRight size={14} />
        <Link to="/services" className="hover:underline">Services</Link><ChevronRight size={14} />
        <Link to={`/services?category=${s.category}`} className="hover:underline">{cat?.name}</Link><ChevronRight size={14} />
        <span aria-current="page" className="font-medium text-ink">{s.title}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <ServiceArt category={s.category} hue={p?.hue} className="h-56 rounded-lg sm:h-72" size={88} alt={`${cat?.name} service`} />
          <div>
            <p className="text-sm font-medium text-brand-800">{cat?.name}</p>
            <h1 className="mt-1 text-3xl font-semibold">{s.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-ink-soft"><MapPin size={16} /> Serves {s.area}</p>
            {!s.published && <p className="mt-3 rounded bg-amber-50 px-3 py-2 text-sm text-amber-900">This service is currently unpublished.</p>}
            <p className="mt-4 max-w-prose text-lg text-ink-soft">{s.desc}</p>
          </div>
          <section aria-labelledby="inc"><h2 id="inc" className="text-xl font-semibold">What’s included</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">{s.includes.map((i) => <li key={i} className="flex items-start gap-2"><Check size={18} className="mt-0.5 shrink-0 text-brand" />{i}</li>)}</ul></section>
          <section aria-labelledby="port"><h2 id="port" className="text-xl font-semibold">Portfolio</h2>
            <p className="mt-1 text-sm text-ink-muted">Sample work images are placeholders in this demo.</p>
            <div className="mt-3 grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => <ServiceArt key={i} category={s.category} hue={(p?.hue ?? 160) + i * 14} className="h-24 rounded-md sm:h-32" size={32} alt={`Sample work ${i + 1} (placeholder)`} />)}</div></section>
          <section aria-labelledby="av"><h2 id="av" className="text-xl font-semibold">Availability preview</h2><div className="mt-3"><AvailabilityPreview providerId={s.providerId} /></div></section>
          <section aria-labelledby="rv"><h2 id="rv" className="text-xl font-semibold">Customer reviews</h2>
            <p className="mt-1 text-sm text-ink-muted">Illustrative demo reviews.</p>
            {revs.length === 0 ? <p className="mt-3 text-ink-soft">No reviews yet.</p> : (
              <ul className="mt-3 space-y-3">{revs.map((r) => <li key={r.id} className="card p-4"><div className="flex items-center justify-between"><p className="font-semibold">{r.author}</p><Rating value={r.rating} count={1} /></div><p className="mt-1 text-ink-soft">{r.text}</p></li>)}</ul>)}</section>
          {related.length > 0 && <section aria-labelledby="rel"><h2 id="rel" className="text-xl font-semibold">Related services</h2><div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{related.map((x) => <ServiceCard key={x.id} service={x} />)}</div></section>}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-4 p-5">
            <div><p className="text-sm text-ink-muted">Price estimate</p><p className="text-2xl font-semibold">{priceLabel(s)}</p><p className="text-sm text-ink-muted">Final price is agreed with the provider. No payment is taken here.</p></div>
            <Button size="lg" className="w-full" onClick={() => setOpen(true)} disabled={!s.published}><CalendarDays size={18} /> Request Booking</Button>
            <div className="flex items-center justify-between"><span className="text-sm text-ink-soft">Save this service</span><FavoriteButton id={s.id} label={s.title} /></div>
            {p && <div className="border-t border-line pt-4">
              <div className="flex items-center gap-3"><ProfileAvatar userId={p.userId} name={p.name} hue={p.hue} size={48} /><div><p className="font-semibold">{p.name}</p><p className="text-sm text-ink-soft">{p.profession}</p></div></div>
              <div className="mt-3 flex items-center justify-between"><Rating value={p.rating} count={p.reviews} /><VerificationBadge verified={p.verified} /></div>
              <Button to={`/providers/${p.id}`} variant="secondary" className="mt-3 w-full">View profile</Button>
            </div>}
          </div>
        </aside>
      </div>
      <BookingRequestModal service={s} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
