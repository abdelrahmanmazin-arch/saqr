import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'
import { getRiskBand } from '../data/seed'
import RiskBadge from '../components/RiskBadge'
import StatusBadge from '../components/StatusBadge'
import Header from '../components/Header'
import {
  Radio, ClipboardList, Video, FileCheck, Settings2, BookOpen, Megaphone,
  AlertTriangle, CheckCircle2, XCircle, Clock, Users, Navigation,
  Battery, Thermometer, ChevronRight, ChevronLeft, Zap, Shield,
  TrendingUp, Search, Play, ArrowUpCircle
} from 'lucide-react'

const MODULES = ['operations', 'inspection', 'surveillance', 'licensing', 'policy', 'training', 'awareness']

export default function CDPortal() {
  const { lang, t, buildings, incidents, cdUnits, violations, licenses, drones, policyRules, trainingPrograms, campaigns, dispatchUnit } = useApp()
  const [module, setModule] = useState('operations')
  const isRTL = lang === 'ar'

  const navItems = [
    { id: 'operations', icon: Radio, label: ui.operations },
    { id: 'inspection', icon: ClipboardList, label: ui.inspection },
    { id: 'surveillance', icon: Video, label: ui.surveillance },
    { id: 'licensing', icon: FileCheck, label: ui.licensing },
    { id: 'policy', icon: Settings2, label: ui.policyEngine },
    { id: 'training', icon: BookOpen, label: ui.training },
    { id: 'awareness', icon: Megaphone, label: ui.awareness },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onNavClick={setModule} activeSection={module} />

      {/* Mobile nav */}
      <nav className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setModule(item.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                  module === item.id
                    ? 'text-[#991B1B] border-b-2 border-[#991B1B]'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{t(item.label)}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* ─── Operations Center ─────────────────── */}
        {module === 'operations' && (
          <OperationsModule buildings={buildings} incidents={incidents} cdUnits={cdUnits} dispatchUnit={dispatchUnit} t={t} lang={lang} />
        )}

        {/* ─── Digital Inspection ────────────────── */}
        {module === 'inspection' && (
          <InspectionModule buildings={buildings} violations={violations} t={t} lang={lang} />
        )}

        {/* ─── Surveillance ──────────────────────── */}
        {module === 'surveillance' && (
          <SurveillanceModule drones={drones} t={t} lang={lang} />
        )}

        {/* ─── Digital Licensing ─────────────────── */}
        {module === 'licensing' && (
          <LicensingModule licenses={licenses} buildings={buildings} t={t} lang={lang} />
        )}

        {/* ─── Policy Engine ─────────────────────── */}
        {module === 'policy' && (
          <PolicyModule policyRules={policyRules} t={t} lang={lang} />
        )}

        {/* ─── Training ──────────────────────────── */}
        {module === 'training' && (
          <TrainingModule trainingPrograms={trainingPrograms} t={t} lang={lang} />
        )}

        {/* ─── Awareness ─────────────────────────── */}
        {module === 'awareness' && (
          <AwarenessModule campaigns={campaigns} t={t} lang={lang} />
        )}
      </div>
    </div>
  )
}

// ─── Operations Center ─────────────────────────────────────────────────────────
function OperationsModule({ buildings, incidents, cdUnits, dispatchUnit, t, lang }) {
  const [dispatching, setDispatching] = useState(null)
  const activeIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'settled')
  const availableUnits = cdUnits.filter(u => u.status === 'available').length
  const deployedUnits = cdUnits.filter(u => u.status !== 'available').length

  const handleDispatch = (unitId, incidentId) => {
    setDispatching(unitId)
    dispatchUnit(unitId, incidentId)
    setTimeout(() => setDispatching(null), 1000)
  }

  const unitStatusColors = {
    available: 'bg-green-100 text-green-800',
    deployed: 'bg-blue-100 text-blue-800',
    'on-scene': 'bg-red-100 text-red-800',
    returning: 'bg-amber-100 text-amber-800',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.operations)}</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: { en: 'Active Incidents', ar: 'حوادث نشطة' }, value: activeIncidents.length, urgent: activeIncidents.length > 2 },
          { label: { en: 'Units Deployed', ar: 'وحدات منتشرة' }, value: deployedUnits },
          { label: { en: 'Units Available', ar: 'وحدات متاحة' }, value: availableUnits, good: true },
          { label: { en: 'Avg Response', ar: 'متوسط الاستجابة' }, value: '7.2 min' },
        ].map((k, i) => (
          <div key={i} className={`kpi-tile ${k.urgent ? 'border-red-300' : ''}`}>
            <span className="text-xs text-gray-500">{t(k.label)}</span>
            <span className={`text-2xl font-bold ${k.urgent ? 'text-red-700' : k.good ? 'text-green-700' : 'text-gray-900'}`}>
              {k.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Board */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t({ en: 'Active Incidents', ar: 'الحوادث النشطة' })}</h2>
          <div className="space-y-3">
            {activeIncidents.map(inc => {
              const bld = buildings.find(b => b.id === inc.buildingId)
              const availUnit = cdUnits.find(u => u.status === 'available')
              return (
                <div key={inc.id} className={`p-4 rounded-xl border ${
                  inc.severity === 'critical' ? 'border-red-200 bg-red-50' :
                  inc.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                  'border-amber-100 bg-amber-50'
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-semibold text-sm text-gray-900">{t(inc.type)}</span>
                      <div className="text-xs text-gray-500">{bld && t(bld.name)} · {inc.date}</div>
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{t(inc.description)}</p>
                  <div className="flex gap-2">
                    {availUnit && inc.status !== 'resolved' && (
                      <button
                        onClick={() => handleDispatch(availUnit.id, inc.id)}
                        disabled={dispatching === availUnit.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#991B1B] text-white text-xs font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-60"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        {t(ui.dispatch)} {availUnit.name.en.split('—')[0].trim()}
                      </button>
                    )}
                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-white transition-colors">
                      {t({ en: 'Escalate', ar: 'تصعيد' })}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Unit Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t({ en: 'Unit Status', ar: 'حالة الوحدات' })}</h2>
          <div className="space-y-2">
            {cdUnits.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    u.status === 'available' ? 'bg-green-500' :
                    u.status === 'on-scene' ? 'bg-red-500 animate-pulse' :
                    u.status === 'deployed' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t(u.name)}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Users className="w-3 h-3" /> {u.crew}
                      {u.eta && <><Clock className="w-3 h-3 ms-1" /> {u.eta}</>}
                    </div>
                  </div>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Digital Inspection ────────────────────────────────────────────────────────
function InspectionModule({ buildings, violations, t, lang }) {
  const [checkpoints, setCheckpoints] = useState(
    Array(5).fill(null).map((_, i) => ({ id: i, status: null }))
  )
  const [submitted, setSubmitted] = useState(false)

  const sortedBuildings = [...buildings].sort((a, b) => b.riskScore - a.riskScore)

  const checkpointLabels = [
    { en: 'Fire suppression system pressure within spec', ar: 'ضغط نظام الإطفاء ضمن المعايير' },
    { en: 'All fire exits clear and accessible', ar: 'جميع مخارج الحريق واضحة وميسّرة' },
    { en: 'Smoke detectors operational (sample check)', ar: 'كاشفات الدخان تعمل (فحص عيّنة)' },
    { en: 'Emergency lighting functional (90-min test)', ar: 'الإضاءة الطارئة تعمل (اختبار 90 دقيقة)' },
    { en: 'Safety signage visible and current', ar: 'لافتات السلامة مرئية وحديثة' },
  ]

  const handleCheck = (id, val) => {
    setCheckpoints(prev => prev.map(c => c.id === id ? { ...c, status: val } : c))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.inspection)}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection Queue */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t({ en: 'AI-Ranked Inspection Queue', ar: 'قائمة الفحوصات بترتيب الذكاء الاصطناعي' })}</h2>
          <div className="space-y-2">
            {sortedBuildings.slice(0, 6).map((b, i) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                  i === 0 ? 'bg-red-600' : i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-amber-500' : 'bg-gray-400'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{t(b.name)}</div>
                  <div className="text-xs text-gray-400">{b.sbcType} · {t(b.region)}</div>
                </div>
                <RiskBadge score={b.riskScore} />
              </div>
            ))}
          </div>
        </div>

        {/* Digital Inspection Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1">{t({ en: 'Digital Inspection Form', ar: 'نموذج الفحص الرقمي' })}</h2>
          <p className="text-xs text-gray-400 mb-4">{t({ en: 'Al Jubail Industrial Facility · Inspector: Lt. Ahmad Al-Zahrani', ar: 'منشأة الجبيل الصناعية · المفتش: لواء أحمد الزهراني' })}</p>

          {!submitted ? (
            <>
              <div className="space-y-3 mb-5">
                {checkpointLabels.map((label, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-700 flex-1">{t(label)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCheck(i, 'pass')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          checkpoints[i].status === 'pass'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-white border border-gray-200 text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCheck(i, 'fail')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          checkpoints[i].status === 'fail'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-white border border-gray-200 text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSubmitted(true)}
                disabled={checkpoints.some(c => c.status === null)}
                className="w-full py-2.5 bg-[#1A6B3A] text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t({ en: 'Submit Inspection', ar: 'تقديم الفحص' })}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">{t({ en: 'Inspection Submitted', ar: 'تم تقديم الفحص' })}</div>
              <div className="text-xs text-gray-500 mt-1">{t({ en: 'Risk score recalculating...', ar: 'جاري إعادة حساب درجة المخاطر...' })}</div>
              <button onClick={() => { setSubmitted(false); setCheckpoints(Array(5).fill(null).map((_, i) => ({ id: i, status: null }))) }}
                className="mt-4 text-sm text-[#1A6B3A] font-medium hover:underline">
                {t({ en: 'New Inspection', ar: 'فحص جديد' })}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI-Detected Violations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{t({ en: 'AI-Detected Violations', ar: 'المخالفات المكتشفة بالذكاء الاصطناعي' })}</h2>
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">{violations.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-b border-gray-100">
              <tr>
                {[
                  { en: 'Violation', ar: 'المخالفة' },
                  { en: 'Location', ar: 'الموقع' },
                  { en: 'Confidence', ar: 'الثقة' },
                  { en: 'Severity', ar: 'الخطورة' },
                  { en: 'Action', ar: 'الإجراء' },
                ].map((h, i) => (
                  <th key={i} className="px-3 py-2 text-start font-semibold">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {violations.map(v => {
                const bld = null // we just show the type
                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900">{t(v.type)}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{t(v.location)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#991B1B] rounded-full" style={{ width: `${v.confidence}%` }} />
                        </div>
                        <span className="text-xs font-mono text-gray-600">{v.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <RiskBadge score={v.severity === 'critical' ? 90 : v.severity === 'high' ? 75 : 55} showScore={false} />
                    </td>
                    <td className="px-3 py-3">
                      <button className="px-3 py-1.5 bg-[#991B1B] text-white text-xs font-medium rounded-lg hover:bg-red-800 transition-colors">
                        {t(ui.issueViolation)}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Surveillance ──────────────────────────────────────────────────────────────
function SurveillanceModule({ drones, t, lang }) {
  const thermalAlerts = [
    { id: 'TA-001', location: { en: 'Al Jubail Zone C — Roof', ar: 'الجبيل المنطقة C — السطح' }, temp: '142°C', type: { en: 'Equipment Thermal Runaway', ar: 'ارتفاع حراري في المعدات' } },
    { id: 'TA-002', location: { en: 'Kingdom Centre — Level 55', ar: 'برج المملكة — الطابق 55' }, temp: '89°C', type: { en: 'Electrical Panel Overheat', ar: 'ارتفاع حرارة لوحة كهرباء' } },
    { id: 'TA-003', location: { en: 'Al Faisaliah — Parking B2', ar: 'الفيصلية — موقف B2' }, temp: '67°C', type: { en: 'Vehicle Engine Thermal', ar: 'حرارة محرك مركبة' } },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.surveillance)}</h1>

      {/* Drone Fleet */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">{t({ en: 'Drone Fleet', ar: 'أسطول الطائرات المسيرة' })}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drones.map(d => (
            <div key={d.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-sm text-gray-900">{d.name}</div>
                <StatusBadge status={d.status} />
              </div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t({ en: 'Area', ar: 'المنطقة' })}</span>
                  <span className="font-medium">{t(d.area)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t({ en: 'Altitude', ar: 'الارتفاع' })}</span>
                  <span className="font-mono">{d.altitude}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t({ en: 'Battery', ar: 'البطارية' })}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-12 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${d.battery > 60 ? 'bg-green-400' : d.battery > 30 ? 'bg-amber-400' : 'bg-red-500'}`}
                        style={{ width: `${d.battery}%` }} />
                    </div>
                    <span className="font-mono text-xs">{d.battery}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>{t({ en: 'Thermal Cam', ar: 'كاميرا حرارية' })}</span>
                  <span className={d.thermal ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {d.thermal ? '✓' : '✗'}
                  </span>
                </div>
              </div>
              {d.status === 'standby' && (
                <button className="mt-3 w-full py-1.5 bg-[#6D28D9] text-white text-xs font-medium rounded-lg hover:bg-purple-800 transition-colors flex items-center justify-center gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  {t(ui.launchDrone)}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thermal Alerts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">{t({ en: 'Thermal Alert Feed', ar: 'تغذية التنبيهات الحرارية' })}</h2>
        <div className="space-y-3">
          {thermalAlerts.map(ta => (
            <div key={ta.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-gray-900">{t(ta.type)}</div>
                  <div className="text-xs text-gray-500">{t(ta.location)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-orange-700">{ta.temp}</span>
                <button className="px-3 py-1.5 bg-[#991B1B] text-white text-xs font-medium rounded-lg hover:bg-red-800 transition-colors">
                  {t({ en: 'Dispatch Team', ar: 'إرسال فريق' })}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Digital Licensing ─────────────────────────────────────────────────────────
function LicensingModule({ licenses, buildings, t, lang }) {
  const getLicenseBuilding = (licenseId) => {
    const lic = licenses.find(l => l.id === licenseId)
    if (!lic) return null
    return buildings.find(b => b.id === lic.buildingId)
  }

  const statusCounts = {
    active: licenses.filter(l => l.status === 'active').length,
    expiring: licenses.filter(l => l.status === 'expiring').length,
    expired: licenses.filter(l => l.status === 'expired').length,
    pending: licenses.filter(l => l.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.licensing)}</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="kpi-tile">
            <span className="text-xs text-gray-500">{t({ en: status.charAt(0).toUpperCase() + status.slice(1), ar: { active:'نشط', expiring:'ينتهي قريباً', expired:'منتهي', pending:'قيد الانتظار' }[status] })}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{count}</span>
              <StatusBadge status={status} />
            </div>
          </div>
        ))}
      </div>

      {/* License Registry */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t({ en: 'License Registry', ar: 'سجل التراخيص' })}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  { en: 'Building', ar: 'المبنى' },
                  { en: 'License Type', ar: 'نوع الترخيص' },
                  { en: 'Status', ar: 'الحالة' },
                  { en: 'Expiry', ar: 'تاريخ الانتهاء' },
                  { en: 'Officer', ar: 'الضابط' },
                  { en: 'Action', ar: 'الإجراء' },
                ].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {licenses.map(lic => {
                const bld = buildings.find(b => b.id === lic.buildingId)
                return (
                  <tr key={lic.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{bld ? t(bld.name) : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t(lic.type)}</td>
                    <td className="px-4 py-3"><StatusBadge status={lic.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{lic.expiryDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{lic.officer}</td>
                    <td className="px-4 py-3">
                      {lic.status === 'expired' && (
                        <button className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors">
                          {t({ en: 'Enforce', ar: 'تطبيق' })}
                        </button>
                      )}
                      {lic.status === 'expiring' && (
                        <button className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors">
                          {t({ en: 'Schedule Renewal', ar: 'جدولة التجديد' })}
                        </button>
                      )}
                      {lic.status === 'active' && (
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                          {t(ui.viewDetails)}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Policy Engine ─────────────────────────────────────────────────────────────
function PolicyModule({ policyRules, t, lang }) {
  const domainColors = {
    'fire-safety': 'bg-red-100 text-red-700',
    'electrical': 'bg-amber-100 text-amber-700',
    'evacuation': 'bg-blue-100 text-blue-700',
    'hazmat': 'bg-purple-100 text-purple-700',
    'compliance': 'bg-green-100 text-green-700',
    'surveillance': 'bg-indigo-100 text-indigo-700',
  }
  const aiStatusColors = {
    'active': 'bg-green-100 text-green-800',
    'in-development': 'bg-blue-100 text-blue-800',
    'draft': 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t(ui.policyEngine)}</h1>
        <button className="px-4 py-2 bg-[#0891B2] text-white text-sm font-medium rounded-xl hover:bg-cyan-700 transition-colors">
          {t({ en: '+ New Rule', ar: '+ قاعدة جديدة' })}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  { en: 'Rule Name', ar: 'اسم القاعدة' },
                  { en: 'Domain', ar: 'المجال' },
                  { en: 'AI Status', ar: 'حالة الذكاء الاصطناعي' },
                  { en: 'Severity', ar: 'الخطورة' },
                  { en: 'Violations', ar: 'المخالفات' },
                ].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {policyRules.map(rule => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{t(rule.name)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${domainColors[rule.domain] ?? 'bg-gray-100 text-gray-700'}`}>
                      {rule.domain}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${aiStatusColors[rule.aiStatus] ?? 'bg-gray-100'}`}>
                      {rule.aiStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge score={
                      rule.severity === 'critical' ? 90 :
                      rule.severity === 'high' ? 75 :
                      rule.severity === 'medium' ? 60 : 40
                    } showScore={false} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${rule.violations > 10 ? 'text-red-600' : rule.violations > 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {rule.violations}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Training & Simulation ─────────────────────────────────────────────────────
function TrainingModule({ trainingPrograms, t, lang }) {
  const modalityColors = {
    VR:  'bg-purple-100 text-purple-800',
    AR:  'bg-indigo-100 text-indigo-800',
    SIM: 'bg-blue-100 text-blue-800',
    AI:  'bg-amber-100 text-amber-800',
  }

  const leaderboard = [
    { rank: 1, name: 'Station 7 — North', score: 94, drills: 18 },
    { rank: 2, name: 'Station 2 — King Fahd', score: 91, drills: 15 },
    { rank: 3, name: 'Station 4 — HAZMAT', score: 88, drills: 22 },
    { rank: 4, name: 'Station 1 — Al Olaya', score: 82, drills: 12 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.training)}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programs */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t({ en: 'Active Programs', ar: 'البرامج النشطة' })}</h2>
          {trainingPrograms.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm text-gray-900">{t(p.name)}</h3>
                  <div className="text-xs text-gray-400 mt-0.5">{t({ en: 'Next session', ar: 'الجلسة التالية' })}: {p.nextSession}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${modalityColors[p.modality] ?? 'bg-gray-100'}`}>{p.modality}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span><Users className="w-3 h-3 inline me-1" />{p.enrolled} {t({ en: 'enrolled', ar: 'مشترك' })}</span>
                <span>{p.completion}% {t({ en: 'complete', ar: 'مكتمل' })}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1A6B3A] rounded-full transition-all duration-700" style={{ width: `${p.completion}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">{t({ en: 'Team Leaderboard', ar: 'قائمة الفرق المتصدرة' })}</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="space-y-3">
              {leaderboard.map(entry => (
                <div key={entry.rank} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    entry.rank === 1 ? 'bg-[#C5A028] text-white' :
                    entry.rank === 2 ? 'bg-gray-400 text-white' :
                    entry.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>{entry.rank}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                    <div className="text-xs text-gray-400">{entry.drills} {t({ en: 'drills completed', ar: 'تدريب مكتمل' })}</div>
                  </div>
                  <div className="text-lg font-bold text-[#1B2F5B]">{entry.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Awareness Platform ────────────────────────────────────────────────────────
function AwarenessModule({ campaigns, t, lang }) {
  const campaignStatusColors = {
    active: 'bg-green-100 text-green-800',
    planned: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-600',
  }

  const lessonsLearned = [
    {
      id: 'LL-001',
      incident: 'INC-2024-002',
      title: { en: 'Electrical Arc Flash Prevention', ar: 'الوقاية من ومضات القوس الكهربائي' },
      rootCause: { en: 'Outdated distribution panel with no AFCI protection', ar: 'لوحة توزيع قديمة بدون حماية AFCI' },
      action: { en: 'Mandatory AFCI upgrade for all Group R buildings', ar: 'ترقية AFCI إلزامية لجميع مباني المجموعة R' },
    },
    {
      id: 'LL-002',
      incident: 'INC-2024-005',
      title: { en: 'After-Hours Vendor Contract Monitoring', ar: 'مراقبة عقود الموردين خارج أوقات العمل' },
      rootCause: { en: 'No automated alert for vendor contract lapse during off-hours', ar: 'لا يوجد تنبيه آلي لانتهاء عقد المورد خارج ساعات العمل' },
      action: { en: 'MDRE now monitors vendor status 24/7 with immediate SLA trigger', ar: 'MDRE يراقب حالة المورد 24/7 مع تفعيل فوري لـ SLA' },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.awareness)}</h1>

      {/* Campaigns */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">{t({ en: 'Active Campaigns', ar: 'الحملات النشطة' })}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-sm text-gray-900 flex-1 me-2">{t(c.name)}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${campaignStatusColors[c.status] ?? 'bg-gray-100'}`}>
                  {c.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {t({ en: 'Reach', ar: 'الوصول' })}: <span className="font-semibold text-gray-800">{c.reach.toLocaleString()}</span>
                </div>
                <div className="flex gap-1">
                  {c.channels.map((ch, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Learned */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">{t({ en: 'Lessons Learned', ar: 'الدروس المستفادة' })}</h2>
        <div className="space-y-4">
          {lessonsLearned.map(ll => (
            <div key={ll.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="font-semibold text-gray-900 mb-3">{t(ll.title)}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-xs font-semibold text-red-700 mb-1">{t({ en: 'Root Cause', ar: 'السبب الجذري' })}</div>
                  <div className="text-red-900 text-xs">{t(ll.rootCause)}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xs font-semibold text-green-700 mb-1">{t({ en: 'Corrective Action', ar: 'الإجراء التصحيحي' })}</div>
                  <div className="text-green-900 text-xs">{t(ll.action)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
