import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthShell from './AuthShell'
import Field from '../../components/common/Field'
import PasswordField from '../../components/forms/PasswordField'
import Button from '../../components/common/Button'
import { useApp } from '../../app/AppContext'
import { dashboardPath } from '../../data/users'
import { isEmail } from '../../utils/validation'

export default function Register() {
  const { register, toast } = useApp()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', role: params.get('role') === 'provider' ? 'provider' : 'customer' })
  const [err, setErr] = useState({})
  const [formErr, setFormErr] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const errors = {}
    if (f.name.trim().length < 2) errors.name = 'Enter your full name.'
    if (!isEmail(f.email)) errors.email = 'Enter a valid email address.'
    if (f.password.length < 8) errors.password = 'Use at least 8 characters.'
    if (f.confirm !== f.password) errors.confirm = 'Passwords do not match.'
    setErr(errors); setFormErr('')
    if (Object.keys(errors).length) return
    setLoading(true)
    setTimeout(() => {
      const r = register(f) // password is validated here and then discarded, never stored
      setLoading(false)
      if (!r.ok) return setFormErr(r.error)
      toast('Demo account created.')
      nav(dashboardPath[r.user.role])
    }, 500)
  }
  return (
    <AuthShell title="Create your account" text="Join as a customer or as a service provider." footer={<>Already have an account? <Link className="font-semibold text-brand-800 hover:underline" to="/login">Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {formErr && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{formErr}</p>}
        <fieldset><legend className="mb-1.5 text-sm font-medium">I want to</legend>
          <div className="grid grid-cols-2 gap-2">
            {[['customer', 'Find services'], ['provider', 'Offer services']].map(([v, l]) => (
              <label key={v} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium ${f.role === v ? 'border-brand bg-brand-50 text-brand-800' : 'border-slate-300'}`}>
                <input type="radio" name="role" value={v} checked={f.role === v} onChange={set('role')} className="sr-only" />{l}</label>))}
          </div></fieldset>
        <Field label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={err.name} />
        <Field label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} />
        <PasswordField label="Password" autoComplete="new-password" value={f.password} onChange={set('password')} error={err.password} />
        <PasswordField label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={err.confirm} />
        <Button type="submit" size="lg" className="w-full" loading={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
      </form>
    </AuthShell>
  )
}
