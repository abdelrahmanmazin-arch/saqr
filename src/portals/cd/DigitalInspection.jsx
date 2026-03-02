import { useState } from 'react'
import { inspectionQueue, aiViolations } from '../../data/cdData'
import { getChecklistForSBC } from '../../data/inspectionChecklists'
import RiskBadge from '../../components/RiskBadge'
import {
  CheckCircle2, XCircle, Minus, AlertTriangle, Camera, FileText,
  ChevronRight, ChevronLeft, X, QrCode, Shield, BarChart3, Eye
} from 'lucide-react'

// Step labels for the wizard
const STEPS = [
  { n: 1, label: { en: 'Pre-Inspection Brief', ar: 'الموجز التمهيدي' } },
  { n: 2, label: { en: 'Signal Checks',        ar: 'فحص الإشارات'   } },
  { n: 3, label: { en: 'Checkpoint Inspection', ar: 'فحص النقاط'    } },
  { n: 4, label: { en: 'BSO Co-sign',           ar: 'توقيع مسؤول البناء' } },
  { n: 5, label: { en: 'Submission',            ar: 'الإرسال'        } },
]

const SEV_BADGE = {
  'life-safety': 'bg-red-800 text-white',
  critical:      'bg-red-100 text-red-700',
  major:         'bg-orange-100 text-orange-700',
  minor:         'bg-amber-100 text-amber-700',
  advisory:      'bg-blue-100 text-blue-700',
}

// Fake sensor signal data per building
function buildSensors(buildingId) {
  const sensors = [
    { id: `SNS-${buildingId}-001`, type: 'Smoke Detector',      location: 'Floor 1 Lobby',   reading: '0.02 ppm', signal: 'strong' },
    { id: `SNS-${buildingId}-002`, type: 'Sprinkler Pressure',  location: 'Basement B1',     reading: '118 PSI',  signal: 'strong' },
    { id: `SNS-${buildingId}-003`, type: 'CO₂ Sensor',         location: 'Floor 3 Server',  reading: '412 ppm',  signal: 'weak'   },
    { id: `SNS-${buildingId}-004`, type: 'Heat Detector',       location: 'Kitchen Zone',    reading: '38°C',     signal: 'strong' },
    { id: `SNS-${buildingId}-005`, type: 'Exit Door Contact',   location: 'Emergency Exit 2',reading: 'Closed',   signal: 'none'   },
  ]
  return sensors
}

const CAMERAS = ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-05']

// ── Inspection Form (steps 1-5) ───────────────────────────────────────────────
function InspectionWizard({ item, onClose, addToast, t, lang }) {
  const isRTL = lang === 'ar'
  const [step, setStep] = useState(1)
  const [sensorStatus, setSensorStatus] = useState({}) // { sensorId: 'confirmed' }
  const [checks, setChecks] = useState({})             // { checkpointId: 'pass'|'fail'|'na' }
  const [failDetails, setFailDetails] = useState({})   // { checkpointId: { severity, notes, camera, photo } }
  const [showQr, setShowQr] = useState(false)
  const [cosigned, setCosigned] = useState(false)
  const [showEnforcement, setShowEnforcement] = useState(null)
  const [savingDraft, setSavingDraft] = useState(false)

  const checklist = getChecklistForSBC(item.sbcType).checkpoints
  const sensors   = buildSensors(item.buildingId)
  const noSignal  = sensors.filter(s => s.signal === 'none')

  const passed   = checklist.filter(cp => checks[cp.id] === 'pass').length
  const failed   = checklist.filter(cp => checks[cp.id] === 'fail').length
  const skipped  = checklist.filter(cp => checks[cp.id] === 'na').length
  const total    = checklist.length
  const progress = total ? Math.round((Object.keys(checks).length / total) * 100) : 0

  // New risk score after inspection (simulated)
  const newRisk = Math.max(10, item.riskScore - passed * 0.8 + failed * 3)

  const mark = (id, val) => {
    setChecks(c => ({ ...c, [id]: c[id] === val ? null : val }))
    if (val !== 'fail') setFailDetails(d => { const n = { ...d }; delete n[id]; return n })
  }
  const updateFail = (id, key, val) => setFailDetails(d => ({ ...d, [id]: { ...(d[id] ?? { severity: 'major', notes: '', camera: 'CAM-01', photo: null }), [key]: val } }))

  const saveDraft = () => {
    setSavingDraft(true)
    setTimeout(() => {
      setSavingDraft(false)
      addToast(t({ en: 'Draft saved successfully', ar: 'تم حفظ المسودة بنجاح' }), 'success')
    }, 700)
  }

  const canProceed = () => {
    if (step === 2) return sensors.every(s => sensorStatus[s.id] === 'confirmed')
    if (step === 3) return Object.keys(checks).length === total
    if (step === 4) return cosigned
    return true
  }

  const next = () => {
    if (step < 5) setStep(s => s + 1)
    else onClose()
  }
  const back = () => setStep(s => Math.max(1, s - 1))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="font-bold text-gray-900 text-sm">{t(item.buildingName)}</div>
            <div className="text-xs text-gray-400">SBC {item.sbcType} · {item.id}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50">
              {savingDraft ? '...' : t({ en: 'Save Draft', ar: 'حفظ مسودة' })}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="px-5 py-3 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step > s.n ? 'bg-green-500 border-green-500 text-white' :
                    step === s.n ? 'bg-[#991B1B] border-[#991B1B] text-white' :
                    'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {step > s.n ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.n}
                  </div>
                  <div className={`text-[9px] mt-0.5 text-center leading-tight font-medium ${step === s.n ? 'text-[#991B1B]' : 'text-gray-400'}`}>
                    {t(s.label)}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 mb-3 transition-colors ${step > s.n ? 'bg-green-400' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Step 1: Pre-inspection brief */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">{t({ en: 'Pre-Inspection Brief', ar: 'الموجز التمهيدي' })}</h3>
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  [t({ en: 'Building', ar: 'المبنى' }),        t(item.buildingName)],
                  [t({ en: 'SBC Type', ar: 'نوع SBC' }),       item.sbcType],
                  [t({ en: 'Last Inspection', ar: 'آخر فحص' }), item.lastInspection ?? '2024-10-15'],
                  [t({ en: 'Risk Score', ar: 'درجة المخاطر' }), item.riskScore],
                  [t({ en: 'Open Violations', ar: 'المخالفات' }), '3'],
                  [t({ en: 'BSO', ar: 'مسؤول البناء' }),       'Ahmed Al-Ghamdi'],
                  [t({ en: 'BSO Phone', ar: 'هاتف المسؤول' }), '+966 55 123 4567'],
                  [t({ en: 'Active Alerts', ar: 'التنبيهات' }), item.activeAlerts ?? '1'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                    <div className="font-semibold text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <strong>{t({ en: 'Known Deficiencies:', ar: 'العيوب المعروفة:' })}</strong>{' '}
                {t({ en: 'Fire exit signage faded on Floor 3; sprinkler head obstruction in Basement B2; CO₂ sensor SNS-003 weak signal.', ar: 'لافتات مخرج الطوارئ باهتة في الطابق 3؛ انسداد رأس رشاش في القبو B2؛ إشارة ضعيفة لمستشعر CO₂.' })}
              </div>
            </div>
          )}

          {/* Step 2: Signal checks */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">{t({ en: 'Sensor Signal Verification', ar: 'التحقق من إشارة المستشعرات' })}</h3>
              {noSignal.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-800">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>{t({ en: 'No-Signal Sensors Detected:', ar: 'مستشعرات بدون إشارة:' })}</strong>{' '}
                    {t({ en: `${noSignal.length} sensor(s) show No Signal. This is a risk gap — Minor violations auto-generated.`, ar: `${noSignal.length} مستشعر بدون إشارة. هذه فجوة مخاطر — تم إنشاء مخالفات بسيطة تلقائياً.` })}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {sensors.map(s => (
                  <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    sensorStatus[s.id] === 'confirmed' ? 'bg-green-50 border-green-200' :
                    s.signal === 'none' ? 'bg-red-50 border-red-200' :
                    s.signal === 'weak' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'
                  }`}>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      s.signal === 'strong' ? 'bg-green-500' : s.signal === 'weak' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{s.type}</div>
                      <div className="text-xs text-gray-500">{s.id} · {s.location} · {s.reading}</div>
                    </div>
                    <span className={`text-xs font-bold uppercase me-2 ${
                      s.signal === 'strong' ? 'text-green-600' : s.signal === 'weak' ? 'text-amber-600' : 'text-red-600'
                    }`}>{s.signal}</span>
                    <button onClick={() => setSensorStatus(prev => ({ ...prev, [s.id]: 'confirmed' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        sensorStatus[s.id] === 'confirmed'
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>
                      {sensorStatus[s.id] === 'confirmed' ? t({ en: 'Confirmed', ar: 'تأكد' }) : t({ en: 'Confirm', ar: 'تأكيد' })}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Checkpoint inspection */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">{t({ en: 'Checkpoint Inspection', ar: 'فحص النقاط' })}</h3>
                <div className="text-xs text-gray-500">{Object.keys(checks).length} / {total} · {progress}%</div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#991B1B] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-3">
                {checklist.map(cp => {
                  const result = checks[cp.id]
                  const fd = failDetails[cp.id]
                  return (
                    <div key={cp.id} className={`rounded-xl border p-3 transition-all ${
                      result === 'pass' ? 'bg-green-50 border-green-200' :
                      result === 'fail' ? 'bg-red-50 border-red-200' :
                      result === 'na'   ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                    }`}>
                      <div className="flex items-start gap-2 mb-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-0.5 ${SEV_BADGE[cp.severity] ?? SEV_BADGE.advisory}`}>
                          {cp.severity}
                        </span>
                        <span className="text-xs text-gray-800 leading-snug flex-1">{t(cp.text)}</span>
                      </div>
                      {/* Pass/Fail/NA */}
                      <div className="flex gap-2 mb-3">
                        {[
                          { v: 'pass', Icon: CheckCircle2, label: 'Pass', cls: 'text-green-600 border-green-200 hover:bg-green-50', active: 'ring-2 ring-green-400 bg-green-50' },
                          { v: 'fail', Icon: XCircle,      label: 'Fail', cls: 'text-red-600 border-red-200 hover:bg-red-50',       active: 'ring-2 ring-red-400 bg-red-50' },
                          { v: 'na',   Icon: Minus,        label: 'N/A',  cls: 'text-gray-400 border-gray-200 hover:bg-gray-50',    active: 'ring-2 ring-gray-300 bg-gray-50' },
                        ].map(({ v, Icon, label, cls, active }) => (
                          <button key={v} onClick={() => mark(cp.id, v)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 border rounded-lg text-xs font-semibold transition-all ${cls} ${result === v ? active : ''}`}>
                            <Icon className="w-3.5 h-3.5" />{label}
                          </button>
                        ))}
                      </div>
                      {/* Fail details */}
                      {result === 'fail' && (
                        <div className="space-y-2 pt-2 border-t border-red-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-gray-500 block mb-1">{t({ en: 'Severity', ar: 'الخطورة' })}</label>
                              <select value={fd?.severity ?? 'major'} onChange={e => updateFail(cp.id, 'severity', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none">
                                {['life-safety','critical','major','minor','advisory'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-500 block mb-1">{t({ en: 'Camera Ref', ar: 'مرجع الكاميرا' })}</label>
                              <select value={fd?.camera ?? 'CAM-01'} onChange={e => updateFail(cp.id, 'camera', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none">
                                {CAMERAS.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 block mb-1">{t({ en: 'Notes (required)', ar: 'ملاحظات (مطلوب)' })}</label>
                            <textarea value={fd?.notes ?? ''} onChange={e => updateFail(cp.id, 'notes', e.target.value)}
                              rows={2} placeholder={t({ en: 'Describe the violation...', ar: 'صف المخالفة...' })}
                              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-red-300" />
                          </div>
                          <label className="flex items-center gap-2 p-2 bg-white border border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-xs text-gray-500">
                            <Camera className="w-3.5 h-3.5" />
                            {fd?.photo ? fd.photo : t({ en: 'Upload Photo (optional)', ar: 'رفع صورة (اختياري)' })}
                            <input type="file" accept="image/*" className="hidden" onChange={e => updateFail(cp.id, 'photo', e.target.files?.[0]?.name ?? null)} />
                          </label>
                          {(fd?.severity === 'critical' || fd?.severity === 'life-safety') && (
                            <button onClick={() => setShowEnforcement(cp.id)}
                              className="flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:underline">
                              <Shield className="w-3 h-3" />
                              {t({ en: 'View Enforcement Chain', ar: 'عرض سلسلة التطبيق' })}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: BSO Co-sign */}
          {step === 4 && (
            <div className="space-y-4 text-center">
              <h3 className="font-bold text-gray-800">{t({ en: 'Safety Officer Co-sign', ar: 'توقيع مسؤول السلامة' })}</h3>
              <p className="text-sm text-gray-500">
                {t({ en: 'The Building Safety Officer must scan the QR code on your device to co-sign this inspection.', ar: 'يجب على مسؤول سلامة المبنى مسح رمز QR على جهازك للتوقيع المشترك على هذا الفحص.' })}
              </p>
              {!cosigned ? (
                <div className="space-y-4">
                  {!showQr ? (
                    <button onClick={() => setShowQr(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#991B1B] text-white font-bold text-sm mx-auto hover:bg-red-800 transition-colors">
                      <QrCode className="w-5 h-5" />
                      {t({ en: 'Generate Co-sign QR', ar: 'إنشاء رمز QR للتوقيع' })}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {/* Fake QR code */}
                      <div className="w-36 h-36 mx-auto border-4 border-[#991B1B] rounded-xl p-2 bg-white">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => (
                            Math.floor(Math.random() * 2 + r * c) % 2 === 0
                              ? <rect key={`${r}${c}`} x={c*20+2} y={r*20+2} width="16" height="16" fill="#1B2F5B" rx="2" />
                              : null
                          )))}
                          <rect x="2" y="2"   width="38" height="38" fill="none" stroke="#991B1B" strokeWidth="3" rx="4" />
                          <rect x="60" y="2"  width="38" height="38" fill="none" stroke="#991B1B" strokeWidth="3" rx="4" />
                          <rect x="2" y="60"  width="38" height="38" fill="none" stroke="#991B1B" strokeWidth="3" rx="4" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">INSP-{item.id}-{Date.now().toString(36).toUpperCase()}</div>
                      <button onClick={() => setCosigned(true)}
                        className="px-6 py-2.5 rounded-xl border-2 border-green-500 text-green-700 font-bold text-sm hover:bg-green-50 transition-colors">
                        {t({ en: 'Simulate BSO Co-sign', ar: 'محاكاة توقيع مسؤول البناء' })}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <div className="font-bold text-green-800">{t({ en: 'Co-sign Complete', ar: 'اكتمل التوقيع المشترك' })}</div>
                  <div className="text-xs text-green-600 mt-1">Ahmed Al-Ghamdi · {new Date().toLocaleString()}</div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Submission */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">{t({ en: 'Inspection Summary', ar: 'ملخص الفحص' })}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t({ en: 'Total', ar: 'الإجمالي' }),  value: total,   color: 'text-gray-900' },
                  { label: t({ en: 'Passed', ar: 'نجح' }),      value: passed,  color: 'text-green-600' },
                  { label: t({ en: 'Failed', ar: 'فشل' }),      value: failed,  color: 'text-red-600' },
                  { label: t({ en: 'N/A', ar: 'لا ينطبق' }),    value: skipped, color: 'text-gray-400' },
                ].map((k, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">{k.label}</div>
                    <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t({ en: 'Previous Risk Score', ar: 'درجة المخاطر السابقة' })}</span>
                  <span className="font-mono font-bold text-gray-700">{item.riskScore}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t({ en: 'New Risk Score', ar: 'درجة المخاطر الجديدة' })}</span>
                  <span className={`font-mono font-bold text-xl ${newRisk < 50 ? 'text-green-600' : newRisk < 70 ? 'text-amber-600' : 'text-red-600'}`}>
                    {newRisk.toFixed(0)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${newRisk < 50 ? 'bg-green-500' : newRisk < 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${newRisk}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t({ en: 'Violations Generated', ar: 'المخالفات المُنشأة' })}</span>
                  <span className="font-mono font-bold text-red-600">{failed}</span>
                </div>
              </div>
              <button
                onClick={() => addToast(t({ en: 'Inspection report PDF download started', ar: 'بدأ تنزيل تقرير الفحص PDF' }), 'success')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#991B1B] text-[#991B1B] font-bold text-sm hover:bg-red-50 transition-colors">
                <FileText className="w-4 h-4" />
                {t({ en: 'Download Inspection Report PDF', ar: 'تنزيل تقرير الفحص PDF' })}
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 flex-shrink-0">
          <button onClick={back} disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {t({ en: 'Back', ar: 'رجوع' })}
          </button>
          <div className="text-xs text-gray-400">{t({ en: 'Step', ar: 'الخطوة' })} {step} / {STEPS.length}</div>
          <button onClick={next} disabled={!canProceed() && step < 5}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {step === 5 ? t({ en: 'Close', ar: 'إغلاق' }) : t({ en: 'Next', ar: 'التالي' })}
            {step < 5 && (isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
          </button>
        </div>
      </div>

      {/* Enforcement chain modal */}
      {showEnforcement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-red-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />{t({ en: 'Enforcement Chain', ar: 'سلسلة التطبيق' })}
              </div>
              <button onClick={() => setShowEnforcement(null)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { n: 1, action: { en: 'Warning Notice issued to owner',              ar: 'إصدار إشعار تحذير للمالك'              }, color: 'bg-yellow-50 border-yellow-200' },
                { n: 2, action: { en: 'Risk score penalty (+15 points)',              ar: 'غرامة درجة المخاطر (+15 نقطة)'         }, color: 'bg-orange-50 border-orange-200' },
                { n: 3, action: { en: 'Owner notification via SMS & app',            ar: 'إخطار المالك عبر SMS والتطبيق'         }, color: 'bg-orange-50 border-orange-200' },
                { n: 4, action: { en: 'Insurance provider notified — rate review',   ar: 'إخطار مزود التأمين — مراجعة الأسعار'  }, color: 'bg-red-50 border-red-200' },
                { n: 5, action: { en: 'CD enforcement inspection scheduled (48h)',   ar: 'جدولة فحص الإلزام خلال 48 ساعة'       }, color: 'bg-red-50 border-red-200' },
              ].map(row => (
                <div key={row.n} className={`flex items-start gap-2 p-2.5 rounded-lg border ${row.color}`}>
                  <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">{row.n}</span>
                  <span className="text-xs">{t(row.action)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Module ───────────────────────────────────────────────────────────────
export default function DigitalInspection({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [activeForm, setActiveForm] = useState(null)
  const [violations, setViolations] = useState(aiViolations)
  const [issuedIds, setIssuedIds]   = useState(new Set(['AV-001', 'AV-003']))
  const [drafts, setDrafts]         = useState(new Set(['IQ-006'])) // Items with saved drafts

  const queue = inspectionQueue.filter(i => i.status !== 'completed')
  const completed = inspectionQueue.filter(i => i.status === 'completed')

  const issueViolation = (avId) => {
    setIssuedIds(s => new Set([...s, avId]))
    addToast(t({ en: 'Violation issued and added to enforcement queue', ar: 'تم إصدار المخالفة وإضافتها لقائمة التطبيق' }), 'success')
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Digital Inspection', ar: 'الفحص الرقمي' })}</h1>

      {/* Inspection Queue */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{t({ en: 'Inspection Queue', ar: 'طابور الفحص' })}</h2>
          <span className="text-xs text-gray-400">{queue.length} {t({ en: 'pending', ar: 'معلق' })}</span>
        </div>
        <div className="divide-y divide-gray-50">
          {queue.map(item => (
            <div key={item.id} className="px-5 py-3.5 flex items-center gap-4">
              <RiskBadge score={item.riskScore} showScore />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{t(item.buildingName)}</div>
                <div className="text-xs text-gray-400">{item.id} · SBC {item.sbcType} · {t({ en: 'Due', ar: 'موعد' })}: <strong>{item.scheduledDate}</strong></div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {drafts.has(item.id) && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">DRAFT</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>{item.priority}</span>
                <button onClick={() => setActiveForm(item)}
                  className="px-3 py-1.5 bg-[#991B1B] text-white text-xs font-bold rounded-lg hover:bg-red-800 transition-colors">
                  {drafts.has(item.id) ? t({ en: 'Resume', ar: 'استئناف' }) : t({ en: 'Start', ar: 'ابدأ' })}
                </button>
              </div>
            </div>
          ))}
          {completed.slice(0, 3).map(item => (
            <div key={item.id} className="px-5 py-3.5 flex items-center gap-4 opacity-60">
              <RiskBadge score={item.riskScore} showScore />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-700 text-sm truncate">{t(item.buildingName)}</div>
                <div className="text-xs text-gray-400">{item.id} · {t({ en: 'Completed', ar: 'مكتمل' })}: {item.completedDate}</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">DONE</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Auto-Violations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'AI Auto-Violations', ar: 'المخالفات الآلية بالذكاء الاصطناعي' })}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500">
              <th className="px-4 py-2.5 text-start font-medium">{t({ en: 'Building', ar: 'المبنى' })}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t({ en: 'Violation', ar: 'المخالفة' })}</th>
              <th className="px-3 py-2.5 text-center font-medium">Conf.</th>
              <th className="px-3 py-2.5 text-center font-medium">Method</th>
              <th className="px-3 py-2.5 text-center font-medium">Action</th>
            </tr></thead>
            <tbody>
              {violations.map(av => {
                const issued = issuedIds.has(av.id)
                return (
                  <tr key={av.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="font-medium text-gray-900 text-xs">{t(av.buildingName)}</div><div className="text-[10px] text-gray-400">{av.id}</div></td>
                    <td className="px-4 py-3"><div className="text-xs text-gray-700">{t(av.type)}</div></td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${av.confidence >= 90 ? 'bg-green-500' : 'bg-amber-400'}`} style={{width:`${av.confidence}%`}} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-600">{av.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${av.issuanceMethod === 'AUTO' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {av.issuanceMethod}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => !issued && issueViolation(av.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          issued ? 'bg-green-100 text-green-700 cursor-default' : 'bg-[#991B1B] text-white hover:bg-red-800'
                        }`}>
                        {issued ? t({ en: 'Issued', ar: 'صادر' }) : t({ en: 'Issue', ar: 'إصدار' })}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection wizard modal */}
      {activeForm && (
        <InspectionWizard
          item={activeForm}
          onClose={() => setActiveForm(null)}
          addToast={addToast}
          t={t} lang={lang}
        />
      )}
    </div>
  )
}
