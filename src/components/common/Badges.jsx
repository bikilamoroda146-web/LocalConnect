import { BadgeCheck } from 'lucide-react'
import { STATUS } from '../../utils/bookings'
const tones = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200', amber: 'bg-amber-50 text-amber-900 ring-amber-200',
  blue: 'bg-sky-50 text-sky-900 ring-sky-200', slate: 'bg-slate-100 text-slate-700 ring-slate-200', red: 'bg-red-50 text-red-800 ring-red-200',
}
export const Badge = ({ tone = 'slate', children }) => (
  <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>
)
export const StatusBadge = ({ status }) => <Badge tone={STATUS[status]?.tone}>{STATUS[status]?.label ?? status}</Badge>
export const VerificationBadge = ({ verified }) =>
  verified ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-800" title="Marked as verified in the demo data. No real verification takes place.">
      <BadgeCheck size={16} aria-hidden="true" /> Verified (demo)
    </span>
  ) : (
    <span className="text-xs text-ink-muted">Not yet verified</span>
  )
