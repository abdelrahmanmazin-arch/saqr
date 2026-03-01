import { useState } from 'react'
import { cdDrones, thermalAlerts } from '../../data/cdData'
import StatusBadge from '../../components/StatusBadge'
import { Play, Thermometer, Video, Eye, Activity } from 'lucide-react'

const THERMAL_SEV = {
  critical: 'bg-red-950 border-red-800 text-white',
  high:     'bg-red-50 border-red-200 text-red-900',
  medium:   'bg-amber-50 border-amber-200 text-amber-900',
  low:      'bg-gray-50 border-gray-200 text-gray-800',
}

const behaviorDetections = [
  { id: 'BD-001', building: { en: 'Al Jubail Industrial', ar: 'الجبيل الصناعية' }, type: { en: 'Smoking in restricted zone', ar: 'التدخين في المنطقة المقيّدة' }, confidence: 92, status: 'flagged' },
  { id: 'BD-002', building: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' }, type: { en: 'Fire exit propped open', ar: 'مخرج الطوارئ مُثبَّت مفتوحاً' }, confidence: 88, status: 'flagged' },
  { id: 'BD-003', building: { en: 'Granada Mall', ar: 'غرناطة مول' }, type: { en: 'Unauthorized access to plant room', ar: 'دخول غير مصرح لغرفة المعدات' }, confidence: 79, status: 'watch' },
]

export default function Surveillance({ t, lang }) {
  const isRTL = lang === 'ar'
  const [drones, setDrones] = useState(cdDrones)
  const [thermal, setThermal] = useState(thermalAlerts)
  const [launchedId, setLaunchedId] = useState(null)

  const launchDrone = (id) => {
    setLaunchedId(id)
    setDrones(prev => prev.map(d => d.id === id
      ? { ...d, status: 'airborne', altitude: 45, assignment: { en: 'Launched — en route to assignment', ar: 'أُطلق — في طريقه للمهمة' } } : d))
  }

  const dispatch = (alertId) => {
    setThermal(prev => prev.map(a => a.id === alertId ? { ...a, dispatched: true } : a))
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Surveillance', ar: 'الرصد الوقائي' })}</h1>

      {/* Drone Fleet */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Video className="w-4 h-4 text-[#6D28D9]" />
          <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'Drone Fleet', ar: 'أسطول الطائرات المسيّرة' })}</h2>
          <span className="ms-auto text-xs text-gray-400">{drones.filter(d => d.status === 'airborne').length} {t({ en: 'airborne', ar: 'في الجو' })}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
          {drones.map(d => (
            <div key={d.id} className={`p-4 rounded-xl border-2 transition-all ${
              d.id === launchedId ? 'border-green-400 bg-green-50' :
              d.status === 'airborne' ? 'border-blue-200 bg-blue-50' :
              d.status === 'charging' ? 'border-amber-200 bg-amber-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs text-gray-900">{d.name}</span>
                <StatusBadge status={d.status} />
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                <div className="flex justify-between">
                  <span>{t({ en: 'Alt', ar: 'الارتفاع' })}</span>
                  <span className="font-mono">{d.altitude}m</span>
                </div>
                {/* Battery */}
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.battery > 50 ? 'bg-green-400' : d.battery > 25 ? 'bg-amber-400' : 'bg-red-500'}`}
                      style={{ width: `${d.battery}%` }} />
                  </div>
                  <span className="font-mono text-[10px]">{d.battery}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${d.thermal ? 'bg-red-400' : 'bg-gray-300'}`} />
                  <span className="text-[10px]">{t({ en: 'Thermal', ar: 'حراري' })} {d.thermal ? '✓' : '✗'}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mb-3 leading-snug">{t(d.assignment)}</p>
              {d.status === 'standby' && (
                <button
                  onClick={() => launchDrone(d.id)}
                  className="w-full py-1.5 bg-[#6D28D9] text-white text-xs font-medium rounded-lg hover:bg-purple-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3" /> {t({ en: 'Launch', ar: 'إطلاق' })}
                </button>
              )}
              {d.id === launchedId && (
                <div className="text-[10px] text-green-700 font-semibold text-center animate-pulse">
                  {t({ en: '▲ Ascending…', ar: '▲ صاعد…' })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thermal Alerts + Behavioral Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Thermal Alert Feed */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'Thermal Alert Feed', ar: 'تغذية التنبيهات الحرارية' })}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {thermal.map(a => (
              <div key={a.id} className={`p-4 border-s-4 ${
                a.severity === 'critical' ? 'border-red-700 bg-red-50' :
                a.severity === 'high'     ? 'border-orange-500 bg-orange-50' :
                a.severity === 'medium'   ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
              }`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t(a.type)}</div>
                    <div className="text-xs text-gray-500">{t(a.location)}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-lg font-bold text-red-700">{a.reading}</div>
                    <div className="text-[10px] text-gray-400">{t({ en: 'Normal', ar: 'الطبيعي' })}: {a.normal}</div>
                  </div>
                </div>
                {a.dispatched ? (
                  <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                    ✓ {t({ en: 'Team dispatched', ar: 'تم إرسال الفريق' })}
                  </span>
                ) : (
                  <button
                    onClick={() => dispatch(a.id)}
                    className="px-3 py-1 bg-[#991B1B] text-white text-xs font-medium rounded-lg hover:bg-red-800 transition-colors"
                  >
                    {t({ en: 'Dispatch Team', ar: 'إرسال فريق' })}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Risk Detection */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#6D28D9]" />
            <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'Behavioral Risk Detection', ar: 'كشف المخاطر السلوكية' })}</h2>
            <span className="ms-auto px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">AI</span>
          </div>
          <div className="divide-y divide-gray-50">
            {behaviorDetections.map(bd => (
              <div key={bd.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t(bd.type)}</div>
                    <div className="text-xs text-gray-500">{t(bd.building)}</div>
                  </div>
                  <div className="text-xs font-mono text-gray-600">{bd.confidence}%</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6D28D9] rounded-full" style={{ width: `${bd.confidence}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#6D28D9] text-white text-xs font-medium rounded-lg hover:bg-purple-800 transition-colors">
                    {t({ en: 'Escalate to Inspection', ar: 'تصعيد للفحص' })}
                  </button>
                  <button className="px-3 py-1 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50">
                    {t({ en: 'Dismiss', ar: 'رفض' })}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
