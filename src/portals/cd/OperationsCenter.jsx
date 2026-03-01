import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { cdIncidents, cdFieldUnits, volunteers } from '../../data/cdData'
import RiskBadge from '../../components/RiskBadge'
import {
  ChevronDown, ChevronUp, Zap, Navigation, Users, Clock, Radio,
  AlertTriangle, CheckCircle2, X, Eye, Video, Cpu, Send, Plus, ArrowUp
} from 'lucide-react'

// ── Severity config ───────────────────────────────────────────────────────────
const SEV = {
  critical: { row: 'border-l-4 border-red-600 bg-red-50',       badge: 'bg-red-700 text-white',        dot: 'bg-red-500 animate-pulse' },
  high:     { row: 'border-l-4 border-orange-500 bg-orange-50', badge: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  medium:   { row: 'border-l-4 border-amber-500 bg-amber-50',   badge: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500' },
  low:      { row: 'border-l-4 border-gray-300 bg-gray-50',     badge: 'bg-gray-100 text-gray-700',     dot: 'bg-gray-400' },
}

const LAYERS = [
  { n: 1, title: { en: 'Sensor Cross-Validation', ar: 'التحقق المتقاطع للمستشعرات' }, color: 'bg-blue-100 border-blue-200 text-blue-800' },
  { n: 2, title: { en: 'BSO Notification',         ar: 'إخطار مسؤول البناء'         }, color: 'bg-amber-100 border-amber-200 text-amber-800' },
  { n: 3, title: { en: 'Volunteer Alert',           ar: 'تنبيه المتطوعين'            }, color: 'bg-purple-100 border-purple-200 text-purple-800' },
  { n: 4, title: { en: 'CD Auto-Dispatch',          ar: 'إرسال آلي للدفاع المدني'   }, color: 'bg-red-100 border-red-200 text-red-800' },
  { n: 5, title: { en: 'Life Safety Critical',      ar: 'حرج السلامة الحياتية'       }, color: 'bg-red-900 border-red-800 text-white' },
]

// ── Sensor Gauge ──────────────────────────────────────────────────────────────
function Gauge({ label, value, unit, max, warnAt, critAt }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const color = value >= critAt ? 'bg-red-500' : value >= warnAt ? 'bg-orange-400' : 'bg-green-500'
  const textColor = value >= critAt ? 'text-red-600' : value >= warnAt ? 'text-orange-600' : 'text-gray-700'
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className={`text-xs font-mono font-semibold ${textColor}`}>{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Live CCTV Panel ───────────────────────────────────────────────────────────
function CctvPanel({ incidentId, sensors }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setTick(p => p + 1), 1000)
    return () => clearInterval(iv)
  }, [])
  const ts = new Date(); ts.setSeconds(ts.getSeconds() + tick)
  const timeStr = ts.toLocaleTimeString('en-US', { hour12: false })
  return (
    <div className="relative bg-gray-900 rounded-lg h-36 flex items-center justify-center overflow-hidden border border-gray-700">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.1) 3px,rgba(255,255,255,0.1) 4px)' }} />
      <div className="text-center z-10">
        <div className="text-gray-400 text-[10px] font-mono tracking-widest">LIVE FEED</div>
        <div className="text-gray-500 text-[9px] font-mono">CAM-{incidentId.replace(/-/g,'')}-01</div>
      </div>
      <div className="absolute top-2 start-2 flex items-center gap-1 z-10">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-red-400 text-[9px] font-mono">REC</span>
      </div>
      <div className="absolute top-2 end-2 text-[9px] font-mono text-gray-400 z-10">{timeStr}</div>
      <div className="absolute bottom-2 start-2 text-[9px] font-mono space-y-0.5 z-10">
        <div className="text-orange-300">TEMP: {sensors.temp}°C</div>
        <div className="text-yellow-300">SMOKE: {sensors.smoke} ppm</div>
        <div className="text-blue-300">PRESS: {sensors.pressure} kPa</div>
      </div>
    </div>
  )
}

// ── Volunteer SVG Map ─────────────────────────────────────────────────────────
const VOL_MARKERS = [
  { id: 'VOL-001', x: 60,  y: 50,  name: { en: 'Khalid Al-Qahtani', ar: 'خالد القحطاني' }, dist: '1.4 km', cert: 'FIRST AID' },
  { id: 'VOL-002', x: 185, y: 175, name: { en: 'Saad Al-Harbi',     ar: 'سعد الحربي'     }, dist: '2.8 km', cert: 'HAZMAT' },
  { id: 'VOL-003', x: 85,  y: 165, name: { en: 'Omar Al-Dossari',   ar: 'عمر الدوسري'    }, dist: '2.1 km', cert: 'FIRST RESP' },
]
const CITY_BLOCKS = [
  {x:20,y:20,w:50,h:40},{x:90,y:20,w:60,h:40},{x:170,y:20,w:45,h:40},
  {x:20,y:80,w:40,h:60},{x:80,y:80,w:80,h:30},{x:180,y:80,w:35,h:60},
  {x:20,y:160,w:60,h:40},{x:100,y:160,w:50,h:40},{x:170,y:160,w:50,h:40},
]

function VolunteerMap({ t, lang, volunteersAlerted, volsAccepted }) {
  const isRTL = lang === 'ar'
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-600" />
        {t({ en: 'Volunteer Proximity Map', ar: 'خريطة قرب المتطوعين' })}
      </div>
      <div className="flex gap-4 items-start" dir="ltr">
        <svg viewBox="0 0 240 220" className="w-40 h-36 flex-shrink-0 rounded-lg" style={{background:'#F8FAFC'}}>
          {CITY_BLOCKS.map((b,i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#E5E7EB" rx="2" />)}
          <rect x="0" y="70" width="240" height="10" fill="#D1D5DB" />
          <rect x="0" y="145" width="240" height="10" fill="#D1D5DB" />
          <rect x="70" y="0" width="10" height="220" fill="#D1D5DB" />
          <rect x="160" y="0" width="10" height="220" fill="#D1D5DB" />
          {/* Incident marker */}
          <circle cx="120" cy="95" r="8" fill="none" stroke="#EF4444" strokeWidth="2.5" />
          <circle cx="120" cy="95" r="3" fill="#EF4444" />
          {VOL_MARKERS.map((v,i) => {
            const alerted = volunteersAlerted, accepted = volsAccepted.includes(v.id)
            const fill = accepted ? '#16A34A' : alerted ? '#F59E0B' : '#6B7280'
            return (
              <g key={v.id}>
                <circle cx={v.x} cy={v.y} r="6" fill={fill} opacity="0.9" />
                {alerted && !accepted && (
                  <circle cx={v.x} cy={v.y} r="10" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <text x={v.x} y={v.y+3} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{i+1}</text>
              </g>
            )
          })}
        </svg>
        <div className="flex-1 space-y-1.5 text-xs" dir={isRTL ? 'rtl' : 'ltr'}>
          {VOL_MARKERS.map((v,i) => {
            const alerted = volunteersAlerted, accepted = volsAccepted.includes(v.id)
            return (
              <div key={v.id} className={`p-2 rounded-lg ${accepted ? 'bg-green-50' : alerted ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <div className="font-semibold text-gray-800">{i+1}. {t(v.name)}</div>
                <div className="text-gray-500">{v.cert} · {v.dist}</div>
                <div className={`font-semibold ${accepted ? 'text-green-600' : alerted ? 'text-amber-600' : 'text-gray-400'}`}>
                  {accepted ? t({en:'En route',ar:'في الطريق'}) : alerted ? t({en:'Alerted',ar:'تم تنبيهه'}) : t({en:'Standby',ar:'جاهز'})}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Dispatch Modal ────────────────────────────────────────────────────────────
function DispatchModal({ incident, units, onDispatch, onClose, t }) {
  const available = units.filter(u => u.status === 'available')
  const [selected, setSelected] = useState(available[0]?.id ?? null)
  const unit = units.find(u => u.id === selected)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="font-bold text-gray-900">{t({en:'Dispatch Unit',ar:'إرسال وحدة'})}</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-red-50 rounded-xl p-3">
            <div className="font-semibold text-gray-900 text-sm">{t(incident.buildingName)}</div>
            <div className="text-gray-500 text-xs">{incident.id} · {t(incident.type)}</div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({en:'Select Unit',ar:'اختر الوحدة'})}</label>
            {available.length === 0
              ? <div className="text-red-500 text-sm text-center py-2">{t({en:'No units available.',ar:'لا وحدات متاحة.'})}</div>
              : <select value={selected ?? ''} onChange={e => setSelected(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200">
                  {available.map(u => <option key={u.id} value={u.id}>{u.callsign} — {t(u.type)} ({u.crewCount} crew)</option>)}
                </select>
            }
          </div>
          {unit && (
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
              {[['Callsign', unit.callsign], ['Crew', unit.crewCount], [t({en:'Type',ar:'النوع'}), t(unit.type)]].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold font-mono">{v}</span>
                </div>
              ))}
              <div className="flex flex-wrap gap-1 mt-1">
                {unit.certTypes?.map((c,i) => <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">{c}</span>)}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">
            {t({en:'Cancel',ar:'إلغاء'})}
          </button>
          <button onClick={() => selected && onDispatch(incident.id, selected)} disabled={!selected}
            className="flex-1 py-2.5 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800 disabled:opacity-40">
            {t({en:'Confirm Dispatch',ar:'تأكيد الإرسال'})}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══ Main Component ════════════════════════════════════════════════════════════
export default function OperationsCenter({ t, lang, addToast }) {
  const { setInsuranceFlag } = useApp()
  const isRTL = lang === 'ar'
  const [incidents, setIncidents]     = useState(cdIncidents)
  const [units, setUnits]             = useState(cdFieldUnits)
  const [expanded, setExpanded]       = useState(null)
  const [dispatchTarget, setDispatchTarget] = useState(null)
  const [simPhase, setSimPhase]       = useState(0)
  const [bsoActive, setBsoActive]     = useState(false)
  const [bsoSeconds, setBsoSeconds]   = useState(60)
  const [volsAlerted, setVolsAlerted] = useState(false)
  const [volsAccepted, setVolsAccepted] = useState([])
  const bsoRef = useRef(null)

  // Live sensor fluctuation
  const [sensors, setSensors] = useState(() => {
    const s = {}
    cdIncidents.forEach(inc => { s[inc.id] = { temp: 30 + Math.random()*60, smoke: 100 + Math.random()*600, pressure: 60 + Math.random()*60 } })
    return s
  })
  useEffect(() => {
    const iv = setInterval(() => {
      setSensors(prev => {
        const next = {}
        Object.entries(prev).forEach(([id, s]) => {
          const fl = v => +(v * (1 + (Math.random() - 0.5) * 0.1)).toFixed(1)
          next[id] = { temp: fl(s.temp), smoke: Math.round(fl(s.smoke)), pressure: fl(s.pressure) }
        })
        return next
      })
    }, 3000)
    return () => clearInterval(iv)
  }, [])

  const handleDispatch = useCallback((incidentId, unitId) => {
    const unit = units.find(u => u.id === unitId)
    const eta = `${Math.floor(Math.random()*12)+5} min`
    setUnits(prev => prev.map(u => u.id === unitId ? {...u, status:'deployed', incidentId, eta} : u))
    setIncidents(prev => prev.map(i => i.id === incidentId ? {...i, assignedUnit:unitId, status:'dispatched'} : i))
    setDispatchTarget(null)
    addToast(t({en:`Unit ${unit?.callsign} dispatched. ETA: ${eta}`, ar:`الوحدة ${unit?.callsign} أُرسلت. الوصول: ${eta}`}), 'success')
  }, [units, addToast, t])

  const handleClose = (id) => {
    setIncidents(prev => prev.map(i => i.id === id ? {...i, status:'resolved'} : i))
    addToast(t({en:'Incident closed. Post-incident summary generated.', ar:'تم إغلاق الحادثة. تم إنشاء الملخص.'}), 'success')
  }

  const runSimulation = useCallback(() => {
    if (simPhase > 0) {
      clearInterval(bsoRef.current)
      setSimPhase(0); setBsoActive(false); setVolsAlerted(false); setVolsAccepted([])
      setIncidents(prev => prev.filter(i => i.id !== 'INC-SIM-001'))
      return
    }
    setSimPhase(1)
    const now = new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'})
    const simInc = {
      id:'INC-SIM-001', buildingId:'bld-009',
      buildingName:{en:'Al Jubail Industrial Facility',ar:'منشأة الجبيل الصناعية'},
      sbcType:'F/H', type:{en:'Thermal Anomaly Detected',ar:'شذوذ حراري مرصود'},
      severity:'critical', status:'active', layer:1, startTime:now, elapsed:'0m',
      assignedUnit:null, bsoResponse:'pending', volunteersEnRoute:0,
      sensorData:{temp:'68°C',pressure:'28 PSI',co2:'6.4%'},
      escalationHistory:[{layer:1,time:now,action:{en:'Multi-sensor anomaly confirmed',ar:'تأكد الشذوذ المتعدد للمستشعرات'}}],
      cameraSnapshot:true,
    }
    setIncidents(prev => [simInc, ...prev.filter(i => i.id !== 'INC-SIM-001')])
    setExpanded('INC-SIM-001')
    addToast(t({en:'Layer 1 — Sensor cross-validation in progress...',ar:'الطبقة 1 — جارٍ التحقق المتقاطع للمستشعرات...'}), 'info')

    setTimeout(() => {
      setSimPhase(2)
      addToast(t({en:'Cross-validation confirmed. Notifying Building Safety Officer...',ar:'تم التأكيد. يجري إخطار مسؤول سلامة المبنى...'}), 'warning')
      setBsoActive(true); setBsoSeconds(60)
      bsoRef.current = setInterval(() => setBsoSeconds(s => Math.max(0, s-1)), 1000)
      setTimeout(() => {
        clearInterval(bsoRef.current); setBsoActive(false)
        setSimPhase(3); setVolsAlerted(true)
        addToast(t({en:'No BSO response. Alerting nearby volunteers...',ar:'لا استجابة من المسؤول. تنبيه المتطوعين...'}), 'warning')
        setTimeout(() => {
          setVolsAccepted(['VOL-003'])
          setSimPhase(4)
          addToast(t({en:'Sensors still rising. Initiating CD auto-dispatch...',ar:'المستشعرات ترتفع. بدء الإرسال الآلي...'}), 'error')
          const nearest = units.find(u => u.status === 'available')
          if (nearest) {
            setUnits(prev => prev.map(u => u.id === nearest.id ? {...u, status:'deployed', incidentId:'INC-SIM-001', eta:'8 min'} : u))
            setIncidents(prev => prev.map(i => i.id === 'INC-SIM-001' ? {...i, assignedUnit:nearest.id, status:'dispatched', layer:4} : i))
            addToast(t({en:`Unit ${nearest.callsign} auto-dispatched. ETA: 8 min`,ar:`الوحدة ${nearest.callsign} أُرسلت آلياً. الوصول: 8 دقائق`}), 'success')
          }
          setTimeout(() => {
            setSimPhase(5)
            addToast(t({en:'Risk score escalated: Al Jubail → CRITICAL (96)',ar:'تصعيد درجة المخاطر: الجبيل → حرج (96)'}), 'critical')
            setTimeout(() => {
              setSimPhase(6); setInsuranceFlag(true)
              addToast(t({en:'Insurance portal flagged — policy review triggered',ar:'تم تفعيل إشارة بوابة التأمين — مراجعة البوليصة'}), 'info')
            }, 2000)
          }, 2000)
        }, 3000)
      }, 5000)
    }, 2000)
  }, [simPhase, units, addToast, t, setInsuranceFlag])

  const critCount    = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length
  const activeCount  = incidents.filter(i => i.status !== 'resolved').length
  const availUnits   = units.filter(u => u.status === 'available').length

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#991B1B]" />
          {t({en:'Operations Center',ar:'مركز العمليات'})}
        </h1>
        <button onClick={runSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
            simPhase > 0 ? 'border-red-600 bg-red-600 text-white' : 'border-amber-500 text-amber-700 hover:bg-amber-50'
          }`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          {simPhase > 0 ? t({en:'Reset Simulation',ar:'إعادة تعيين'}) : t({en:'Simulate Live Incident',ar:'محاكاة حادثة فورية'})}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:{en:'Active Incidents',ar:'الحوادث النشطة'}, value:activeCount, color:'text-gray-900'},
          {label:{en:'Critical',ar:'حرج'},                    value:critCount,   color:'text-red-600'},
          {label:{en:'Units Available',ar:'الوحدات المتاحة'}, value:availUnits,  color:'text-green-600'},
          {label:{en:'Avg Response',ar:'متوسط الاستجابة'},    value:'8.3m',      color:'text-blue-600'},
        ].map((k,i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{t(k.label)}</div>
            <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* BSO countdown */}
      {bsoActive && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-bold text-amber-800 mb-1">{t({en:'BSO Response Window',ar:'نافذة استجابة مسؤول البناء'})}</div>
            <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{width:`${(bsoSeconds/60)*100}%`}} />
            </div>
          </div>
          <span className="text-2xl font-mono font-bold text-amber-800 w-14 text-center">{bsoSeconds}s</span>
        </div>
      )}

      {/* Volunteer Map + Unit Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VolunteerMap t={t} lang={lang} volunteersAlerted={volsAlerted} volsAccepted={volsAccepted} />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            {t({en:'Field Unit Status',ar:'حالة الوحدات الميدانية'})}
          </div>
          <div className="space-y-2">
            {units.map(u => (
              <div key={u.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                u.status === 'deployed' || u.status === 'on-scene' ? 'bg-red-50 border border-red-100' : 'bg-gray-50'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  u.status === 'available' ? 'bg-green-500' :
                  u.status === 'on-scene'  ? 'bg-red-500 animate-pulse' :
                  u.status === 'returning' ? 'bg-amber-500' : 'bg-orange-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900">{u.callsign}</div>
                  <div className="text-[10px] text-gray-500 truncate">{t(u.type)}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-[10px] font-semibold uppercase ${
                    u.status === 'available' ? 'text-green-600' : u.status === 'on-scene' ? 'text-red-600' : 'text-orange-600'
                  }`}>{u.status}</div>
                  {u.eta && <div className="text-[9px] text-gray-400 font-mono">ETA {u.eta}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Board */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{t({en:'Incident Board',ar:'لوحة الحوادث'})}</h2>
          <span className="text-xs text-gray-400">{activeCount} {t({en:'active',ar:'نشطة'})}</span>
        </div>
        <div className="divide-y divide-gray-50">
          {incidents
            .sort((a,b) => {
              const o = {critical:0,high:1,medium:2,low:3}
              if (a.status==='resolved'&&b.status!=='resolved') return 1
              if (b.status==='resolved'&&a.status!=='resolved') return -1
              return (o[a.severity]??4) - (o[b.severity]??4)
            })
            .map(inc => {
              const s = SEV[inc.severity] ?? SEV.low
              const isExp = expanded === inc.id
              const isRes = inc.status === 'resolved'
              const incSensors = sensors[inc.id] ?? {temp:40, smoke:200, pressure:80}
              const assignedUnit = units.find(u => u.id === inc.assignedUnit)
              return (
                <div key={inc.id} className={`transition-colors ${s.row} ${isRes ? 'opacity-60' : ''}`}>
                  {/* Row */}
                  <div className="px-4 py-3 flex items-center gap-3 flex-wrap cursor-pointer"
                    onClick={() => !isRes && setExpanded(isExp ? null : inc.id)}>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.badge}`}>{inc.severity}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{t(inc.buildingName)}</div>
                      <div className="text-xs text-gray-500">{inc.id} · {t(inc.type)}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-500">
                      <span className="hidden sm:block font-mono">SBC {inc.sbcType}</span>
                      <span className="hidden sm:block">L{inc.layer}</span>
                      {assignedUnit && <span className="font-mono text-orange-600">{assignedUnit.callsign}</span>}
                      {assignedUnit?.eta && <span className="font-mono text-blue-600">ETA {assignedUnit.eta}</span>}
                      <span className="font-mono">{inc.elapsed}</span>
                      {isRes ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : (isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExp && !isRes && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Building info */}
                        <div className="bg-white rounded-xl border border-gray-100 p-3 text-xs space-y-2">
                          <div className="font-semibold text-gray-700 text-sm mb-1">{t({en:'Building Info',ar:'معلومات المبنى'})}</div>
                          {[['SBC', inc.sbcType], [t({en:'BSO',ar:'مسؤول البناء'}), inc.bsoResponse], [t({en:'Volunteers',ar:'متطوعون'}), inc.volunteersEnRoute], [t({en:'Start',ar:'البدء'}), inc.startTime]].map(([k,v]) => (
                            <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="font-semibold">{v}</span></div>
                          ))}
                        </div>
                        {/* Sensor gauges */}
                        <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-3">
                          <div className="font-semibold text-gray-700 text-sm">{t({en:'Live Sensors',ar:'المستشعرات'})}</div>
                          <Gauge label="Temp"     value={incSensors.temp}     unit="°C"  max={120} warnAt={55} critAt={75} />
                          <Gauge label="Smoke"    value={incSensors.smoke}    unit="ppm" max={1000} warnAt={400} critAt={700} />
                          <Gauge label="Pressure" value={incSensors.pressure} unit="kPa" max={150} warnAt={100} critAt={125} />
                          {Object.entries(inc.sensorData ?? {}).map(([k,v]) => (
                            <div key={k} className="flex justify-between text-xs">
                              <span className="text-gray-400 font-mono">{k}</span>
                              <span className="font-semibold font-mono text-gray-700">{v}</span>
                            </div>
                          ))}
                        </div>
                        {/* CCTV */}
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-red-500" />{t({en:'Live Feed',ar:'البث المباشر'})}
                          </div>
                          <CctvPanel incidentId={inc.id} sensors={incSensors} />
                        </div>
                      </div>

                      {/* Escalation history */}
                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="font-semibold text-gray-700 text-sm mb-3">{t({en:'Escalation History',ar:'سجل التصعيد'})}</div>
                        <div className="space-y-2">
                          {inc.escalationHistory?.map((eh,i) => {
                            const layer = LAYERS.find(l => l.n === eh.layer)
                            return (
                              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs ${layer?.color ?? 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                                <span className="font-bold flex-shrink-0">L{eh.layer}</span>
                                <span className="font-mono text-[10px] flex-shrink-0">{eh.time}</span>
                                <span className="flex-1">{t(eh.action)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setDispatchTarget(inc.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-bold hover:bg-red-800 transition-colors">
                          <Send className="w-3.5 h-3.5" />{t({en:'Dispatch Unit',ar:'إرسال وحدة'})}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors">
                          <Plus className="w-3.5 h-3.5" />{t({en:'Add Unit',ar:'إضافة وحدة'})}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 text-orange-700 text-xs font-semibold hover:bg-orange-50">
                          <ArrowUp className="w-3.5 h-3.5" />{t({en:'Escalate',ar:'تصعيد'})}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50">
                          <Eye className="w-3.5 h-3.5" />{t({en:'Request Drone',ar:'طلب طائرة مسيّرة'})}
                        </button>
                        <button onClick={() => handleClose(inc.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-50 ms-auto">
                          <CheckCircle2 className="w-3.5 h-3.5" />{t({en:'Close Incident',ar:'إغلاق الحادثة'})}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>

      {/* Dispatch modal */}
      {dispatchTarget && (
        <DispatchModal
          incident={incidents.find(i => i.id === dispatchTarget)}
          units={units}
          onDispatch={handleDispatch}
          onClose={() => setDispatchTarget(null)}
          t={t} lang={lang}
        />
      )}
    </div>
  )
}
