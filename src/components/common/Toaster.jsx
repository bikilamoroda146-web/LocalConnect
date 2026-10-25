import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useApp } from '../../app/AppContext'
export default function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md bg-navy px-4 py-3 text-sm text-white shadow-lift">
          {t.tone === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />}
          <p className="flex-1">{t.message}</p>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss message" className="text-white/70 hover:text-white"><X size={16} /></button>
        </div>
      ))}
    </div>
  )
}
