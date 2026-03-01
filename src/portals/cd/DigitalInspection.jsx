import { useState } from 'react'
import { inspectionQueue, aiViolations } from '../../data/cdData'
import { getChecklistForSBC } from '../../data/inspectionChecklists'
import RiskBadge from '../../components/RiskBadge'
import StatusBadge from '../../components/StatusBadge'
import { CheckCircle2, XCircle, Camera, ChevronRight, ChevronLeft, AlertTriangle, Eye, Minus } from 'lucide-react'

const SEVERITY_COLORS = {
  'life-safety': 'bg-red-950 text-white',
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-amber-100 text-amber-800',
  advisory: 'bg-blue-100 text-blue-800',
}

export default function DigitalInspection({ t, lang }) {
  const isRTL = lang === 'ar'
  const [activeForm, setActiveForm] = useState(null) // inspectionQueue item
  const [checkpoints, setCheckpoints] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [draftViolations, setDraftViolations] = useState([])
  const [violations, setViolations] = useState(aiViolations)
  const [issuedIds, setIssuedIds] = useState(new Set(['AV-001', 'AV-003', 'AV-005']))
  const [showEnforcement, setShowEnforcement] = useState(null)

  const openForm = (item) => {
    setActiveForm(item)
    setCheckpoints({})
    setSubmitted(false)
    setDraftViolations([])
  }

  const mark = (id, val) => {
    const prev = checkpoints[id]
    const next = prev === val ? null : val
    setCheckpoints(c => ({ ...c, [id]: next }))
    if (next === 'fail') {
      // Auto-create draft violation
      setDraftViolations(v => v.some(d => d.id === id) ? v : [
        ...v,
        { id, checkpoint: id, buildingName: activeForm.buildingName, severity: 'high', status: 'draft' },
      ])
    } else {
      setDraftViolations(v => v.filter(d => d.id !== id))
    }
  }

  const submitForm = () => setSubmitted(true)

  const issueViolation = (avId) => {
    setIssuedIds(s => new Set([...s, avId]))
    const v = violations.find(v => v.id === avId)
    if (v?.severity === 'critical' || v?.severity === 'life-safety') {
      setShowEnforcement(avId)
    }
  }

  const checklist = activeForm ? getChecklistForSBC(activeForm.sbcType) : null
  const allAnswered = checklist && checklist.checkpoints.every(cp => checkpoints[cp.id])

  // Queue: upcoming + overdue first
  const queue = [...inspectionQueue].sort((a, b) => a.priority - b.priority)

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Enforcement modal */}
      {showEnforcement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{t({ en: 'Critical Violation — Enforcement Controls Active', ar: 'مخالفة حرجة — ضوابط التطبيق نشطة' })}</div>
                <div className="text-xs text-gray-500">{t({ en: 'The following automated enforcement actions have been triggered:', ar: 'تم تفعيل الإجراءات التطبيقية الآلية التالية:' })}</div>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {[
                { icon: '⚡', text: { en: 'Electricity isolation order sent to utility authority', ar: 'أمر عزل الكهرباء أُرسل لسلطة المرافق' }, color: 'bg-red-50 text-red-800' },
                { icon: '👤', text: { en: 'Owner notified via Saqr app — SLA clock started (24h)', ar: 'تم إخطار المالك عبر صقر — بدأ عداد SLA (24 ساعة)' }, color: 'bg-orange-50 text-orange-800' },
                { icon: '📋', text: { en: 'Mandatory on-site inspection within 24 hours scheduled', ar: 'جُدِّل فحص ميداني إلزامي خلال 24 ساعة' }, color: 'bg-amber-50 text-amber-800' },
                { icon: '🔒', text: { en: 'Insurance portal flagged — underwriter alerted', ar: 'بوابة التأمين مُحدَّثة — تم تنبيه المكتتب' }, color: 'bg-blue-50 text-blue-800' },
                { icon: '📊', text: { en: 'Risk score updated — penalty applied (+28 points)', ar: 'درجة المخاطر مُحدَّثة — غرامة مطبّقة (+28 نقطة)' }, color: 'bg-purple-50 text-purple-800' },
              ].map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${a.color}`}>
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-xs font-medium">{t(a.text)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowEnforcement(null)}
              className="w-full py-2.5 bg-[#991B1B] text-white rounded-xl text-sm font-semibold hover:bg-red-800 transition-colors"
            >
              {t({ en: 'Acknowledged', ar: 'تم الإقرار' })}
            </button>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Digital Inspection', ar: 'الفحص الرقمي' })}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* ── Inspection Queue ─── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'AI Risk-Ranked Inspection Queue', ar: 'قائمة الفحوصات بترتيب AI' })}</h2>
            <span className="text-xs text-gray-400">{queue.filter(q => q.status !== 'completed').length} {t({ en: 'pending', ar: 'معلق' })}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {queue.map((item, i) => (
              <div key={item.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${item.status === 'overdue' ? 'bg-red-50' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                  i === 0 ? 'bg-red-700' : i === 1 ? 'bg-red-500' : i === 2 ? 'bg-orange-500' : i < 6 ? 'bg-amber-500' : 'bg-gray-400'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{t(item.buildingName)}</div>
                  <div className="text-xs text-gray-400">{item.sbcType} · {item.inspector}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RiskBadge score={item.riskScore} />
                  {item.status === 'completed'
                    ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                    : (
                      <button
                        onClick={() => openForm(item)}
                        className="px-2.5 py-1 bg-[#1A6B3A] text-white text-xs font-medium rounded-lg hover:bg-green-800 transition-colors"
                      >
                        {t({ en: 'Manage', ar: 'إدارة' })}
                      </button>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form or AI violations ─── */}
        {activeForm ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-[#1A6B3A]/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'Inspection Form', ar: 'نموذج الفحص' })}</h2>
                  <p className="text-xs text-gray-500">{t(activeForm.buildingName)} · SBC {activeForm.sbcType} · {t(checklist?.label)}</p>
                </div>
                <button onClick={() => setActiveForm(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!submitted ? (
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {checklist?.checkpoints.map(cp => (
                    <div key={cp.id} className={`p-3 rounded-xl border transition-all ${
                      checkpoints[cp.id] === 'pass' ? 'bg-green-50 border-green-200' :
                      checkpoints[cp.id] === 'fail' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-100'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="text-xs text-gray-800 font-medium leading-relaxed">{t(cp.text)}</div>
                          <div className={`text-[10px] mt-0.5 font-semibold ${
                            cp.severity === 'life-safety' ? 'text-red-700' :
                            cp.severity === 'critical' ? 'text-red-600' :
                            cp.severity === 'high' ? 'text-orange-600' : 'text-gray-500'
                          }`}>{cp.severity.toUpperCase()}</div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => mark(cp.id, 'pass')}
                            className={`p-1.5 rounded-lg border transition-colors ${checkpoints[cp.id] === 'pass' ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-300'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => mark(cp.id, 'fail')}
                            className={`p-1.5 rounded-lg border transition-colors ${checkpoints[cp.id] === 'fail' ? 'bg-red-500 text-white border-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-300'}`}>
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => mark(cp.id, 'na')}
                            className={`p-1.5 rounded-lg border transition-colors ${checkpoints[cp.id] === 'na' ? 'bg-gray-400 text-white border-gray-400' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {checkpoints[cp.id] === 'fail' && (
                        <div className="mt-2 p-2 bg-red-100 rounded-lg flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          <span className="text-[10px] font-semibold text-red-700">
                            {t({ en: 'Draft violation created — will be issued on submission', ar: 'تم إنشاء مخالفة مسودة — ستُصدر عند التقديم' })}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {draftViolations.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-xs font-semibold text-red-800 mb-1">
                      {draftViolations.length} {t({ en: 'violation(s) will be issued on submit', ar: 'مخالفة ستُصدر عند التقديم' })}
                    </div>
                    {draftViolations.map(d => (
                      <div key={d.id} className="text-[10px] text-red-700">· {d.id} — {d.severity}</div>
                    ))}
                  </div>
                )}

                <button
                  onClick={submitForm}
                  disabled={!allAnswered}
                  className="w-full py-2.5 bg-[#1A6B3A] text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t({ en: 'Submit & Sign Digitally', ar: 'تقديم والتوقيع رقمياً' })}
                </button>
              </div>
            ) : (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-3" />
                <div className="font-bold text-gray-900">{t({ en: 'Inspection Submitted', ar: 'تم تقديم الفحص' })}</div>
                <p className="text-xs text-gray-500 mt-1">{t({ en: 'Digital signature applied. Risk score recalculating. Owner notified.', ar: 'التوقيع الرقمي مُطبَّق. إعادة حساب المخاطر. تم إخطار المالك.' })}</p>
                {draftViolations.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl text-xs text-red-700 text-start">
                    <div className="font-semibold mb-1">{t({ en: 'Violations issued:', ar: 'المخالفات المُصدَرة:' })}</div>
                    {draftViolations.map(d => <div key={d.id}>· Violation {d.id}</div>)}
                  </div>
                )}
                <button onClick={() => setActiveForm(null)} className="mt-4 text-sm text-[#1A6B3A] font-medium hover:underline">
                  {t({ en: 'Back to Queue', ar: 'العودة إلى القائمة' })}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* AI Auto-Violations */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">{t({ en: 'AI Auto-Violations', ar: 'المخالفات الآلية بالذكاء الاصطناعي' })}</h2>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                {violations.filter(v => !issuedIds.has(v.id) && v.status === 'pending').length} {t({ en: 'pending review', ar: 'قيد المراجعة' })}
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {violations.map(v => {
                const issued = issuedIds.has(v.id) || v.status === 'issued'
                return (
                  <div key={v.id} className={`p-4 ${v.status === 'escalated' ? 'bg-red-50' : ''}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] text-gray-400">{v.id}</span>
                          <span className="font-semibold text-sm text-gray-900">{t(v.type)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{t(v.buildingName)} · {v.camera} · {t(v.location)}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                        v.issuanceMethod === 'AUTO' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>{v.issuanceMethod}</span>
                    </div>

                    {/* Confidence bar */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${v.confidence >= 90 ? 'bg-green-500' : v.confidence >= 80 ? 'bg-amber-500' : 'bg-red-400'}`}
                          style={{ width: `${v.confidence}%` }} />
                      </div>
                      <span className="text-xs font-mono text-gray-600 flex-shrink-0">{v.confidence}%</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${SEVERITY_COLORS[v.severity] ?? 'bg-gray-100 text-gray-700'}`}>
                        {v.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {!issued ? (
                        <>
                          <button
                            onClick={() => issueViolation(v.id)}
                            className="px-3 py-1.5 bg-[#991B1B] text-white text-xs font-medium rounded-lg hover:bg-red-800 transition-colors"
                          >
                            {t({ en: 'Issue Violation', ar: 'إصدار المخالفة' })}
                          </button>
                          <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50">
                            {t({ en: 'Dismiss', ar: 'رفض' })}
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t({ en: 'Violation Issued', ar: 'تم إصدار المخالفة' })}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
