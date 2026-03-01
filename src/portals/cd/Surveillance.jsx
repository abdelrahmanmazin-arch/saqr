import { useState, useEffect } from 'react'
import { cdDrones, thermalAlerts } from '../../data/cdData'
import StatusBadge from '../../components/StatusBadge'
import { Play, Thermometer, Video, Eye, Activity, X, Send, Bell, List } from 'lucide-react'

const THERMAL_SEV = {
  critical: { row: 'border-l-4 border-red-500 bg-red-50',     badge: 'bg-red-100 text-red-700' },
  high:     { row: 'border-l-4 border-orange-500 bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  medium:   { row: 'border-l-4 border-amber-500 bg-amber-50',  badge: 'bg-amber-100 text-amber-700' },
  low:      { row: 'border-l-4 border-gray-300 bg-gray-50',    badge: 'bg-gray-100 text-gray-600' },
}

const BEHAVIORS = [
  { id: 'BD-001', building: { en: 'Al Jubail Industrial',   ar: 'الجبيل الصناعية'     }, type: { en: 'Smoking in restricted zone', ar: 'التدخين في منطقة محظورة'            }, confidence: 92, status: 'flagged' },
  { id: 'BD-002', building: { en: 'Kingdom Centre Tower',   ar: 'برج المملكة'          }, type: { en: 'Fire exit propped open',     ar: 'مخرج الطوارئ مُثبَّت مفتوحاً'      }, confidence: 88, status: 'flagged' },
  { id: 'BD-003', building: { en: 'Granada Mall',           ar: 'غرناطة مول'           }, type: { en: 'Unauthorized plant room access', ar: 'دخول غير مصرح لغرفة المعدات'   }, confidence: 79, status: 'watch'   },
]

const MISSION_TYPES = ['Thermal Patrol', 'Incident Support', 'Perimeter Check', 'Post-Incident Survey']
const ALTITUDES = ['50m', '85m', '120m', '150m']

const BUILDINGS_DROPDOWN = [
  { id: 'bld-001', name: { en: 'Al Faisaliah Complex',    ar: 'مجمع الفيصلية'     } },
  { id: 'bld-005', name: { en: 'Kingdom Centre Tower',    ar: 'برج المملكة'        } },
  { id: 'bld-009', name: { en: 'Al Jubail Industrial',    ar: 'الجبيل الصناعية'   } },
]

// ── Drone thermal "live feed" animation ──────────────────────────────────────
function DroneFeedPanel({ drone, t }) {
  const [thermal, setThermal] = useState(62)
  useEffect(() => {
    const iv = setInterval(() => setThermal(v => +(v * (1 + (Math.random() - 0.5) * 0.08)).toFixed(1)), 3000)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
        <Video className="w-4 h-4 text-purple-600" />
        <span className="font-semibold text-gray-800 text-sm">{drone.callsign ?? drone.id} — {t({ en: 'Live Drone Feed', ar: 'البث المباشر للطائرة' })}</span>
        <div className="flex items-center gap-1 ms-auto">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500 text-[10px] font-mono">AIRBORNE</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {/* Camera view */}
        <div className="relative bg-gray-900 h-40 flex items-center justify-center overflow-hidden border-e border-gray-700">
          {/* Thermal gradient overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(ellipse at 40% 50%, hsl(${thermal > 70 ? 0 : thermal > 55 ? 30 : 200}, 80%, 50%) 0%, transparent 70%)` }} />
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(255,255,255,0.05) 4px,rgba(255,255,255,0.05) 5px)' }} />
          <div className="text-center z-10">
            <div className="text-gray-400 text-[10px] font-mono tracking-widest">THERMAL VIEW</div>
            <div className="text-gray-500 text-[9px] font-mono">{drone.id}</div>
          </div>
          <div className="absolute top-2 start-2 text-[9px] font-mono text-gray-300">ALT: {drone.altitude ?? 85}m</div>
          <div className="absolute top-2 end-2 text-[9px] font-mono text-gray-300">BAT: {drone.battery ?? 78}%</div>
          <div className="absolute bottom-2 start-2 text-[9px] font-mono">
            <span className="text-orange-300">TEMP: {thermal}°C</span>
          </div>
        </div>
        {/* Live readings */}
        <div className="p-4 space-y-3">
          <div className="text-xs font-semibold text-gray-700">{t({ en: 'Live Thermal Readings', ar: 'القراءات الحرارية الفورية' })}</div>
          {[
            { z: 'Zone A', temp: thermal,        status: 'high'   },
            { z: 'Zone B', temp: thermal - 12.3, status: 'normal' },
            { z: 'Zone C', temp: thermal - 8.7,  status: 'normal' },
            { z: 'Zone D', temp: thermal + 3.2,  status: 'critical' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14">{r.z}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${
                  r.status === 'critical' ? 'bg-red-500' : r.status === 'high' ? 'bg-orange-400' : 'bg-green-500'
                }`} style={{ width: `${Math.min(100, (r.temp / 120) * 100)}%` }} />
              </div>
              <span className={`text-xs font-mono ${r.status === 'critical' ? 'text-red-600' : r.status === 'high' ? 'text-orange-600' : 'text-gray-600'}`}>
                {r.temp.toFixed(1)}°C
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Launch Modal ──────────────────────────────────────────────────────────────
function LaunchModal({ drone, onLaunch, onClose, t, lang }) {
  const [target, setTarget] = useState(BUILDINGS_DROPDOWN[0].id)
  const [mission, setMission] = useState(MISSION_TYPES[0])
  const [altitude, setAltitude] = useState('85m')
  const isRTL = lang === 'ar'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="font-bold text-gray-900">{t({ en: 'Launch Drone', ar: 'إطلاق الطائرة' })} — {drone.id}</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({ en: 'Target Building', ar: 'المبنى المستهدف' })}</label>
            <select value={target} onChange={e => setTarget(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
              {BUILDINGS_DROPDOWN.map(b => <option key={b.id} value={b.id}>{t(b.name)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({ en: 'Mission Type', ar: 'نوع المهمة' })}</label>
            <div className="grid grid-cols-2 gap-2">
              {MISSION_TYPES.map(m => (
                <button key={m} onClick={() => setMission(m)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    mission === m ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({ en: 'Altitude', ar: 'الارتفاع' })}</label>
            <div className="flex gap-2">
              {ALTITUDES.map(a => (
                <button key={a} onClick={() => setAltitude(a)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    altitude === a ? 'bg-gray-800 border-gray-800 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{a}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">
            {t({ en: 'Cancel', ar: 'إلغاء' })}
          </button>
          <button onClick={() => onLaunch(drone.id, { target, mission, altitude })}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            {t({ en: 'Confirm Launch', ar: 'تأكيد الإطلاق' })}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Surveillance({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [drones, setDrones]    = useState(cdDrones)
  const [thermal, setThermal]  = useState(thermalAlerts)
  const [launchTarget, setLaunchTarget] = useState(null) // drone id for modal
  const [activeFeed, setActiveFeed]     = useState(null) // drone showing live feed
  const [watching, setWatching]         = useState({})   // alertId → start time
  const [behaviors, setBehaviors]       = useState(BEHAVIORS)

  const doLaunch = (droneId, params) => {
    setDrones(prev => prev.map(d => d.id === droneId
      ? { ...d, status: 'airborne', altitude: parseInt(params.altitude), assignment: { en: `${params.mission} — en route`, ar: `${params.mission} — في الطريق` } }
      : d))
    setLaunchTarget(null)
    setActiveFeed(droneId)
    addToast(t({ en: `${droneId} launched: ${params.mission} at ${params.altitude}`, ar: `${droneId} أُطلق: ${params.mission} على ارتفاع ${params.altitude}` }), 'success')
  }

  const dispatchAlert = (alertId) => {
    setThermal(prev => prev.map(a => a.id === alertId ? { ...a, dispatched: true } : a))
    addToast(t({ en: 'Dispatch request sent to Operations Center', ar: 'تم إرسال طلب الإرسال لمركز العمليات' }), 'success')
  }

  const notifyBso = (alertId) => {
    addToast(t({ en: 'BSO notified via app and SMS', ar: 'تم إخطار مسؤول البناء عبر التطبيق والرسائل' }), 'info')
  }

  const monitorAlert = (alertId) => {
    setWatching(w => ({ ...w, [alertId]: new Date() }))
    addToast(t({ en: 'Alert added to watch list', ar: 'تمت إضافة التنبيه لقائمة المراقبة' }), 'info')
  }

  const escalateBehavior = (id) => {
    setBehaviors(prev => prev.map(b => b.id === id ? { ...b, status: 'escalated' } : b))
    addToast(t({ en: 'Behavior flagged — incident created in Operations Center', ar: 'تم الإبلاغ عن السلوك — تم إنشاء حادثة في مركز العمليات' }), 'warning')
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Surveillance', ar: 'الرصد الوقائي' })}</h1>

      {/* Active drone feed */}
      {activeFeed && (() => {
        const d = drones.find(dr => dr.id === activeFeed)
        return d ? <DroneFeedPanel drone={d} t={t} /> : null
      })()}

      {/* Drone Fleet */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{t({ en: 'Drone Fleet', ar: 'أسطول الطائرات المسيّرة' })}</h2>
          <span className="text-xs text-gray-400">{drones.filter(d => d.status === 'airborne').length} {t({ en: 'airborne', ar: 'في الجو' })}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {drones.map(d => (
            <div key={d.id} className={`rounded-xl border p-3.5 transition-all ${
              d.status === 'airborne' ? 'bg-purple-50 border-purple-200' :
              d.status === 'charging' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-gray-900 text-sm">{d.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t(d.type ?? { en: 'UAV', ar: 'طائرة مسيّرة' })}</div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full mt-1 ${
                  d.status === 'airborne' ? 'bg-purple-500 animate-pulse' :
                  d.status === 'charging' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="space-y-1.5 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t({ en: 'Status', ar: 'الحالة' })}</span>
                  <span className={`font-semibold uppercase ${
                    d.status === 'airborne' ? 'text-purple-600' : d.status === 'charging' ? 'text-amber-600' : 'text-gray-500'
                  }`}>{d.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t({ en: 'Battery', ar: 'البطارية' })}</span>
                  <span className="font-mono">{d.battery}%</span>
                </div>
                {d.altitude && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t({ en: 'Altitude', ar: 'الارتفاع' })}</span>
                    <span className="font-mono">{d.altitude}m</span>
                  </div>
                )}
                {d.assignment && (
                  <div className="text-gray-500 truncate">{t(d.assignment)}</div>
                )}
              </div>
              <div className="flex gap-2">
                {d.status === 'standby' && (
                  <button onClick={() => setLaunchTarget(d.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors">
                    <Play className="w-3 h-3" />{t({ en: 'Launch', ar: 'إطلاق' })}
                  </button>
                )}
                {d.status === 'airborne' && (
                  <button onClick={() => setActiveFeed(activeFeed === d.id ? null : d.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeFeed === d.id ? 'bg-purple-100 text-purple-700' : 'border border-purple-200 text-purple-700 hover:bg-purple-50'
                    }`}>
                    <Video className="w-3 h-3" />{activeFeed === d.id ? t({ en: 'Hide Feed', ar: 'إخفاء' }) : t({ en: 'View Feed', ar: 'عرض' })}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thermal Alerts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'Thermal Alerts', ar: 'التنبيهات الحرارية' })}</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {thermal.map(alert => {
            const s = THERMAL_SEV[alert.severity] ?? THERMAL_SEV.low
            const isWatching = !!watching[alert.id]
            return (
              <div key={alert.id} className={`px-4 py-3.5 ${s.row}`}>
                <div className="flex items-start gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${s.badge}`}>{alert.severity}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{t(alert.buildingName ?? { en: 'Unknown Building', ar: 'مبنى غير معروف' })}</div>
                    <div className="text-xs text-gray-500">{t(alert.zone ?? { en: 'Zone unspecified', ar: 'منطقة غير محددة' })} · {alert.temperature ?? 'N/A'} · {alert.id}</div>
                  </div>
                  {isWatching && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold">WATCHING</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => dispatchAlert(alert.id)} disabled={alert.dispatched}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      alert.dispatched ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-[#991B1B] text-white hover:bg-red-800'
                    }`}>
                    <Send className="w-3 h-3" />
                    {alert.dispatched ? t({ en: 'Dispatched', ar: 'تم الإرسال' }) : t({ en: 'Dispatch Team', ar: 'إرسال فريق' })}
                  </button>
                  <button onClick={() => notifyBso(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-50">
                    <Bell className="w-3 h-3" />{t({ en: 'Notify BSO', ar: 'إخطار المسؤول' })}
                  </button>
                  <button onClick={() => monitorAlert(alert.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isWatching ? 'bg-blue-100 text-blue-700' : 'border border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}>
                    <Eye className="w-3 h-3" />{isWatching ? t({ en: 'Monitoring', ar: 'تحت المراقبة' }) : t({ en: 'Monitor', ar: 'مراقبة' })}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Behavioral AI Detection */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'Behavioral Risk Detection', ar: 'رصد المخاطر السلوكية' })}</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {behaviors.map(b => (
            <div key={b.id} className="px-5 py-3.5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{t(b.building)}</div>
                <div className="text-xs text-gray-500">{b.id} · {t(b.type)}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${b.confidence >= 90 ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${b.confidence}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{b.confidence}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  b.status === 'escalated' ? 'bg-red-100 text-red-700' : b.status === 'flagged' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>{b.status}</span>
                {b.status !== 'escalated' && (
                  <button onClick={() => escalateBehavior(b.id)}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold hover:bg-orange-200 transition-colors">
                    {t({ en: 'Escalate', ar: 'تصعيد' })}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch modal */}
      {launchTarget && (
        <LaunchModal
          drone={drones.find(d => d.id === launchTarget)}
          onLaunch={doLaunch}
          onClose={() => setLaunchTarget(null)}
          t={t} lang={lang}
        />
      )}
    </div>
  )
}
