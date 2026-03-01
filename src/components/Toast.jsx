import { X } from 'lucide-react'

const TYPE_STYLES = {
  critical: 'border-l-4 border-red-500   bg-red-50   text-red-900',
  error:    'border-l-4 border-red-500   bg-red-50   text-red-900',
  warning:  'border-l-4 border-amber-500 bg-amber-50 text-amber-900',
  success:  'border-l-4 border-green-500 bg-green-50 text-green-900',
  info:     'border-l-4 border-blue-500  bg-blue-50  text-blue-900',
}

export function ToastStack({ toasts, onClose }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto
            ${TYPE_STYLES[toast.type] ?? TYPE_STYLES.info}`}
        >
          <p className="flex-1 text-sm font-medium leading-snug">{toast.msg}</p>
          <button onClick={() => onClose(toast.id)} className="mt-0.5 shrink-0 opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
