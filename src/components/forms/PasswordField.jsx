import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
export default function PasswordField({ label, error, ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} className={`input pr-12 ${error ? 'border-red-500' : ''}`} {...props} />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink-muted hover:text-ink">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
      </div>
      {error && <p id={`${id}-e`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  )
}
