import { Link } from 'react-router-dom'
import { Search, CalendarCheck, Star, ArrowRight, ShieldCheck, FileText, Eye, Briefcase, CheckCircle2 } from 'lucide-react'
import SearchBar from '../../components/forms/SearchBar'
import Button from '../../components/common/Button'
import ProviderCard from '../../components/providers/ProviderCard'
import { Badge } from '../../components/common/Badges'
import { categories } from '../../data/categories'
import { testimonials } from '../../data/reviews'
import { useApp } from '../../app/AppContext'
import useHomepageAppearance from '../../hooks/useHomepageAppearance'
import HomepageHeroBackground from '../../components/public/HomepageHeroBackground'

const steps = [
  { icon: Search, title: 'Discover a service', text: 'Search by service or location, then filter by price and rating.' },
  { icon: CalendarCheck, title: 'Choose a professional and request a booking', text: 'Compare profiles, pick a date and send a request with a short note.' },
  { icon: Star, title: 'Track the appointment and leave a review', text: 'Follow each request from pending to completed in one place.' },
]
const trust = [
  { icon: Eye, title: 'Prices are labelled', text: 'Every listing says whether the price is a starting rate, per hour or an estimate.' },
  { icon: FileText, title: 'Reviews stay attached to providers', text: 'Ratings and review counts come from the same records you see on each profile.' },
  { icon: ShieldCheck, title: 'Verification is shown honestly', text: 'A provider only shows a verified mark when it is set in the data. Otherwise it says not yet verified.' },
]

export default function Home() {
  const { providers } = useApp()
  const { imageUrl, appearance } = useHomepageAppearance()
  const featured = [...providers].filter((p) => p.reviews > 0).sort((a, b) => b.rating - a.rating).slice(0, 4)
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <HomepageHeroBackground imageUrl={imageUrl} position={appearance.position} />
        <div className="container-page relative z-10 py-14 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold text-emerald-200">Trusted local professionals</p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.1] text-white sm:text-5xl">Find the Right Professional for Every Job</h1>
            <p className="mt-4 max-w-3xl text-lg text-white/85">Compare local plumbers, electricians, cleaners, tutors and more. See prices up front, request a time that suits you, and follow your booking from request to review.</p>
            <div className="mt-8 max-w-4xl"><SearchBar /></div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button to="/services" size="lg">Explore Services</Button>
              <Button to="/register?role=provider" variant="secondary" size="lg">Become a Provider</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="cats">
        <h2 id="cats" className="text-2xl font-semibold sm:text-3xl">Browse by category</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.map(({ id, name, icon: Icon, blurb }) => (
            <li key={id}>
              <Link to={`/services?category=${id}`} className="card group flex h-full flex-col p-4 transition-colors hover:border-brand sm:p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-800 transition-colors group-hover:bg-brand group-hover:text-white"><Icon size={22} aria-hidden="true" /></span>
                <span className="mt-3 font-semibold leading-snug">{name}</span>
                <span className="mt-1 hidden text-sm text-ink-soft sm:block">{blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-white py-14" aria-labelledby="feat">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 id="feat" className="text-2xl font-semibold sm:text-3xl">Top-rated providers</h2>
            <Link to="/services" className="hidden items-center gap-1 text-sm font-semibold text-brand-800 hover:underline sm:flex">See all services <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProviderCard key={p.id} provider={p} />)}</div>
        </div>
      </section>

      <section id="how-it-works" className="container-page scroll-mt-20 py-14" aria-labelledby="how">
        <h2 id="how" className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy text-white"><Icon size={20} aria-hidden="true" /></span>
              <div><h3 className="font-semibold"><span className="sr-only">Step {i + 1}: </span>{title}</h3><p className="mt-1 text-ink-soft">{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-brand-800 py-14 text-white" aria-labelledby="prov">
        <div className="container-page grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Briefcase size={28} aria-hidden="true" className="text-brand-100" />
            <h2 id="prov" className="mt-3 text-2xl font-semibold sm:text-3xl">Offer your skills to people nearby</h2>
            <p className="mt-3 max-w-lg text-brand-100">Create a profile, publish your services with clear prices, set the days you work and respond to booking requests from one dashboard.</p>
            <Button to="/register?role=provider" variant="light" size="lg" className="mt-6">Become a Provider</Button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['Publish and unpublish services anytime', 'Weekly availability with time slots', 'Accept or decline requests', 'Public profile with portfolio and reviews'].map((t) => (
              <li key={t} className="flex items-start gap-2 rounded-md bg-white/10 p-4 text-sm"><CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="trust">
        <h2 id="trust" className="text-2xl font-semibold sm:text-3xl">Clear information before you book</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {trust.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5"><Icon className="text-brand" size={24} aria-hidden="true" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-ink-soft">{text}</p></div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white py-14" aria-labelledby="tst">
        <div className="container-page">
          <div className="flex flex-wrap items-center gap-3"><h2 id="tst" className="text-2xl font-semibold sm:text-3xl">What people could say</h2><Badge tone="amber">Illustrative demo testimonials</Badge></div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="card p-5"><blockquote className="text-ink-soft">“{t.note}”</blockquote><figcaption className="mt-4 text-sm"><span className="font-semibold">{t.name}</span><span className="block text-ink-muted">{t.role}</span></figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-lg bg-navy px-6 py-10 text-center text-white sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to get the job done?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-300">Browse local professionals and send your first booking request in a few minutes.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button to="/services" size="lg">Find a Service</Button><Button to="/register" variant="light" size="lg">Create an account</Button></div>
        </div>
      </section>
    </>
  )
}
