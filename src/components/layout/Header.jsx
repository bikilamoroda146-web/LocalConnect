import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import Logo from './Logo'
import Button from '../common/Button'
import ProfileAvatar from '../common/ProfileAvatar'
import { useApp } from '../../app/AppContext'
import { dashboardPath, profilePath } from '../../data/users'

const links = [
  { to: '/services', label: 'Browse Services' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/register?role=provider', label: 'Become a Provider' },
]
const linkCls = ({ isActive }) => `rounded px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-brand-800' : 'text-ink-soft hover:text-ink'}`

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useApp()
  const nav = useNavigate()
  const close = () => setOpen(false)
  const out = () => { logout(); close(); nav('/') }
  const account = user ? (
    <>
      {profilePath[user.role] && <Link to={profilePath[user.role]} onClick={close} className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-ink-soft hover:bg-slate-50 hover:text-ink">
        <ProfileAvatar userId={user.id} name={user.name} size={32} />
        <span>Edit profile</span>
      </Link>}
      <Link to={dashboardPath[user.role]} onClick={close} className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">My dashboard</Link>
      <button onClick={out} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink"><LogOut size={16} /> Sign out</button>
    </>
  ) : (
    <Link to="/login" onClick={close} className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">Sign In</Link>
  )
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (l.to.includes('#') || l.to.includes('?')
            ? <a key={l.to} href={l.to} className="rounded px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">{l.label}</a>
            : <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">{account}<Button to="/services" size="md">Find a Service</Button></div>
        <button className="-mr-2 rounded p-2 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line bg-white px-4 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => <a key={l.to} href={l.to} onClick={close} className="rounded px-3 py-3 font-medium text-ink hover:bg-slate-50">{l.label}</a>)}
            <div className="mt-1 flex flex-col [&>*]:py-3">{account}</div>
            <Button to="/services" onClick={close} size="lg" className="mt-3">Find a Service</Button>
          </div>
        </nav>
      )}
    </header>
  )
}
