import { Link } from 'react-router-dom'
import Logo from './Logo'
import { categories } from '../../data/categories'
const col = (title, items) => (
  <div>
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <ul className="mt-3 space-y-2 text-sm text-slate-300">
      {items.map(([label, to]) => <li key={label}>{to.startsWith('http') || to.startsWith('mailto') ? <a href={to} className="hover:text-white">{label}</a> : <Link to={to} className="hover:text-white">{label}</Link>}</li>)}
    </ul>
  </div>
)
export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-slate-300">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-3 max-w-xs text-sm">A frontend demo of a local services marketplace. No real bookings, payments or verification take place.</p>
        </div>
        {col('Explore', [['Browse services', '/services'], ['About', '/about'], ...categories.slice(0, 3).map((c) => [c.name, `/services?category=${c.id}`])])}
        {col('For providers', [['Become a provider', '/register?role=provider'], ['Provider sign in', '/login'], ['Resources (placeholder)', '/about']])}
        {col('Help & legal', [['Help centre (placeholder)', '/about'], ['Privacy (placeholder)', '/about'], ['Terms (placeholder)', '/about'], ['hello@localconnect.example', 'mailto:hello@localconnect.example']])}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">© 2026 LocalConnect demo. All sample names, prices and reviews are illustrative.</div>
    </footer>
  )
}
