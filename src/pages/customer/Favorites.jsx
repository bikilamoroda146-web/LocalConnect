import { Heart } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/States'
import ProviderCard from '../../components/providers/ProviderCard'
import ServiceCard from '../../components/services/ServiceCard'
import { useApp } from '../../app/AppContext'

export default function Favorites() {
  const { favorites, providerOf, serviceOf } = useApp()
  const provs = favorites.map((k) => k.startsWith('p') ? providerOf(k) : null).filter(Boolean)
  const svcs = favorites.map((k) => k.startsWith('s') ? serviceOf(k) : null).filter(Boolean)
  return (
    <>
      <PageHeader title="Favorites" text="Providers and services you saved. Use the heart on a card to remove one." />
      {!provs.length && !svcs.length ? <EmptyState icon={Heart} title="Nothing saved yet" text="Tap the heart on a provider or service to keep it here." actionLabel="Discover services" actionTo="/services" /> : (
        <div className="space-y-8">
          {provs.length > 0 && <section aria-labelledby="fp"><h2 id="fp" className="mb-3 text-lg font-semibold">Providers</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{provs.map((p) => <ProviderCard key={p.id} provider={p} />)}</div></section>}
          {svcs.length > 0 && <section aria-labelledby="fs"><h2 id="fs" className="mb-3 text-lg font-semibold">Services</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{svcs.map((s) => <ServiceCard key={s.id} service={s} />)}</div></section>}
        </div>)}
    </>
  )
}
