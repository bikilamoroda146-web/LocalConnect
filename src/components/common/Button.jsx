import { Link } from 'react-router-dom'
const variants = {
  primary: 'bg-brand text-white hover:bg-brand-700 focus-visible:outline-brand',
  secondary: 'border border-slate-300 bg-white text-ink hover:bg-slate-50',
  dark: 'bg-navy text-white hover:bg-navy-700',
  ghost: 'text-ink-soft hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  light: 'bg-white text-brand-800 hover:bg-brand-50',
}
const sizes = { sm: 'px-3 py-1.5 text-sm min-h-9', md: 'px-4 py-2.5 text-sm min-h-11', lg: 'px-5 py-3 text-base min-h-12' }

export default function Button({ as, to, variant = 'primary', size = 'md', className = '', loading, children, ...rest }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  const Tag = as || 'button'
  return (
    <Tag className={cls} disabled={loading || rest.disabled} {...(Tag === 'button' ? { type: rest.type || 'button' } : {})} {...rest}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </Tag>
  )
}
