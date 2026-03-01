/**
 * Tier 3 — Station / Field Officer View
 * Simplified mobile-optimized view. My incidents, today's inspection queue,
 * quick inspection form, and my unit status.
 */
import { useState } from 'react'
import { cdIncidents, cdFieldUnits, inspectionQueue } from '../../data/cdData'
import { getChecklistForSBC } from '../../data/inspectionChecklists'
import { CheckCircle2, XCircle, Minus, ClipboardList, Radio, Truck, AlertTriangle } from 'lucide-react'

const MY_UNIT = cdFieldUnits[0] // UNIT-01
const MY_INCIDENTS = cdIncidents.filter(i => i.assignedUnit === MY_UNIT.id)
const MY_QUEUE = inspectionQueue.filter(i => i.status !== 'completed').slice(0, 4)

const SEV = {
  critical: 'border-l-4 border-red-500 bg-red-50',
  high:     'border-l-4 border-orange-500 bg-orange-50',
  medium:   'border-l-4 border-amber-500 bg-amber-50',
  low:      'border-l-4 border-gray-300 bg-gray-50',
}
const BADGE = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-amber-100 text-amber-700',
  low:      'bg-gray-100 text-gray-600',
}

export default function StationView({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [tab, setTab] = useState('incidents') // incidents | inspection | unit
  const [activeForm, setActiveForm] = useState(null)
  const [checks, setChecks] = useState({})
  const [formStep, setFormStep] = useState(0) // 0=form, 1=submitted

  const checklist = activeForm ? getChecklistForSBC(activeForm.sbcType) : []
  const passed  = Object.values(checks).filter(v => v === 'pass').length
  const failed  = Object.values(checks).filter(v => v === 'fail').length
  const total   = checklist.length
  const progress = total ? Math.round((Object.keys(checks).length / total) * 100) : 0

  const mark = (id, val) => setChecks(c => ({ ...c, [id]: c[id] === val ? null : val }))

  const submitForm = () => {
    setFormStep(1)
    addToast(t({ en: 'Inspection submitted successfully', ar: 'تم إرسال الفحص بنجاح' }), 'success')
  }

  const TABS = [
    { id: 'incidents', icon: Radio, label: { en: 'My Incidents', ar: 'حوادثي' } },
    { id: 'inspection', icon: ClipboardList, label: { en: 'Today\'s Queue', ar: 'طابور اليوم' } },
    { id: 'unit', icon: Truck, label: { en: 'My Unit', ar: 'وحدتي' } },
  ]

  return (
    <div className="flex-1 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24">

        {/* Mobile info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2 text-amber-700 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {t({ en: 'Field Officer View — shows only your assignments and inspection queue.', ar: 'عرض الضابط الميداني — يعرض مهامك وطابور الفحص الخاص بك فقط.' })}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === id ? 'bg-white text-[#991B1B] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {t(label)}
            </button>
          ))}
        </div>

        {/* ── My Incidents ── */}
        {tab === 'incidents' && (
          <div className="space-y-3">
            {MY_INCIDENTS.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                {t({ en: 'No incidents assigned to your unit.', ar: 'لا توجد حوادث مسندة لوحدتك.' })}
              </div>
            )}
            {MY_INCIDENTS.map(inc => (
              <div key={inc.id} className={`rounded-xl p-4 ${SEV[inc.severity] ?? SEV.medium}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t(inc.buildingName)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{inc.id} · {t(inc.type)}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${BADGE[inc.severity]}`}>
                    {inc.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                  <span>SBC: <strong>{inc.sbcType}</strong></span>
                  <span>{t({ en: 'Elapsed', ar: 'المنقضي' })}: <strong>{inc.elapsed}</strong></span>
                  <span>{t({ en: 'Layer', ar: 'الطبقة' })}: <strong>{inc.layer}</strong></span>
                  <span>{t({ en: 'BSO', ar: 'مسؤول البناء' })}: <strong>{t({ en: inc.bsoResponse, ar: inc.bsoResponse })}</strong></span>
                </div>
                <div className="bg-white/60 rounded-lg p-2.5 text-xs space-y-0.5">
                  {Object.entries(inc.sensorData).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500 font-mono">{k}</span>
                      <span className="font-semibold font-mono text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addToast(t({ en: 'Closure report submitted. Incident under review.', ar: 'تم تقديم تقرير الإغلاق. الحادثة قيد المراجعة.' }), 'success')}
                  className="mt-3 w-full py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                >
                  {t({ en: 'Submit Field Closure Report', ar: 'تقديم تقرير إغلاق ميداني' })}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Today's Inspection Queue ── */}
        {tab === 'inspection' && !activeForm && (
          <div className="space-y-3">
            {MY_QUEUE.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t(item.buildingName)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">SBC {item.sbcType} · {item.id}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {t({ en: 'Risk score', ar: 'درجة المخاطر' })}: <strong className="text-gray-800 font-mono">{item.riskScore}</strong>
                  &nbsp;·&nbsp; {t({ en: 'Due', ar: 'موعد' })}: <strong>{item.scheduledDate}</strong>
                </div>
                <button
                  onClick={() => { setActiveForm(item); setChecks({}); setFormStep(0) }}
                  className="w-full py-2 rounded-lg bg-[#991B1B] text-white text-xs font-bold hover:bg-red-800 transition-colors"
                >
                  {t({ en: 'Start Inspection', ar: 'بدء الفحص' })}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Quick Inspection Form ── */}
        {tab === 'inspection' && activeForm && formStep === 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setActiveForm(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                {isRTL ? '→' : '←'}
              </button>
              <div>
                <div className="font-bold text-gray-900 text-sm">{t(activeForm.buildingName)}</div>
                <div className="text-xs text-gray-400">SBC {activeForm.sbcType}</div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{progress}% {t({ en: 'complete', ar: 'مكتمل' })}</span>
                <span>{Object.keys(checks).length} / {total}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#991B1B] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="space-y-2 mb-6">
              {checklist.map(cp => (
                <div key={cp.id} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-0.5 ${
                      cp.severity === 'life-safety' ? 'bg-red-800 text-white'
                      : cp.severity === 'critical'  ? 'bg-red-100 text-red-700'
                      : cp.severity === 'major'     ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{cp.severity}</span>
                    <span className="text-xs text-gray-800 leading-snug">{t(cp.text)}</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { v: 'pass', icon: CheckCircle2, label: 'Pass', cls: 'text-green-600 border-green-200 hover:bg-green-50' },
                      { v: 'fail', icon: XCircle,      label: 'Fail', cls: 'text-red-600 border-red-200 hover:bg-red-50' },
                      { v: 'na',   icon: Minus,        label: 'N/A',  cls: 'text-gray-400 border-gray-200 hover:bg-gray-50' },
                    ].map(({ v, icon: Icon, label, cls }) => (
                      <button key={v} onClick={() => mark(cp.id, v)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 border rounded-lg text-xs font-semibold transition-all ${cls} ${
                          checks[cp.id] === v ? 'ring-2 ring-offset-1 ring-current' : ''
                        }`}>
                        <Icon className="w-3 h-3" />{label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submitForm}
              disabled={Object.keys(checks).length < total}
              className="w-full py-3 rounded-xl bg-[#991B1B] text-white font-bold text-sm hover:bg-red-800 transition-colors disabled:opacity-40"
            >
              {t({ en: 'Submit Inspection', ar: 'إرسال الفحص' })}
            </button>
          </div>
        )}

        {/* Submission confirmation */}
        {tab === 'inspection' && activeForm && formStep === 1 && (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-100 shadow-sm px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{t({ en: 'Inspection Submitted', ar: 'تم إرسال الفحص' })}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {t({ en: 'Total', ar: 'الإجمالي' })}: {total} &nbsp;·&nbsp;
              {t({ en: 'Pass', ar: 'نجح' })}: <span className="text-green-600 font-semibold">{passed}</span> &nbsp;·&nbsp;
              {t({ en: 'Fail', ar: 'فشل' })}: <span className="text-red-600 font-semibold">{failed}</span>
            </p>
            <button onClick={() => { setActiveForm(null); setFormStep(0) }}
              className="px-6 py-2 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800">
              {t({ en: 'Back to Queue', ar: 'العودة للطابور' })}
            </button>
          </div>
        )}

        {/* ── My Unit Status ── */}
        {tab === 'unit' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-gray-900">{MY_UNIT.callsign}</div>
                <div className="text-sm text-gray-500 mt-0.5">{t(MY_UNIT.type)}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                MY_UNIT.status === 'available' ? 'bg-green-100 text-green-700'
                : MY_UNIT.status === 'on-scene' ? 'bg-red-100 text-red-700'
                : 'bg-orange-100 text-orange-700'
              }`}>
                {MY_UNIT.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-0.5">{t({ en: 'Crew Count', ar: 'عدد الطاقم' })}</div>
                <div className="font-bold font-mono text-gray-900">{MY_UNIT.crewCount}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-0.5">{t({ en: 'Base', ar: 'المقر' })}</div>
                <div className="font-bold text-gray-900 text-xs">{t(MY_UNIT.base)}</div>
              </div>
              {MY_UNIT.certTypes?.map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-0.5">{t({ en: 'Cert', ar: 'شهادة' })} {i + 1}</div>
                  <div className="font-medium text-gray-800 text-xs">{c}</div>
                </div>
              ))}
            </div>
            {MY_UNIT.incidentId && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                <div className="text-xs text-orange-500 mb-0.5">{t({ en: 'Assigned Incident', ar: 'الحادثة المسندة' })}</div>
                <div className="font-bold text-orange-800">{MY_UNIT.incidentId}</div>
                {MY_UNIT.eta && <div className="text-xs text-orange-600 mt-0.5">ETA: {MY_UNIT.eta}</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom safe-area spacer for mobile */}
      <div className="h-6" />
    </div>
  )
}
