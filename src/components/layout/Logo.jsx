import { Link } from 'react-router-dom'
export default function Logo({ light }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="LocalConnect home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill={light ? '#fff' : '#0F8B6D'} /><path d="M9 17l5 5 9-11" stroke={light ? '#075B49' : '#fff'} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className={`text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>LocalConnect</span>
    </Link>
  )
}
