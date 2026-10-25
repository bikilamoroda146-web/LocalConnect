import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const f = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-white shadow-lift focus:outline-none sm:max-w-lg sm:rounded-lg">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="-m-2 rounded p-2 text-ink-muted hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<><Button variant="secondary" onClick={onClose}>Keep as is</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button></>}>
      <p className="text-ink-soft">{message}</p>
    </Modal>
  )
}
