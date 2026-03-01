import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'

const styles = {
  active:      'bg-green-100 text-green-800',
  expiring:    'bg-amber-100 text-amber-800',
  expired:     'bg-red-100 text-red-800',
  pending:     'bg-blue-100 text-blue-800',
  'sla-active':'bg-orange-100 text-orange-800',
  resolved:    'bg-gray-100 text-gray-700',
  'under-review': 'bg-blue-100 text-blue-800',
  assessing:   'bg-purple-100 text-purple-800',
  settled:     'bg-green-100 text-green-800',
  available:   'bg-green-100 text-green-800',
  deployed:    'bg-blue-100 text-blue-800',
  'on-scene':  'bg-red-100 text-red-800',
  returning:   'bg-amber-100 text-amber-800',
  airborne:    'bg-blue-100 text-blue-800',
  charging:    'bg-amber-100 text-amber-800',
  standby:     'bg-gray-100 text-gray-700',
  'license-expired':  'bg-red-100 text-red-800',
  'license-expiring': 'bg-amber-100 text-amber-800',
}

const labels = {
  active: ui.active,
  expiring: ui.expiring,
  expired: ui.expired,
  pending: ui.pending,
  'sla-active': ui.slaActive,
  resolved: ui.resolved,
  'under-review': ui.underReview,
  assessing: ui.assessing,
  settled: ui.settled,
  available: { en: 'Available', ar: 'متاح' },
  deployed:  { en: 'Deployed', ar: 'منتشر' },
  'on-scene':{ en: 'On Scene', ar: 'في الموقع' },
  returning: { en: 'Returning', ar: 'عائد' },
  airborne:  { en: 'Airborne', ar: 'في الجو' },
  charging:  { en: 'Charging', ar: 'يشحن' },
  standby:   { en: 'Standby', ar: 'جاهز' },
  'license-expired':  { en: 'License Expired', ar: 'الترخيص منتهي' },
  'license-expiring': { en: 'License Expiring', ar: 'الترخيص ينتهي قريباً' },
}

export default function StatusBadge({ status }) {
  const { lang } = useApp()
  const cls = styles[status] ?? 'bg-gray-100 text-gray-700'
  const lbl = labels[status]?.[lang] ?? status

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {lbl}
    </span>
  )
}
