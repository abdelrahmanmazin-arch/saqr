import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { cdIncidents, cdFieldUnits, volunteers } from '../../data/cdData'
import RiskBadge from '../../components/RiskBadge'
import StatusBadge from '../../components/StatusBadge'
import {
  Zap, Navigation, ChevronDown, ChevronUp, Users, Clock, Radio,
  AlertTriangle, CheckCircle2, X, Eye, ArrowUpCircle, Shield,
  Bell, MapPin, TrendingUp
} from 'lucide-react'

// Severity config
const SEV = {
  critical: { bg: 'bg-red-950 border-red-800', badge: 'bg-red-700 text-white', dot: 'bg-red-400 animate-pulse', label: { en: 'CRITICAL', ar: 'حرج' } },
  high:     { bg: 'bg-red-50 border-red-200',  badge: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: { en: 'HIGH', ar: 'مرتفع' } },
  medium:   { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', label: { en: 'MEDIUM', ar: 'متوسط' } },
  low:      { bg: 'bg-gray-50 border-gray-200',  badge: 'bg-gray-100 text-gray-700',  dot: 'bg-gray-400', label: { en: 'LOW', ar: 'منخفض' } },
}

// Layer descriptions for escalation display
const LAYERS = [
  { n: 1, title: { en: 'Sensor Cross-Validation', ar: 'التحقق المتقاطع للمستشعرات' }, timing: 'T+0s', color: 'bg-blue-100 border-blue-300 text-blue-900' },
  { n: 2, title: { en: 'Building Safety Officer Notification', ar: 'إخطار ضابط سلامة المبنى' }, timing: 'T+0–60s', color: 'bg-amber-100 border-amber-300 text-amber-900' },
  { n: 3, title: { en: 'Volunteer Proximity Alert', ar: 'تنبيه المتطوعين القريبين' }, timing: 'T+60–120s', color: 'bg-purple-100 border-purple-300 text-purple-900' },
  { n: 4, title: { en: 'Civil Defense Auto-Dispatch', ar: 'إرسال آلي للدفاع المدني' }, timing: 'T+120s', color: 'bg-red-100 border-red-300 text-red-900' },
  { n: 5, title: { en: 'Life Safety Critical Response', ar: 'الاستجابة الحرجة للسلامة الحياتية' }, timing: 'IMMEDIATE', color: 'bg-red-950 border-red-800 text-white' },
]

export default function OperationsCenter({ t, lang }) {
  const isRTL = lang === 'ar'
  const [incidents, setIncidents] = useState(cdIncidents)
  const [units, setUnits] = useState(cdFieldUnits)
  const [expanded, setExpanded] = useState(null)
  const [simState, setSimState] = useState(null) // null | 1|2|3|4|'done'
  const [bsoCountdown, setBsoCountdown] = useState(10)
  const [simIncident, setSimIncident] = useState(null)
  const timerRef = useRef(null)

  // Derived counts
  const critCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length
  const highCount = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length
  const deployed = units.filter(u => u.status !== 'available').length
  const available = units.filter(u => u.status === 'available').length

  // ── Escalation Simulation ───────────────────────────────────────────────────
  const startSimulation = () => {
    if (simState !== null) { resetSim(); return }
    const newInc = {
      id: 'INC-SIM-001',
      buildingId: 'bld-009',
      buildingName: { en: 'Al Jubail Industrial (LIVE SIMULATION)', ar: 'الجبيل الصناعية (محاكاة مباشرة)' },
      sbcType: 'F/H',
      type: { en: 'Sprinkler Pressure Drop + Sensor Anomaly', ar: 'انخفاض ضغط الرشاشات + شذوذ المستشعر' },
      severity: 'critical',
      status: 'watch',
      layer: 1,
      startTime: new Date().toLocaleTimeString('en-SA', { hour: '2-digit', minute: '2-digit' }),
      elapsed: '0s',
      assignedUnit: null,
      bsoResponse: 'pending',
      volunteersEnRoute: 0,
      escalationHistory: [],
    }
    setSimIncident(newInc)
    setSimState(1)
    setBsoCountdown(10)
  }

  useEffect(() => {
    if (simState === null) return
    clearTimeout(timerRef.current)

    if (simState === 1) {
      // Add incident in watch mode
      setSimIncident(prev => ({ ...prev, status: 'watch', layer: 1,
        escalationHistory: [{ layer: 1, time: 'Now', action: { en: 'Multi-sensor cross-validation running… CO₂ rising, pressure dropping, temp elevated. Anomaly CONFIRMED.', ar: 'تشغيل التحقق المتقاطع… CO₂ يرتفع، الضغط ينخفض، الحرارة مرتفعة. تأكيد الشذوذ.' } }],
      }))
      timerRef.current = setTimeout(() => setSimState(2), 2500)

    } else if (simState === 2) {
      setBsoCountdown(10)
      setSimIncident(prev => ({
        ...prev, status: 'bso-notified', layer: 2, bsoResponse: 'pending',
        escalationHistory: [...(prev.escalationHistory || []),
          { layer: 2, time: 'Now', action: { en: 'BSO notified via Saqr app. 60-second response window open. Suppression system primed.', ar: 'تم إخطار BSO عبر تطبيق صقر. نافذة استجابة 60 ثانية مفتوحة. نظام الإطفاء جاهز.' } }],
      }))
      // Countdown
      let count = 10
      const interval = setInterval(() => {
        count--
        setBsoCountdown(count)
        if (count <= 0) { clearInterval(interval); setSimState(3) }
      }, 800)
      timerRef.current = () => clearInterval(interval)

    } else if (simState === 3) {
      setSimIncident(prev => ({
        ...prev, status: 'volunteer-alerted', layer: 3, volunteersEnRoute: 1,
        escalationHistory: [...(prev.escalationHistory || []),
          { layer: 3, time: 'Now', action: { en: 'No BSO response. Volunteer VOL-003 alerted (2.1 km away). CD regional commander flagged. Suppression auto-activating.', ar: 'لا استجابة BSO. تنبيه المتطوع VOL-003 (2.1 كم). تنبيه القائد الإقليمي لـCD. تفعيل آلي للإطفاء.' } }],
      }))
      timerRef.current = setTimeout(() => setSimState(4), 2500)

    } else if (simState === 4) {
      // Dispatch Unit-06 (available)
      setUnits(prev => prev.map(u => u.id === 'UNIT-06'
        ? { ...u, status: 'deployed', incidentId: 'INC-SIM-001', eta: '14 min' }
        : u
      ))
      setSimIncident(prev => ({
        ...prev, status: 'dispatched', layer: 4, assignedUnit: 'UNIT-06',
        escalationHistory: [...(prev.escalationHistory || []),
          { layer: 4, time: 'Now', action: { en: 'UNIT-06 (Standard Fire) auto-dispatched. ETA 14 min. Insurance portal flagged "Under Assessment". Drone UAV-05 launched.', ar: 'إرسال آلي لوحدة UNIT-06. الوصول 14 دقيقة. تحديث بوابة التأمين "قيد التقييم". إطلاق UAV-05.' } }],
      }))
      setSimState('done')
    }
  }, [simState])

  const resetSim = () => {
    clearTimeout(timerRef.current)
    setSimState(null)
    setSimIncident(null)
    setBsoCountdown(10)
    setUnits(cdFieldUnits)
  }

  // Merge sim incident into list
  const allIncidents = simIncident
    ? [simIncident, ...incidents]
    : incidents

  const closeIncident = (id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i))
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Operations Center', ar: 'مركز العمليات الرقمي' })}</h1>
          <p className="text-xs text-gray-400">{t({ en: 'Live command view — all active incidents and deployed units', ar: 'عرض القيادة الفوري — جميع الحوادث النشطة والوحدات المنتشرة' })}</p>
        </div>
        <button
          onClick={startSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            simState !== null
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-[#7C3AED] text-white hover:bg-purple-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          {t(simState !== null ? { en: 'Reset Simulation', ar: 'إعادة تعيين المحاكاة' } : { en: 'Trigger Incident Simulation', ar: 'محاكاة سلسلة التصعيد' })}
        </button>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: { en: 'Active Incidents', ar: 'حوادث نشطة' }, value: `${critCount}C · ${highCount}H`, urgent: critCount > 0 },
          { label: { en: 'Units Deployed', ar: 'وحدات منتشرة' }, value: deployed },
          { label: { en: 'Units Available', ar: 'وحدات متاحة' }, value: available, good: true },
          { label: { en: 'Avg Response Time', ar: 'متوسط وقت الاستجابة' }, value: '7.2 min' },
        ].map((k, i) => (
          <div key={i} className={`kpi-tile ${k.urgent ? 'border-red-300 bg-red-50' : ''}`}>
            <span className="text-xs text-gray-500">{t(k.label)}</span>
            <span className={`text-xl font-bold ${k.urgent ? 'text-red-700' : k.good ? 'text-green-700' : 'text-gray-900'}`}>{k.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── Left: Units ─── */}
        <div className="space-y-4">
          {/* Volunteers */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              {t({ en: 'Certified Volunteers', ar: 'المتطوعون المعتمدون' })}
            </h2>
            <div className="space-y-2">
              {volunteers.map(v => (
                <div key={v.id} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${v.status === 'en-route' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 truncate">{t(v.name)}</div>
                    <div className="text-[10px] text-gray-500">{v.distanceKm}km · {t(v.cert)}</div>
                  </div>
                  <span className="text-[10px] font-medium text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                    {v.status === 'en-route' ? t({ en: 'En Route', ar: 'في الطريق' }) : t({ en: 'Active', ar: 'نشط' })}
                  </span>
                </div>
              ))}
              {simIncident?.volunteersEnRoute > 0 && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                  <div className="text-xs text-green-800 font-medium">{t({ en: 'VOL-003 dispatched → Simulation site', ar: 'VOL-003 منتشر ← موقع المحاكاة' })}</div>
                </div>
              )}
            </div>
          </div>

          {/* Unit status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#991B1B]" />
              {t({ en: 'Unit Status', ar: 'حالة الوحدات' })}
            </h2>
            <div className="space-y-2">
              {units.map(u => (
                <div key={u.id} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    u.status === 'available' ? 'bg-green-500' :
                    u.status === 'on-scene'  ? 'bg-red-500 animate-pulse' :
                    u.status === 'deployed'  ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 truncate">{t(u.name)}</div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> {u.crew}
                      {u.eta && <><Clock className="w-2.5 h-2.5 ms-1" />{u.eta}</>}
                    </div>
                  </div>
                  <StatusBadge status={u.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Center: Incident Board ─── */}
        <div className="xl:col-span-2 space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'Incident Board', ar: 'لوحة الحوادث' })}</h2>

          {allIncidents.map(inc => {
            const s = SEV[inc.severity] || SEV.low
            const isExpanded = expanded === inc.id
            const isSimulated = inc.id === 'INC-SIM-001'

            return (
              <div key={inc.id} className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${isSimulated ? 'border-purple-400 shadow-lg shadow-purple-100' : s.bg}`}>
                {/* Incident row */}
                <div
                  className="flex flex-wrap items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : inc.id)}
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400">{inc.id}</span>
                      <span className="font-semibold text-sm text-gray-900">{t(inc.type)}</span>
                      {isSimulated && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full animate-pulse">LIVE SIM</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{t(inc.buildingName)} · {inc.sbcType}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.badge}`}>{t(s.label)}</span>
                    {inc.assignedUnit && <span className="text-xs text-gray-500 font-mono">{inc.assignedUnit}</span>}
                    <span className="text-xs text-gray-400">{inc.elapsed}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-white p-4 space-y-4">
                    {/* Escalation ladder (simulation) or history */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                        {t({ en: 'Escalation History', ar: 'سجل التصعيد' })}
                      </h3>
                      {/* Show layers for all incidents */}
                      <div className="space-y-2">
                        {(inc.escalationHistory || []).map((ev, i) => {
                          const layer = LAYERS[ev.layer - 1]
                          return (
                            <div key={i} className={`flex gap-3 p-3 rounded-lg border text-xs ${layer?.color || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                              <span className="font-bold flex-shrink-0">L{ev.layer}</span>
                              <div>
                                <div className="font-semibold mb-0.5">{layer ? t(layer.title) : ''}</div>
                                <div className="opacity-80">{t(ev.action)}</div>
                                <div className="opacity-60 mt-0.5">{ev.time}</div>
                              </div>
                            </div>
                          )
                        })}
                        {/* Live layer 2 countdown */}
                        {isSimulated && simState === 2 && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-amber-400 bg-amber-50 animate-pulse">
                            <Clock className="w-5 h-5 text-amber-700 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-bold text-amber-800">{t({ en: 'BSO Response Window', ar: 'نافذة استجابة BSO' })}</div>
                              <div className="text-2xl font-mono font-bold text-amber-700">{bsoCountdown}s</div>
                              <div className="text-[10px] text-amber-600">{t({ en: 'Auto-escalating to volunteer alert if no response…', ar: 'تصعيد آلي لتنبيه المتطوع إذا لم يتم الرد…' })}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sensor data */}
                    {inc.sensorData && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          {t({ en: 'Sensor Data at Trigger', ar: 'بيانات المستشعرات عند الإشارة' })}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(inc.sensorData).map(([key, val]) => (
                            <span key={key} className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-mono">
                              {key}: <strong>{val}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {units.find(u => u.status === 'available') && inc.status !== 'resolved' && (
                        <button
                          onClick={() => {
                            const avail = units.find(u => u.status === 'available')
                            if (avail) {
                              setUnits(prev => prev.map(u => u.id === avail.id
                                ? { ...u, status: 'deployed', incidentId: inc.id, eta: '8 min' } : u))
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#991B1B] text-white text-xs font-medium rounded-lg hover:bg-red-800 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" /> {t({ en: 'Dispatch Unit', ar: 'إرسال وحدة' })}
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        <ArrowUpCircle className="w-3.5 h-3.5" /> {t({ en: 'Request Aerial', ar: 'طلب دعم جوي' })}
                      </button>
                      <button
                        onClick={() => closeIncident(inc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> {t({ en: 'Close Incident', ar: 'إغلاق الحادث' })}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Escalation Ladder Reference */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {t({ en: '5-Layer Escalation Ladder Reference', ar: 'مرجع سلّم التصعيد الخماسي' })}
            </h3>
            <div className="space-y-1.5">
              {LAYERS.map(l => (
                <div key={l.n} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs ${l.color}`}>
                  <span className="font-bold w-4 text-center flex-shrink-0">{l.n}</span>
                  <span className="font-semibold flex-1">{t(l.title)}</span>
                  <span className="font-mono opacity-70">{l.timing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
