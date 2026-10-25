import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import ServiceArt from '../common/ServiceArt'
import Rating from '../common/Rating'
import FavoriteButton from '../common/FavoriteButton'
import { categoryById } from '../../data/categories'
import { priceLabel } from '../../utils/format'
import { useApp } from '../../app/AppContext'

export default function ServiceCard({ service, layout = 'grid' }) {
  const { providerOf } = useApp()
  const p = providerOf(service.providerId)
  const list = layout === 'list'
  return (
    <article className={`card relative overflow-hidden transition-shadow hover:shadow-lift ${list ? 'sm:flex' : 'flex flex-col'}`}>
      <div className={list ? 'sm:w-56 sm:shrink-0' : ''}><ServiceArt category={service.category} hue={p?.hue} className={list ? 'h-36 sm:h-full' : 'h-36'} alt={`${categoryById(service.category)?.name} service`} /></div>
      <FavoriteButton id={service.id} label={service.title} className="absolute right-3 top-3 z-10" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-brand-800">{categoryById(service.category)?.name}</p>
        <h3 className="mt-1 font-semibold leading-snug"><Link to={`/services/${service.id}`} className="after:absolute after:inset-0 after:content-[''] hover:underline">{service.title}</Link></h3>
        <p className="mt-1 text-sm text-ink-soft">{p?.name} · {p?.profession}</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted"><MapPin size={14} aria-hidden="true" /> {service.area}</p>
        {list && <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{service.desc}</p>}
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-sm font-semibold">{priceLabel(service)}</p>
          {p && <Rating value={p.rating} count={p.reviews} />}
        </div>
      </div>
    </article>
  )
}
