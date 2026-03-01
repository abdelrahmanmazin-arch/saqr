import { useState } from 'react'
import { cdPolicyRules } from '../../data/cdData'
import RiskBadge from '../../components/RiskBadge'
import { Settings2, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

const DOMAIN_COLORS = {
  'fire-safety':  'bg-red-100 text-red-700',
  'detection':    'bg-orange-100 text-orange-700',
  'equipment':    'bg-amber-100 text-amber-700',
  'electrical':   'bg-yellow-100 text-yellow-800',
  'evacuation':   'bg-blue-100 text-blue-700',
  'hazmat':       'bg-purple-100 text-purple-700',
  'compliance':   'bg-green-100 text-green-700',
}

const AI_STATUS = {
  active:           { cls: 'bg-green-100 text-green-800', label: { en: 'AI Encoded', ar: 'مُرمَّز بالذكاء الاصطناعي' } },
  'in-development': { cls: 'bg-blue-100 text-blue-800',   label: { en: 'In Development', ar: 'قيد التطوير' } },
  draft:            { cls: 'bg-gray-100 text-gray-600',   label: { en: 'Draft', ar: 'مسودة' } },
}

// Publishing stages
const PUB_STAGES = [
  { id: 'draft',         label: { en: 'Draft', ar: 'مسودة' } },
  { id: 'peer-review',   label: { en: 'Peer Review', ar: 'مراجعة الأقران' } },
  { id: 'supervisor',    label: { en: 'Supervisor Approval', ar: 'موافقة المشرف' } },
  { id: 'legal',         label: { en: 'Legal Sign-off', ar: 'توقيع قانوني' } },
  { id: 'ai-encoding',   label: { en: 'AI Encoding', ar: 'ترميز الذكاء الاصطناعي' } },
  { id: 'published',     label: { en: 'Published', ar: 'منشور' } },
]

const STAGE_ORDER = ['draft', 'peer-review', 'supervisor', 'legal', 'ai-encoding', 'published']

export default function PolicyEngine({ t, lang }) {
  const isRTL = lang === 'ar'
  const [rules, setRules] = useState(cdPolicyRules)
  const [publishing, setPublishing] = useState(null) // rule id being published
  const [publishStage, setPublishStage] = useState(null)
  const [publishTimer, setPublishTimer] = useState(null)

  const getSevScore = (sev) => {
    if (sev === 'life-safety') return 95
    if (sev === 'critical')    return 85
    if (sev === 'high')        return 72
    if (sev === 'medium')      return 58
    return 40
  }

  const startPublish = (ruleId) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return
    setPublishing(ruleId)
    setPublishStage('draft')
    let idx = 0
    const advance = () => {
      idx++
      if (idx < STAGE_ORDER.length) {
        setPublishStage(STAGE_ORDER[idx])
        const t_ = setTimeout(advance, 1200)
        setPublishTimer(t_)
      } else {
        // Published!
        setRules(prev => prev.map(r => r.id === ruleId
          ? { ...r, aiStatus: 'active', approvalStage: 'published' } : r))
        setPublishing(null)
        setPublishStage(null)
      }
    }
    const t_ = setTimeout(advance, 1000)
    setPublishTimer(t_)
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Policy Engine', ar: 'محرك السياسات الرقمي' })}</h1>
          <p className="text-xs text-gray-400">{t({ en: 'Machine-readable safety policies running 24/7 against all monitored buildings', ar: 'سياسات سلامة قابلة للقراءة الآلية تعمل 24/7 ضد جميع المباني المراقبة' })}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0891B2] text-white text-sm font-semibold hover:bg-cyan-700 transition-colors">
          <Plus className="w-4 h-4" /> {t({ en: 'New Rule', ar: 'قاعدة جديدة' })}
        </button>
      </div>

      {/* Publishing animation */}
      {publishing && publishStage && (
        <div className="bg-white rounded-xl border-2 border-[#0891B2] shadow-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-4 h-4 text-[#0891B2] animate-spin" />
            <span className="font-semibold text-gray-900 text-sm">{t({ en: 'Publishing Rule — Approval Chain', ar: 'نشر القاعدة — سلسلة الموافقة' })}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {PUB_STAGES.map((st, i) => {
              const stageIdx = STAGE_ORDER.indexOf(publishStage)
              const thisIdx  = STAGE_ORDER.indexOf(st.id)
              const done     = thisIdx < stageIdx
              const active   = thisIdx === stageIdx
              return (
                <div key={st.id} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done   ? 'bg-green-500 text-white' :
                      active ? 'bg-[#0891B2] text-white animate-pulse' :
                               'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div className={`text-[9px] text-center mt-1 leading-tight ${active ? 'font-bold text-[#0891B2]' : 'text-gray-400'}`}>
                      {t(st.label)}
                    </div>
                  </div>
                  {i < PUB_STAGES.length - 1 && (
                    <div className={`h-0.5 w-5 flex-shrink-0 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rules table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  { en: 'Rule Name', ar: 'اسم القاعدة' },
                  { en: 'Domain', ar: 'المجال' },
                  { en: 'SBC Ref.', ar: 'مرجع SBC' },
                  { en: 'AI Status', ar: 'حالة الذكاء الاصطناعي' },
                  { en: 'Severity', ar: 'الخطورة' },
                  { en: 'Violations', ar: 'مخالفات' },
                  { en: 'Buildings', ar: 'مبانٍ' },
                  { en: 'Action', ar: 'إجراء' },
                ].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rules.map(rule => {
                const aiCfg = AI_STATUS[rule.aiStatus] ?? AI_STATUS.draft
                return (
                  <tr key={rule.id} className={`hover:bg-gray-50 transition-colors ${rule.approvalStage === 'draft' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{t(rule.name)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${DOMAIN_COLORS[rule.domain] ?? 'bg-gray-100 text-gray-700'}`}>
                        {rule.domain}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{rule.sbcRef}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${aiCfg.cls}`}>
                        {t(aiCfg.label)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge score={getSevScore(rule.severity)} showScore={false} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${rule.violations > 10 ? 'text-red-700' : rule.violations > 5 ? 'text-amber-700' : rule.violations > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                        {rule.violations}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rule.affectedBuildings}</td>
                    <td className="px-4 py-3">
                      {rule.approvalStage !== 'published' && !publishing && (
                        <button
                          onClick={() => startPublish(rule.id)}
                          className="px-3 py-1 bg-[#0891B2] text-white text-xs font-medium rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                          {t(rule.approvalStage === 'draft' ? { en: 'Submit for Review', ar: 'تقديم للمراجعة' } : { en: 'Publish', ar: 'نشر' })}
                        </button>
                      )}
                      {rule.approvalStage === 'published' && (
                        <span className="flex items-center gap-1 text-xs text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t({ en: 'Live', ar: 'مباشر' })}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Violation analytics summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: { en: 'Total Active Rules', ar: 'إجمالي القواعد النشطة' }, value: rules.filter(r => r.aiStatus === 'active').length },
          { label: { en: 'Total Violations', ar: 'إجمالي المخالفات' }, value: rules.reduce((s, r) => s + r.violations, 0), urgent: true },
          { label: { en: 'Buildings Affected', ar: 'مبانٍ متأثرة' }, value: Math.max(...rules.map(r => r.affectedBuildings)) },
          { label: { en: 'Life Safety Violations', ar: 'مخالفات السلامة الحياتية' }, value: rules.filter(r => r.severity === 'life-safety').reduce((s, r) => s + r.violations, 0), urgent: true },
        ].map((k, i) => (
          <div key={i} className={`kpi-tile ${k.urgent && k.value > 0 ? 'border-red-200 bg-red-50' : ''}`}>
            <span className="text-xs text-gray-500">{t(k.label)}</span>
            <span className={`text-2xl font-bold ${k.urgent && k.value > 0 ? 'text-red-700' : 'text-gray-900'}`}>{k.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
