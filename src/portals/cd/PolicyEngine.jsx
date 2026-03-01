import { useState } from 'react'
import { cdPolicyRules } from '../../data/cdData'
import { Settings2, Plus, CheckCircle2, X, ChevronDown } from 'lucide-react'

const APPROVAL_STAGES = [
  { id: 'draft',           label: { en: 'Draft',              ar: 'مسودة'             }, by: 'Author' },
  { id: 'peer-review',     label: { en: 'Peer Review',        ar: 'مراجعة الأقران'    }, by: 'Hassan Al-Ghamdi' },
  { id: 'supervisor',      label: { en: 'Supervisor Approval', ar: 'موافقة المشرف'    }, by: 'Director Khalid' },
  { id: 'legal',           label: { en: 'Legal Review',       ar: 'المراجعة القانونية' }, by: 'Legal Dept.' },
  { id: 'ai-encoding',     label: { en: 'AI Encoding',        ar: 'ترميز الذكاء الاصطناعي' }, by: 'MDRE Engine' },
  { id: 'active',          label: { en: 'Active',             ar: 'نشط'               }, by: 'System' },
]

const SEVERITY_COLORS = {
  advisory:    'bg-blue-100 text-blue-700',
  minor:       'bg-yellow-100 text-yellow-700',
  major:       'bg-orange-100 text-orange-700',
  critical:    'bg-red-100 text-red-700',
  'life-safety': 'bg-red-800 text-white',
}

const DOMAIN_COLORS = {
  'sensor-threshold': 'bg-purple-100 text-purple-700',
  'camera-detection': 'bg-blue-100 text-blue-700',
  'time-based':       'bg-amber-100 text-amber-700',
  'manual-inspection':'bg-gray-100 text-gray-700',
  'api-change':       'bg-teal-100 text-teal-700',
}

const SBC_GROUPS = ['A', 'B', 'E', 'F', 'H', 'I', 'M', 'R', 'S']
const SOURCES    = ['SBC 201', 'SBC 801', 'CDA Regulation', 'NFPA Reference', 'Custom']
const TRIGGERS   = ['Sensor Threshold', 'API Data Change', 'Time-Based', 'Camera Detection', 'Manual Inspection']
const ACTIONS    = ['Warning Notice', 'Score Penalty', 'Owner Notification', 'Insurer Notification', 'CD Inspection Scheduled', 'Utility Isolation Order', 'Closure Order']
const AI_OPTIONS = ['Yes', 'No', 'Requires Human Review']

// ── Rule Builder Modal ────────────────────────────────────────────────────────
function RuleBuilderModal({ onClose, onSave, t, lang }) {
  const isRTL = lang === 'ar'
  const [form, setForm] = useState({
    nameEn: '', nameAr: '', source: SOURCES[0], article: '', descEn: '',
    trigger: TRIGGERS[0], threshold: '', occupancies: [], severity: 'major',
    actions: [], aiEncodable: 'Yes', notes: '',
  })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleOcc = (g) => setF('occupancies', form.occupancies.includes(g) ? form.occupancies.filter(x => x !== g) : [...form.occupancies, g])
  const toggleAct = (a) => setF('actions', form.actions.includes(a) ? form.actions.filter(x => x !== a) : [...form.actions, a])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="font-bold text-gray-900">{t({ en: 'New Policy Rule', ar: 'قاعدة سياسة جديدة' })}</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Rule Name (EN)', ar: 'اسم القاعدة (EN)' })}</label>
              <input value={form.nameEn} onChange={e => setF('nameEn', e.target.value)} placeholder="e.g. Sprinkler Pressure Min"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div dir="rtl">
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Rule Name (AR)', ar: 'اسم القاعدة (AR)' })}</label>
              <input value={form.nameAr} onChange={e => setF('nameAr', e.target.value)} placeholder="مثال: الحد الأدنى لضغط الرشاشات"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            </div>
          </div>
          {/* Source + Article */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Regulatory Source', ar: 'المصدر التنظيمي' })}</label>
              <select value={form.source} onChange={e => setF('source', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'SBC Article Ref.', ar: 'مرجع المادة' })}</label>
              <input value={form.article} onChange={e => setF('article', e.target.value)} placeholder="e.g. SBC 801 Ch.9 §4.2"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Rule Description', ar: 'وصف القاعدة' })}</label>
            <textarea value={form.descEn} onChange={e => setF('descEn', e.target.value)} rows={2}
              placeholder={t({ en: 'Plain language explanation...', ar: 'شرح بلغة بسيطة...' })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none" />
          </div>
          {/* Trigger */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Trigger Condition', ar: 'شرط التفعيل' })}</label>
              <select value={form.trigger} onChange={e => setF('trigger', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {TRIGGERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {form.trigger === 'Sensor Threshold' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Threshold Value', ar: 'قيمة العتبة' })}</label>
                <input type="number" value={form.threshold} onChange={e => setF('threshold', e.target.value)} placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
            )}
            {form.trigger !== 'Sensor Threshold' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Condition Value', ar: 'قيمة الشرط' })}</label>
                <input value={form.threshold} onChange={e => setF('threshold', e.target.value)} placeholder="e.g. daily at 06:00"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
            )}
          </div>
          {/* Occupancy groups */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">
              {t({ en: 'Affected Occupancy Groups', ar: 'مجموعات الإشغال المتأثرة' })}
              <button onClick={() => setF('occupancies', SBC_GROUPS)} className="ms-2 text-blue-500 hover:underline">All</button>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SBC_GROUPS.map(g => (
                <button key={g} onClick={() => toggleOcc(g)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold border-2 transition-all ${
                    form.occupancies.includes(g) ? 'bg-[#991B1B] border-[#991B1B] text-white' : 'border-gray-200 text-gray-500 hover:border-red-300'
                  }`}>{g}</button>
              ))}
            </div>
          </div>
          {/* Severity + AI */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Violation Severity', ar: 'خطورة المخالفة' })}</label>
              <select value={form.severity} onChange={e => setF('severity', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {['advisory','minor','major','critical','life-safety'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'AI Encodable', ar: 'قابل للترميز الذكي' })}</label>
              <select value={form.aiEncodable} onChange={e => setF('aiEncodable', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {AI_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {/* Enforcement actions */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({ en: 'Enforcement Actions', ar: 'إجراءات التطبيق' })}</label>
            <div className="grid grid-cols-2 gap-1.5">
              {ACTIONS.map(a => (
                <button key={a} onClick={() => toggleAct(a)}
                  className={`text-start px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.actions.includes(a) ? 'bg-red-50 border-red-300 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{a}</button>
              ))}
            </div>
          </div>
          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Notes', ar: 'ملاحظات' })}</label>
            <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none" />
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">
            {t({ en: 'Save as Draft', ar: 'حفظ كمسودة' })}
          </button>
          <button onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800 transition-colors">
            {t({ en: 'Submit for Review', ar: 'تقديم للمراجعة' })}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PolicyEngine({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [rules, setRules]     = useState(cdPolicyRules)
  const [showBuilder, setShowBuilder] = useState(false)
  const [progressing, setProgressing] = useState({}) // ruleId → stage index

  const progressRule = (ruleId) => {
    const current = progressing[ruleId] ?? APPROVAL_STAGES.findIndex(s => s.id === (rules.find(r => r.id === ruleId)?.approvalStage ?? 'draft'))
    const next = Math.min(APPROVAL_STAGES.length - 1, current + 1)
    setProgressing(p => ({ ...p, [ruleId]: next }))
    const stage = APPROVAL_STAGES[next]
    addToast(t({ en: `Rule advanced to: ${t(stage.label)} (by ${stage.by})`, ar: `تقدمت القاعدة إلى: ${t(stage.label)} (بواسطة ${stage.by})` }), 'info')
    if (next === APPROVAL_STAGES.length - 1) {
      setRules(prev => prev.map(r => r.id === ruleId ? { ...r, aiStatus: 'active' } : r))
      setTimeout(() => addToast(t({ en: 'Rule is now LIVE. Scanning all buildings...', ar: 'القاعدة الآن نشطة. جارٍ مسح جميع المباني...' }), 'success'), 300)
      setTimeout(() => addToast(t({ en: 'Scan complete. 5 violations detected across 3 buildings.', ar: 'اكتمل المسح. 5 مخالفات في 3 مبانٍ.' }), 'warning'), 2300)
    }
  }

  const saveRule = (form) => {
    const newRule = {
      id: `PR-${Date.now()}`, name: { en: form.nameEn || 'New Rule', ar: form.nameAr || 'قاعدة جديدة' },
      source: form.source, severity: form.severity, aiStatus: 'pending', violations: 0,
      affectedBuildings: form.occupancies.length * 3, approvalStage: 'peer-review',
      trigger: form.trigger, domain: form.trigger.toLowerCase().replace(/ /g, '-'),
    }
    setRules(prev => [newRule, ...prev])
    setShowBuilder(false)
    addToast(t({ en: 'Rule submitted for peer review', ar: 'القاعدة مُقدَّمة للمراجعة' }), 'success')
  }

  const kpis = [
    { label: { en: 'Active Rules', ar: 'القواعد النشطة' }, value: rules.filter(r => r.aiStatus === 'active').length, color: 'text-green-600' },
    { label: { en: 'Pending Review', ar: 'قيد المراجعة' }, value: rules.filter(r => r.aiStatus === 'pending').length, color: 'text-amber-600' },
    { label: { en: 'Total Violations', ar: 'إجمالي المخالفات' }, value: rules.reduce((s, r) => s + (r.violations ?? 0), 0), color: 'text-red-600' },
    { label: { en: 'Buildings Covered', ar: 'المباني المشمولة' }, value: rules.reduce((s, r) => s + (r.affectedBuildings ?? 0), 0), color: 'text-blue-600' },
  ]

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-[#0891B2]" />
          {t({ en: 'Policy Engine', ar: 'محرك السياسات' })}
        </h1>
        <button onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800 transition-colors">
          <Plus className="w-4 h-4" />{t({ en: 'New Rule', ar: 'قاعدة جديدة' })}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{t(k.label)}</div>
            <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'Policy Rules', ar: 'قواعد السياسات' })}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500">
              <th className="px-4 py-3 text-start font-medium">{t({ en: 'Rule', ar: 'القاعدة' })}</th>
              <th className="px-4 py-3 text-center font-medium">{t({ en: 'Severity', ar: 'الخطورة' })}</th>
              <th className="px-4 py-3 text-center font-medium">{t({ en: 'AI Status', ar: 'حالة AI' })}</th>
              <th className="px-4 py-3 text-center font-medium">{t({ en: 'Violations', ar: 'مخالفات' })}</th>
              <th className="px-4 py-3 text-center font-medium">{t({ en: 'Approval Stage', ar: 'مرحلة الموافقة' })}</th>
              <th className="px-4 py-3 text-center font-medium">{t({ en: 'Action', ar: 'إجراء' })}</th>
            </tr></thead>
            <tbody>
              {rules.map(rule => {
                const currentStageIdx = progressing[rule.id] ?? APPROVAL_STAGES.findIndex(s => s.id === (rule.approvalStage ?? 'draft'))
                const currentStage = APPROVAL_STAGES[Math.max(0, currentStageIdx)]
                const isActive = rule.aiStatus === 'active' || currentStageIdx >= APPROVAL_STAGES.length - 1
                return (
                  <tr key={rule.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{t(rule.name)}</div>
                      <div className="text-[10px] text-gray-400">{rule.source ?? rule.id}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${SEVERITY_COLORS[rule.severity] ?? SEVERITY_COLORS.minor}`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isActive ? 'ACTIVE' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-red-600">{rule.violations ?? 0}</td>
                    <td className="px-4 py-3 text-center">
                      {!isActive && (
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-0.5">
                            {APPROVAL_STAGES.map((s, i) => (
                              <div key={s.id} className={`w-4 h-4 rounded-full border transition-all ${
                                i <= currentStageIdx ? 'bg-[#991B1B] border-[#991B1B]' : 'bg-white border-gray-200'
                              }`} title={t(s.label)} />
                            ))}
                          </div>
                          <span className="ms-2 text-[10px] text-gray-500">{t(currentStage?.label)}</span>
                        </div>
                      )}
                      {isActive && <span className="text-xs text-green-600 font-semibold">{t({ en: 'Published', ar: 'منشور' })}</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!isActive && (
                        <button onClick={() => progressRule(rule.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#0891B2] text-white text-[10px] font-bold hover:bg-cyan-700 transition-colors">
                          {t({ en: 'Advance Stage', ar: 'تقدم مرحلة' })}
                        </button>
                      )}
                      {isActive && <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showBuilder && (
        <RuleBuilderModal onClose={() => setShowBuilder(false)} onSave={saveRule} t={t} lang={lang} />
      )}
    </div>
  )
}
