import { useId } from 'react'
export default function Field({ label, error, hint, as: Tag = 'input', children, className = '', ...props }) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <Tag id={id} aria-invalid={!!error} aria-describedby={describedBy} className={`input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`} {...props}>{children}</Tag>
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-sm text-ink-muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  )
}
