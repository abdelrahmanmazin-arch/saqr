import { getRiskBand } from '../data/seed'
import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'

const bands = {
  critical: { bg: 'bg-red-950', text: 'text-white', dot: 'bg-red-400' },
  high:     { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  medium:   { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  low:      { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
}

export default function RiskBadge({ score, showScore = true, size = 'sm' }) {
  const { lang } = useApp()
  const band = getRiskBand(score)
  const c = bands[band]
  const label = ui[band][lang]
  const sz = size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sz} ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {showScore && <span className="ltr-num font-mono">{score}</span>}
      <span>{label}</span>
    </span>
  )
}
