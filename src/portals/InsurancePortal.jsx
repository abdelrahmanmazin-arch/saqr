import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'
import { formatSAR, formatNum, calcRecommendedPremium } from '../data/seed'
import RiskBadge from '../components/RiskBadge'
import StatusBadge from '../components/StatusBadge'
import Header from '../components/Header'
import {
  TrendingUp, TrendingDown, Minus, BarChart3, FileText,
  AlertTriangle, ChevronLeft, ChevronRight, Info, Download,
  ArrowUpRight, SlidersHorizontal, Bell
} from 'lucide-react'

export default function InsurancePortal() {
  const { lang, t, buildings, incidents, policies } = useApp()
  const [section, setSection] = useState('portfolio')
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [pricingScenario, setPricingScenario] = useState('recommended')
  const isRTL = lang === 'ar'

  const enrichedPolicies = policies.map(p => {
    const bld = buildings.find(b => b.id === p.buildingId)
    const recommended = calcRecommendedPremium(p.insuredValue, p.riskScore)
    const pricingGap = recommended - p.currentPremium
    return { ...p, building: bld, recommended, pricingGap }
  })

  const totalInsuredValue = enrichedPolicies.reduce((s, p) => s + p.insuredValue, 0)
  const totalPremiums = enrichedPolicies.reduce((s, p) => s + p.currentPremium, 0)
  const totalRecommended = enrichedPolicies.reduce((s, p) => s + p.recommended, 0)
  const avgRisk = Math.round(enrichedPolicies.reduce((s, p) => s + p.riskScore, 0) / enrichedPolicies.length)
  const highRiskCount = enrichedPolicies.filter(p => p.riskScore >= 70).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onNavClick={setSection} activeSection={section} />

      {/* Mobile nav */}
      <nav className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex">
          {[
            { id: 'portfolio', icon: BarChart3, label: ui.portfolio },
            { id: 'pricing', icon: SlidersHorizontal, label: ui.pricing },
            { id: 'loss', icon: AlertTriangle, label: ui.lossData },
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
                  section === item.id
                    ? 'text-[#0F1F3D] border-b-2 border-[#0F1F3D]'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t(item.label)}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* ─── Portfolio Overview ─────────────────── */}
        {section === 'portfolio' && (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-900">{t(ui.portfolio)}</h1>

            {/* KPI bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: ui.insuredValueLabel, value: formatSAR(totalInsuredValue), sub: null },
                { label: { en: 'Total Annual Premiums', ar: 'إجمالي الأقساط السنوية' }, value: formatSAR(totalPremiums), sub: { en: `Recommended: ${formatSAR(totalRecommended)}`, ar: `الموصى به: ${formatSAR(totalRecommended)}` } },
                { label: ui.portfolioRisk, value: avgRisk, isScore: true },
                { label: ui.highRiskPolicies, value: `${highRiskCount}/${enrichedPolicies.length}`, urgent: highRiskCount >= 2 },
              ].map((k, i) => (
                <div key={i} className={`kpi-tile ${k.urgent ? 'border-red-200' : ''}`}>
                  <span className="text-xs text-gray-500">{t(k.label)}</span>
                  {k.isScore ? (
                    <RiskBadge score={k.value} size="lg" />
                  ) : (
                    <>
                      <span className={`text-xl font-bold ltr-num ${k.urgent ? 'text-red-700' : 'text-gray-900'}`}>{k.value}</span>
                      {k.sub && <span className="text-[10px] text-gray-400">{t(k.sub)}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pricing gap alert */}
            {totalRecommended > totalPremiums && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 text-sm">
                    {t({ en: 'Portfolio Pricing Gap Detected', ar: 'تم اكتشاف فجوة تسعير في المحفظة' })}
                  </div>
                  <div className="text-xs text-amber-700 mt-0.5">
                    {t({ en: `Current premiums are ${formatSAR(totalRecommended - totalPremiums)} below recommended levels. ${highRiskCount} high-risk policies require review.`, ar: `الأقساط الحالية أقل بـ ${formatSAR(totalRecommended - totalPremiums)} من المستوى الموصى به. ${highRiskCount} بوالص عالية المخاطر تتطلب مراجعة.` })}
                  </div>
                </div>
              </div>
            )}

            {/* Policy table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {[
                        { en: 'Policy', ar: 'البوليصة' },
                        { en: 'Building', ar: 'المبنى' },
                        { en: 'Insured Value', ar: 'القيمة المؤمنة' },
                        { en: 'Current Premium', ar: 'القسط الحالي' },
                        { en: 'Recommended', ar: 'الموصى به' },
                        { en: 'Risk Score', ar: 'درجة المخاطر' },
                        { en: 'Loss Ratio', ar: 'نسبة الخسارة' },
                        { en: 'Trend', ar: 'الاتجاه' },
                      ].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enrichedPolicies.map(p => (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => { setSelectedPolicy(p); setSection('pricing') }}
                      >
                        <td className="px-4 py-3 text-xs font-mono text-gray-500">{p.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{p.building && t(p.building.name)}</div>
                          <div className="text-xs text-gray-400">{p.building?.sbcType}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 ltr-num">{formatSAR(p.insuredValue)}</td>
                        <td className="px-4 py-3 ltr-num text-gray-700">{formatSAR(p.currentPremium)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ltr-num ${p.pricingGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatSAR(p.recommended)}
                          </span>
                        </td>
                        <td className="px-4 py-3"><RiskBadge score={p.riskScore} /></td>
                        <td className="px-4 py-3">
                          {p.lossRatio > 0 ? (
                            <span className={`font-semibold ltr-num ${p.lossRatio > 50 ? 'text-red-600' : 'text-gray-700'}`}>
                              {p.lossRatio}%
                            </span>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {p.trend === 'up' ? <TrendingUp className="w-4 h-4 text-red-500" /> :
                           p.trend === 'down' ? <TrendingDown className="w-4 h-4 text-green-500" /> :
                           <Minus className="w-4 h-4 text-gray-400" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk distribution */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">{t({ en: 'Risk Distribution', ar: 'توزيع المخاطر' })}</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { band: 'low', label: { en: 'Low Risk', ar: 'مخاطر منخفضة' }, count: enrichedPolicies.filter(p => p.riskScore < 50).length, color: 'bg-green-100 border-green-200 text-green-900' },
                  { band: 'medium', label: { en: 'Medium Risk', ar: 'مخاطر متوسطة' }, count: enrichedPolicies.filter(p => p.riskScore >= 50 && p.riskScore < 70).length, color: 'bg-amber-100 border-amber-200 text-amber-900' },
                  { band: 'high', label: { en: 'High + Critical', ar: 'مرتفع + حرج' }, count: enrichedPolicies.filter(p => p.riskScore >= 70).length, color: 'bg-red-100 border-red-200 text-red-900' },
                ].map(d => (
                  <div key={d.band} className={`border rounded-xl p-4 text-center ${d.color}`}>
                    <div className="text-3xl font-bold">{d.count}</div>
                    <div className="text-sm font-medium mt-1">{t(d.label)}</div>
                    <div className="text-xs opacity-70 mt-0.5">{t({ en: 'policies', ar: 'بوالص' })}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Risk-Based Pricing ─────────────────── */}
        {section === 'pricing' && (
          <PricingSection
            policies={enrichedPolicies}
            selectedPolicy={selectedPolicy}
            setSelectedPolicy={setSelectedPolicy}
            scenario={pricingScenario}
            setScenario={setPricingScenario}
            t={t}
            lang={lang}
            isRTL={isRTL}
          />
        )}

        {/* ─── Loss Data ──────────────────────────── */}
        {section === 'loss' && (
          <LossDataSection incidents={incidents} buildings={buildings} policies={enrichedPolicies} t={t} lang={lang} />
        )}
      </div>
    </div>
  )
}

// ─── Pricing Section ───────────────────────────────────────────────────────────
function PricingSection({ policies, selectedPolicy, setSelectedPolicy, scenario, setScenario, t, lang, isRTL }) {
  const selected = selectedPolicy ?? policies[2] // default to highest risk

  const scenarios = {
    conservative:   { mult: 0.0015, label: { en: 'Conservative', ar: 'محافظ' }, color: 'border-blue-200 bg-blue-50' },
    recommended:    { mult: 0.0020, label: { en: 'Recommended', ar: 'موصى به' }, color: 'border-[#C5A028] bg-amber-50', badge: { en: 'Best Fit', ar: 'الأنسب' } },
    comprehensive:  { mult: 0.0030, label: { en: 'Comprehensive', ar: 'شامل' }, color: 'border-red-200 bg-red-50' },
  }

  const scenarioPremium = (s) =>
    Math.round(selected.insuredValue * scenarios[s].mult * (selected.riskScore / 50))

  const riskFactorLabels = {
    fireSuppression: { en: 'Fire Suppression System', ar: 'نظام الإطفاء' },
    electrical:      { en: 'Electrical Safety', ar: 'السلامة الكهربائية' },
    sensorCoverage:  { en: 'Sensor Coverage', ar: 'تغطية المستشعرات' },
    inspectionComp:  { en: 'Inspection Compliance', ar: 'الامتثال للفحوصات' },
    evacuation:      { en: 'Evacuation Infrastructure', ar: 'بنية الإخلاء' },
  }

  const weightLabels = {
    fireSuppression: '30%',
    electrical:      '25%',
    sensorCoverage:  '20%',
    inspectionComp:  '15%',
    evacuation:      '10%',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.pricing)}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Selector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">{t({ en: 'Select Policy', ar: 'اختر البوليصة' })}</h2>
          <div className="space-y-2">
            {policies.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPolicy(p)}
                className={`w-full text-start p-3 rounded-xl transition-all ${
                  selected.id === p.id
                    ? 'bg-[#0F1F3D] text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-xs font-mono mb-0.5">{p.id}</div>
                <div className="font-medium text-sm">{p.building && t(p.building.name)}</div>
                <div className={`text-xs mt-1 ${selected.id === p.id ? 'text-white/60' : 'text-gray-400'}`}>
                  {formatSAR(p.insuredValue)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main pricing view */}
        <div className="lg:col-span-2 space-y-5">
          {/* Policy header */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{selected.building && t(selected.building.name)}</h2>
                <p className="text-gray-500 text-sm">{selected.id}</p>
              </div>
              <RiskBadge score={selected.riskScore} size="lg" />
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: ui.insuredValueLabel, value: formatSAR(selected.insuredValue) },
                { label: ui.annualPremium, value: formatSAR(selected.currentPremium) },
                { label: ui.recommendedPremium, value: formatSAR(selected.recommended), highlight: true },
                { label: ui.pricingGap, value: selected.pricingGap > 0 ? `+${formatSAR(selected.pricingGap)}` : formatSAR(selected.pricingGap), urgent: selected.pricingGap > 0 },
                { label: ui.lossRatio, value: selected.lossRatio > 0 ? `${selected.lossRatio}%` : '—', urgent: selected.lossRatio > 50 },
                { label: { en: 'Trend', ar: 'الاتجاه' }, value: selected.trend === 'up' ? '↑' : selected.trend === 'down' ? '↓' : '→', urgent: selected.trend === 'up' },
              ].map((k, i) => (
                <div key={i} className={`p-3 rounded-xl border ${k.urgent ? 'border-red-200 bg-red-50' : k.highlight ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="text-xs text-gray-500 mb-1">{t(k.label)}</div>
                  <div className={`font-bold ltr-num text-sm ${k.urgent ? 'text-red-700' : k.highlight ? 'text-amber-700' : 'text-gray-900'}`}>
                    {k.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Scenarios */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">{t({ en: 'Pricing Scenarios', ar: 'سيناريوهات التسعير' })}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(scenarios).map(([key, sc]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  className={`p-4 rounded-xl border-2 text-start transition-all ${
                    scenario === key ? sc.color : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900">{t(sc.label)}</span>
                    {sc.badge && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#C5A028] text-white rounded">{t(sc.badge)}</span>}
                  </div>
                  <div className="text-xl font-bold text-gray-900 ltr-num">{formatSAR(scenarioPremium(key))}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{(sc.mult * 100).toFixed(2)}% rate</div>
                </button>
              ))}
            </div>
          </div>

          {/* Risk factor breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">{t({ en: 'Risk Factor Breakdown (5-Factor Model)', ar: 'تفاصيل عوامل المخاطر (نموذج 5 عوامل)' })}</h3>
            <div className="space-y-3">
              {Object.entries(selected.riskFactors).map(([key, rf]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{t(riskFactorLabels[key])}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{t({ en: 'Weight', ar: 'الوزن' })}: {weightLabels[key]}</span>
                      <span className="font-bold font-mono">{rf.score}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rf.score >= 80 ? 'bg-red-500' : rf.score >= 60 ? 'bg-amber-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${rf.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Loss Data Section ─────────────────────────────────────────────────────────
function LossDataSection({ incidents, buildings, policies, t, lang }) {
  const relevantIncidents = incidents.filter(inc =>
    policies.some(p => p.buildingId === inc.buildingId)
  )

  const aiAnalysis = {
    'INC-2024-002': { en: 'Electrical arc flash caused by outdated MCCB in Distribution Panel DP-34A. Panel age: 22 years. Probable cause: thermal stress from sustained overload. Risk factor: Electrical Safety scored 88 — contributing 25% of policy premium. Recommendation: mandatory distribution panel upgrade across all Group R buildings above 60 floors.', ar: 'ومضة قوس كهربائي ناجمة عن MCCB قديم في لوحة التوزيع DP-34A. عمر اللوحة: 22 عاماً. السبب المحتمل: إجهاد حراري من الحمل الزائد المستمر. عامل المخاطر: درجة السلامة الكهربائية 88 — تساهم بـ 25% من قسط البوليصة. التوصية: ترقية إلزامية للوحات التوزيع في جميع مباني المجموعة R فوق 60 طابقاً.' },
    'INC-2024-005': { en: 'Simultaneous vendor contract lapse and sprinkler pressure failure at 2AM Friday — statistically highest-risk time window for Group S-1/H-3 facilities. XGBoost escalation prediction applied maximum temporal penalty. MDRE score: 31→96 in 4 seconds. Resolved in 2.5 hours via automated dispatch. Recommendation: vendor contract auto-renewal mandate.', ar: 'انتهاء متزامن لعقد المورد وانخفاض ضغط الرشاشات في الساعة 2 صباحاً يوم الجمعة — أعلى نافذة مخاطر إحصائياً لمنشآت S-1/H-3. نموذج XGBoost طبّق أقصى عقوبة زمنية. درجة MDRE: 31→96 في 4 ثوان. تم الحل في 2.5 ساعة عبر الإرسال الآلي. التوصية: تفويض التجديد التلقائي لعقود الموردين.' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t(ui.lossData)}</h1>

      {/* Loss summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: { en: 'Total Incidents', ar: 'إجمالي الحوادث' }, value: relevantIncidents.length },
          { label: { en: 'Est. Total Loss', ar: 'إجمالي الخسارة المقدرة' }, value: formatSAR(relevantIncidents.reduce((s, i) => s + (i.estimatedLoss || 0), 0)) },
          { label: { en: 'Confirmed Loss', ar: 'الخسارة المؤكدة' }, value: formatSAR(relevantIncidents.reduce((s, i) => s + (i.confirmedLoss || 0), 0)) },
          { label: { en: 'Settled', ar: 'تم التسوية' }, value: relevantIncidents.filter(i => i.status === 'settled').length },
        ].map((k, i) => (
          <div key={i} className="kpi-tile">
            <span className="text-xs text-gray-500">{t(k.label)}</span>
            <span className="text-xl font-bold text-gray-900 ltr-num">{k.value}</span>
          </div>
        ))}
      </div>

      {/* Incident Register */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t({ en: 'Incident Register', ar: 'سجل الحوادث' })}</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {relevantIncidents.map(inc => {
            const bld = buildings.find(b => b.id === inc.buildingId)
            const hasAI = !!aiAnalysis[inc.id]
            return (
              <IncidentRow
                key={inc.id}
                incident={inc}
                building={bld}
                aiAnalysis={aiAnalysis[inc.id]}
                t={t}
                lang={lang}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function IncidentRow({ incident: inc, building: bld, aiAnalysis, t, lang }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-gray-400">{inc.id}</span>
            <span className="font-semibold text-sm text-gray-900">{t(inc.type)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{bld && t(bld.name)} · {inc.date}</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {inc.estimatedLoss > 0 && (
            <span className="font-semibold text-sm text-red-700 ltr-num">{formatSAR(inc.estimatedLoss)}</span>
          )}
          <StatusBadge status={inc.status} />
          {aiAnalysis && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              AI {expanded ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">{t(inc.description)}</p>

      {expanded && aiAnalysis && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="text-xs font-semibold text-amber-800 mb-2">{t({ en: 'AI Incident Analysis', ar: 'تحليل الحادث بالذكاء الاصطناعي' })}</div>
          <p className="text-xs text-amber-900 leading-relaxed">{t(aiAnalysis)}</p>
        </div>
      )}
    </div>
  )
}
