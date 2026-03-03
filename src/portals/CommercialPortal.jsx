import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'
import { getRiskBand, getRiskColor, formatSAR, formatNum, daysUntil, calcRecommendedPremium } from '../data/seed'
import RiskBadge from '../components/RiskBadge'
import StatusBadge from '../components/StatusBadge'
import Header from '../components/Header'
import {
  Building2, Bell, ShoppingBag, FileText, LayoutDashboard,
  AlertTriangle, Wifi, WifiOff, CheckCircle2, Clock, ChevronRight,
  ChevronLeft, RefreshCcw, Package, Zap, TrendingUp, Eye,
  FileBarChart2, Download, Search, SlidersHorizontal, ArrowUpRight,
  ArrowDownRight, Minus, X, Info
} from 'lucide-react'

export default function CommercialPortal() {
  const { lang, t, buildings, incidents, products, simulateRiskEvent, resetRiskEvent, simulatingEvent, riskEventActive } = useApp()
  const [section, setSection] = useState('dashboard')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'map'
  const isRTL = lang === 'ar'

  const totalAlerts = buildings.reduce((s, b) => s + b.activeAlerts, 0)
  const expiringSoon = buildings.filter(b => {
    const d = daysUntil(b.licenseExpiry)
    return d > 0 && d <= 90
  }).length
  const avgRisk = Math.round(buildings.reduce((s, b) => s + b.riskScore, 0) / buildings.length)

  const criticalOrImmediate = buildings.filter(b => {
    // Treat very high scores, SLA-active, or expired licenses as requiring immediate action
    const isCriticalScore = b.riskScore >= 85
    const hasSlaBreach = b.status === 'sla-active'
    const isExpired = b.licenseStatus === 'expired' || b.status === 'license-expired'
    return isCriticalScore || hasSlaBreach || isExpired
  }).length

const filteredBuildings = buildings.filter(b =>
    t(b.name).toLowerCase().includes(searchQ.toLowerCase()) ||
    b.sbcType.toLowerCase().includes(searchQ.toLowerCase())
  )

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: ui.dashboard },
    { id: 'buildings', icon: Building2, label: ui.buildings },
    { id: 'alerts', icon: Bell, label: ui.alerts },
    { id: 'marketplace', icon: ShoppingBag, label: ui.marketplace },
    { id: 'reports', icon: FileText, label: ui.reports },
  ]

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col text-[#F9FAFB]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onNavClick={setSection} activeSection={section} />

      {/* Mobile nav */}
      <nav className="lg:hidden bg-[#111827] border-b border-[#2D3748] overflow-x-auto">
        <div className="flex">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
                  section === item.id
                    ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]'
                    : 'text-[#9CA3AF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t(item.label)}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Simulate risk event banner */}
      {riskEventActive && (
        <div className="bg-[#111827] border-b border-[#7F1D1D] px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[#F9FAFB]">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#F97373] animate-pulse" />
            <span className="font-medium">
              {t({
                en: 'CRITICAL ALERT: Al Jubail Industrial — Sprinkler pressure drop detected. Risk score: 96/100. SLA: 4 hours',
                ar: 'تنبيه حرج: منشأة الجبيل الصناعية — انخفاض ضغط نظام الرشاشات. درجة المخاطر: 96/100. مهلة SLA: 4 ساعات',
              })}
            </span>
          </div>
          <button onClick={resetRiskEvent} className="flex-shrink-0 text-[#9CA3AF] hover:text-[#F9FAFB]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ─── Dashboard ─────────────────────────── */}
        {section === 'dashboard' && (
          <div className="space-y-6">
            {/* Risk posture banner — control room style */}
            <div className="bg-[#111827] border border-[#2D3748] rounded-2xl px-5 py-4 flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#9CA3AF]">
                  <span className="h-3 w-1.5 bg-[#C9A84C] rounded-sm" />
                  <span>{t({ en: 'Portfolio Risk Posture', ar: 'مستوى مخاطر المحفظة' })}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-mono font-semibold text-[#C9A84C]">
                    {avgRisk}
                    <span className="text-sm text-[#9CA3AF] ml-1">/100</span>
                  </div>
                  <div className="text-sm text-[#9CA3AF]">
                    {criticalOrImmediate > 0
                      ? t({
                          en: `Risk Level Elevated — ${criticalOrImmediate} facilities require immediate action.`,
                          ar: `مستوى المخاطر مرتفع — ${criticalOrImmediate} منشآت تحتاج إجراءً فورياً.`,
                        })
                      : t({
                          en: 'Risk Level Stable — All facilities within acceptable thresholds.',
                          ar: 'مستوى المخاطر مستقر — جميع المنشآت ضمن الحدود المقبولة.',
                        })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={riskEventActive ? resetRiskEvent : simulateRiskEvent}
                  disabled={simulatingEvent}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-[#C9A84C]/60 ${
                    riskEventActive
                      ? 'text-[#C9A84C] bg-transparent hover:bg-[#1F2937]'
                      : 'text-[#0A0E1A] bg-[#C9A84C] hover:bg-[#B18E3D]'
                  } ${simulatingEvent ? 'opacity-60 cursor-wait' : ''}`}
                >
                  {simulatingEvent ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {t(
                    riskEventActive
                      ? { en: 'Reset Risk Simulation', ar: 'إعادة تعيين المحاكاة' }
                      : { en: 'Simulate Risk Change', ar: 'محاكاة تغيير المخاطر' }
                  )}
                </button>
                <p className="text-[11px] text-[#6B7280] max-w-xs text-right">
                  {t({
                    en: 'Demo mode: simulates a sprinkler pressure drop event on Al Jubail Industrial Facility.',
                    ar: 'وضع العرض: يحاكي حدث انخفاض ضغط نظام الإطفاء في منشأة الجبيل الصناعية.',
                  })}
                </p>
              </div>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: { en: 'Total Buildings', ar: 'إجمالي المباني' }, value: buildings.length, icon: Building2 },
                { label: { en: 'Active Alerts', ar: 'التنبيهات النشطة' }, value: totalAlerts, icon: Bell },
                { label: { en: 'Licenses Expiring (90d)', ar: 'تراخيص تنتهي (90 يوم)' }, value: expiringSoon, icon: Clock },
                { label: { en: 'Portfolio Risk Avg', ar: 'متوسط مخاطر المحفظة' }, value: avgRisk, icon: TrendingUp, isScore: true },
              ].map((kpi, i) => {
                const Icon = kpi.icon
                return (
                  <div
                    key={i}
                    className="kpi-tile bg-[#111827] border-[#2D3748] rounded-xl flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#9CA3AF]">{t(kpi.label)}</span>
                      <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center border border-[#2D3748]">
                        <Icon className="w-4 h-4 text-[#C9A84C]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      {kpi.isScore ? (
                        <RiskBadge score={kpi.value} size="lg" />
                      ) : (
                        <span className="text-2xl font-mono font-semibold text-[#F9FAFB]">{kpi.value}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Building cards + map toggle */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-[#F9FAFB]">
                    {t({ en: 'Building Portfolio', ar: 'محفظة المباني' })}
                  </h2>
                  <div className="inline-flex items-center rounded-full border border-[#2D3748] bg-[#111827] text-xs">
                    {['grid', 'map'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1 rounded-full ${
                          viewMode === mode ? 'bg-[#1F2937] text-[#C9A84C]' : 'text-[#9CA3AF]'
                        }`}
                      >
                        {mode === 'grid'
                          ? t({ en: 'Grid View', ar: 'عرض الشبكة' })
                          : t({ en: 'Map View', ar: 'عرض الخريطة' })}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSection('buildings')}
                  className="text-[#C9A84C] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  {t({ en: 'View all', ar: 'عرض الكل' })}
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {buildings.slice(0, 6).map(b => (
                    <BuildingCard
                      key={b.id}
                      building={b}
                      onSelect={() => {
                        setSelectedBuilding(b)
                        setSection('buildings')
                      }}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              ) : (
                <PortfolioMap buildings={buildings} t={t} lang={lang} onSelectBuilding={b => {
                  setSelectedBuilding(b)
                  setSection('buildings')
                }} />
              )}
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="font-semibold text-[#F9FAFB] mb-3">
                {t({ en: 'Quick Actions', ar: 'الإجراءات السريعة' })}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Eye, label: ui.requestInspection },
                  { icon: FileBarChart2, label: ui.submitMaintenance },
                  { icon: ShoppingBag, label: ui.viewMarketplace, action: () => setSection('marketplace') },
                  { icon: Bell, label: ui.contactSupport },
                ].map((qa, i) => {
                  const Icon = qa.icon
                  return (
                    <button
                      key={i}
                      onClick={qa.action}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#111827] border border-[#2D3748] hover:bg-[#1F2937] transition-colors"
                    >
                      <Icon className="w-5 h-5 text-[#C9A84C]" />
                      <span className="text-xs font-medium text-center text-[#F9FAFB]">
                        {t(qa.label)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── Buildings list ─────────────────────── */}
        {section === 'buildings' && !selectedBuilding && (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-[#F9FAFB]">{t(ui.buildings)}</h1>
              <div className="relative">
                <Search className="w-4 h-4 absolute top-2.5 start-3 text-[#6B7280] pointer-events-none" />
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder={t(ui.search)}
                  className="ps-9 pe-4 py-2 border border-[#2D3748] rounded-xl text-sm bg-[#111827] text-[#F9FAFB] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 w-64"
                />
              </div>
            </div>

            <div className="bg-[#111827] rounded-xl border border-[#2D3748] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#111827] border-b border-[#2D3748]">
                    <tr>
                      {[
                        { en: 'Building', ar: 'المبنى' },
                        { en: 'SBC Type', ar: 'نوع SBC' },
                        { en: 'Risk Score', ar: 'درجة المخاطر' },
                        { en: 'Alerts', ar: 'التنبيهات' },
                        { en: 'License', ar: 'الترخيص' },
                        { en: 'Sensors', ar: 'المستشعرات' },
                        { en: 'Action', ar: 'الإجراء' },
                      ].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                          {t(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2937]">
                    {filteredBuildings.map(b => (
                      <tr key={b.id} className="hover:bg-[#1F2937] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#F9FAFB]">{t(b.name)}</div>
                          <div className="text-xs text-[#9CA3AF]">{t(b.region)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded border border-[#2D3748] text-xs font-mono text-[#F9FAFB]">
                            {b.sbcType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <RiskBadge score={b.riskScore} />
                        </td>
                        <td className="px-4 py-3">
                          {b.activeAlerts > 0 ? (
                            <span className="font-semibold text-[#F97373]">{b.activeAlerts}</span>
                          ) : (
                            <span className="text-[#6B7280]">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.licenseStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <SensorBar sensors={b.sensors} />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedBuilding(b)}
                            className="text-[#C9A84C] font-medium text-xs hover:underline flex items-center gap-1"
                          >
                            {t(ui.viewDetails)}
                            {isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── Building Detail ────────────────────── */}
        {section === 'buildings' && selectedBuilding && (
          <BuildingDetail
            building={selectedBuilding}
            onBack={() => setSelectedBuilding(null)}
            incidents={incidents}
            t={t}
            lang={lang}
            isRTL={isRTL}
          />
        )}

        {/* ─── Alerts ─────────────────────────────── */}
        {section === 'alerts' && (
          <AlertsSection buildings={buildings} incidents={incidents} t={t} lang={lang} />
        )}

        {/* ─── Marketplace ────────────────────────── */}
        {section === 'marketplace' && (
          <MarketplaceSection products={products} t={t} lang={lang} />
        )}

        {/* ─── Reports ────────────────────────────── */}
        {section === 'reports' && (
          <ReportsSection buildings={buildings} t={t} lang={lang} />
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PortfolioMap({ buildings, t, lang, onSelectBuilding }) {
  const isRTL = lang === 'ar'

  return (
    <div className="bg-[#111827] border border-[#2D3748] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F9FAFB]">
            {t({ en: 'Riyadh Portfolio Map (Demo)', ar: 'خريطة محفظة الرياض (عرض توضيحي)' })}
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            {t({
              en: 'Stylized view — click a marker to open building detail.',
              ar: 'عرض مبسّط — انقر على العلامة لفتح تفاصيل المنشأة.',
            })}
          </p>
        </div>
      </div>
      <div className="relative w-full aspect-[16/9] bg-[#020617] rounded-xl overflow-hidden border border-[#1F2937]">
        {/* Simple stylized city blocks */}
        <svg viewBox="0 0 100 60" className="w-full h-full text-[#1F2937]">
          <rect x="5" y="10" width="30" height="16" fill="#0B1120" stroke="#1F2937" strokeWidth="0.5" />
          <rect x="40" y="5" width="25" height="18" fill="#0B1120" stroke="#1F2937" strokeWidth="0.5" />
          <rect x="70" y="12" width="22" height="15" fill="#0B1120" stroke="#1F2937" strokeWidth="0.5" />
          <rect x="10" y="32" width="24" height="18" fill="#020617" stroke="#1F2937" strokeWidth="0.5" />
          <rect x="42" y="32" width="28" height="20" fill="#020617" stroke="#1F2937" strokeWidth="0.5" />
          <rect x="75" y="34" width="18" height="18" fill="#020617" stroke="#1F2937" strokeWidth="0.5" />
        </svg>
        {/* Building markers */}
        {buildings.map((b, idx) => {
          const positions = [
            { left: '18%', top: '18%' },
            { left: '52%', top: '14%' },
            { left: '80%', top: '22%' },
            { left: '16%', top: '48%' },
            { left: '56%', top: '50%' },
            { left: '82%', top: '50%' },
          ]
          const pos = positions[idx % positions.length]
          const band = getRiskBand(b.riskScore)
          const borderColor =
            band === 'critical'
              ? '#EF4444'
              : band === 'high'
              ? '#F97316'
              : band === 'medium'
              ? '#FBBF24'
              : '#10B981'
          return (
            <button
              key={b.id}
              type="button"
              className="absolute w-3 h-3 -mt-1.5 -ml-1.5 rounded-sm bg-[#020617]"
              style={{
                left: pos.left,
                top: pos.top,
                border: `1.5px solid ${borderColor}`,
              }}
              onClick={() => onSelectBuilding(b)}
            >
              <span className="sr-only">{t(b.name)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BuildingCard({ building: b, onSelect, lang, t }) {
  const pct = (b.sensors.normal / b.sensors.total) * 100
  const d = daysUntil(b.licenseExpiry)
  const isRTL = lang === 'ar'
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div
      className="portal-card bg-[#111827] border-[#2D3748] cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#F9FAFB] text-sm">{t(b.name)}</h3>
          <p className="text-xs text-[#9CA3AF]">
            {b.sbcType} · {b.floors} {t(ui.floors)} · {formatNum(b.areaSqm)} m²
          </p>
        </div>
        <RiskBadge score={b.riskScore} />
      </div>

      {/* Sensor bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#9CA3AF]">{t(ui.sensors)}</span>
          <span className="text-xs text-[#9CA3AF]">
            {b.sensors.normal}/{b.sensors.total}
          </span>
        </div>
        <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden flex gap-0.5">
          <div
            className="bg-[#10B981]"
            style={{ width: `${(b.sensors.normal / b.sensors.total) * 100}%` }}
          />
          <div
            className="bg-[#FBBF24]"
            style={{ width: `${(b.sensors.warning / b.sensors.total) * 100}%` }}
          />
          <div
            className="bg-[#EF4444]"
            style={{ width: `${(b.sensors.critical / b.sensors.total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={b.licenseStatus} />
          {b.activeAlerts > 0 && (
            <span className="flex items-center gap-1 text-xs text-[#F97373] font-medium">
              <AlertTriangle className="w-3 h-3" />
              {b.activeAlerts}
            </span>
          )}
        </div>
        <span className="text-xs text-[#9CA3AF]">
          {t({ en: `${d}d to renewal`, ar: `${d} يوم للتجديد` })}
        </span>
      </div>
    </div>
  )
}

function SensorBar({ sensors }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-2 w-20 rounded-full overflow-hidden bg-[#1F2937]">
        <div
          className="bg-[#10B981]"
          style={{ width: `${(sensors.normal / sensors.total) * 100}%` }}
        />
        <div
          className="bg-[#FBBF24]"
          style={{ width: `${(sensors.warning / sensors.total) * 100}%` }}
        />
        <div
          className="bg-[#EF4444]"
          style={{ width: `${(sensors.critical / sensors.total) * 100}%` }}
        />
      </div>
      <span className="text-xs text-[#9CA3AF]">{sensors.total}</span>
    </div>
  )
}

function BuildingDetail({ building: b, onBack, incidents, t, lang, isRTL }) {
  const buildingIncidents = incidents.filter(i => i.buildingId === b.id)
  const ArrowIcon = isRTL ? ChevronRight : ChevronLeft
  const likelihoodIndex = Math.min(4, Math.max(0, Math.floor(b.riskScore / 20)))
  const severityIndex = Math.min(4, Math.max(0, (b.baseSeverity ?? 3) - 1))

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[#C9A84C] text-sm font-medium hover:underline"
      >
        <ArrowIcon className="w-4 h-4" />
        {t(ui.buildings)}
      </button>

      {/* Header */}
      <div className="bg-[#111827] rounded-2xl border border-[#2D3748] shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F9FAFB]">{t(b.name)}</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">
              {t(b.region)} · {b.sbcType} · {b.floors} {t(ui.floors)} · {formatNum(b.areaSqm)} m²
            </p>
            <p className="text-[#6B7280] text-xs mt-1">{b.licenseNo}</p>
          </div>
          <RiskBadge score={b.riskScore} size="lg" />
        </div>

        {/* Risk factor bars */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">
              {t({ en: 'Top Risk Drivers', ar: 'أبرز محركات المخاطر' })}
            </h3>
            {[
              { label: { en: 'Fire Suppression', ar: 'نظام الإطفاء' }, pct: 72 },
              { label: { en: 'Sensor Coverage', ar: 'تغطية المستشعرات' }, pct: Math.round((b.sensors.normal / b.sensors.total) * 100) },
              { label: { en: 'Inspection Compliance', ar: 'الامتثال للفحوصات' }, pct: b.licenseStatus === 'active' ? 85 : 30 },
            ].map((r, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                  <span>{t(r.label)}</span>
                  <span className="font-mono">{r.pct}%</span>
                </div>
                <div className="h-2 bg-[#1F2937] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      r.pct >= 80 ? 'bg-[#10B981]' : r.pct >= 60 ? 'bg-[#FBBF24]' : 'bg-[#EF4444]'
                    }`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#0B1120] rounded-xl p-4 border border-[#2D3748]">
            <h3 className="text-xs font-semibold text-[#F9FAFB] mb-3">
              {t({ en: 'License Info', ar: 'معلومات الترخيص' })}
            </h3>
            <div className="space-y-2 text-xs text-[#9CA3AF]">
              <div className="flex justify-between">
                <span>{t(ui.license)}</span>
                <StatusBadge status={b.licenseStatus} />
              </div>
              <div className="flex justify-between">
                <span>{t({ en: 'Expiry', ar: 'الانتهاء' })}</span>
                <span className="font-medium text-[#F9FAFB]">{b.licenseExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span>{t(ui.vendor)}</span>
                <span className="font-medium text-[#F9FAFB] text-end">{t(b.vendor)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t({ en: 'Last Inspection', ar: 'آخر فحص' })}</span>
                <span className="font-medium text-[#F9FAFB]">{b.lastInspection}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MDRE Risk Engine panel */}
        <div className="mt-6 border-t border-[#2D3748] pt-5">
          <button
            type="button"
            className="w-full flex items-center justify-between text-xs font-medium text-[#F9FAFB] py-2"
          >
            <span>
              {t({
                en: 'Dynamic Risk Engine — How your score is calculated',
                ar: 'محرك المخاطر الديناميكي — كيف تُحسب درجتك',
              })}
            </span>
            <ChevronRight className={`w-4 h-4 text-[#9CA3AF] ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2 text-xs">
              {[
                {
                  id: 1,
                  title: {
                    en: 'Layer 1 — Structural Profile',
                    ar: 'الطبقة 1 — البيانات الهيكلية',
                  },
                  desc: {
                    en: 'Occupancy type, building age, structural materials — static characteristics.',
                    ar: 'نوع الإشغال، عمر المبنى، المواد الإنشائية — السمات الثابتة.',
                  },
                  dir: '→',
                },
                {
                  id: 2,
                  title: {
                    en: 'Layer 2 — Administrative Compliance',
                    ar: 'الطبقة 2 — الامتثال الإداري',
                  },
                  desc: {
                    en: 'CR status, municipal violation history, operational track record.',
                    ar: 'حالة السجل التجاري، سجل المخالفات البلدية، التاريخ التشغيلي.',
                  },
                  dir: '→',
                },
                {
                  id: 3,
                  title: {
                    en: 'Layer 3 — Spatial Factors',
                    ar: 'الطبقة 3 — العوامل المكانية',
                  },
                  desc: {
                    en: 'Distance to nearest CD station, urban density, proximity to hazardous facilities.',
                    ar: 'المسافة من أقرب محطة دفاع مدني، الكثافة الحضرية، القرب من منشآت خطرة.',
                  },
                  dir: '→',
                },
                {
                  id: 4,
                  title: {
                    en: 'Layer 4 — Temporal & Escalation Factors',
                    ar: 'الطبقة 4 — العوامل الزمنية والتصعيدية',
                  },
                  desc: {
                    en: 'Time of day, weekday/weekend, seasonal patterns, high-risk periods.',
                    ar: 'وقت اليوم، اليوم من الأسبوع، المواسم، الفترات ذات المخاطر العالية.',
                  },
                  dir: '→',
                },
                {
                  id: 5,
                  title: {
                    en: 'Layer 5 — Real-Time Telemetry',
                    ar: 'الطبقة 5 — البيانات الفورية',
                  },
                  desc: {
                    en: 'Live sensor readings, weather conditions, government API updates.',
                    ar: 'قراءات المستشعرات الحية، حالة الطقس، تحديثات واجهات برمجة التطبيقات الحكومية.',
                  },
                  dir: '↑',
                },
              ].map(layer => (
                <div
                  key={layer.id}
                  className="flex gap-3 border-l border-[#2D3748] ps-3"
                  style={isRTL ? { borderLeft: 'none', borderRight: '1px solid #2D3748', paddingLeft: 0, paddingRight: '0.75rem' } : {}}
                >
                  <div className="mt-0.5 text-[#C9A84C] text-xs font-mono">{layer.dir}</div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#F9FAFB]">
                      {t(layer.title)}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF]">{t(layer.desc)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="text-xs text-[#9CA3AF]">
                {t({
                  en: 'Risk Matrix — current position',
                  ar: 'مصفوفة المخاطر — موقع المنشأة الحالي',
                })}
              </div>
              <div className="relative w-full aspect-[5/5] max-w-xs bg-[#020617] border border-[#2D3748] rounded-md p-2">
                <div className="grid grid-cols-5 grid-rows-5 gap-1 h-full">
                  {Array.from({ length: 25 }).map((_, idx) => {
                    const row = Math.floor(idx / 5)
                    const col = idx % 5
                    const shade = 20 + row * 12 + col * 4
                    const bg = `rgb(${15 + shade}, ${23 + shade}, ${42 + shade})`
                    return (
                      <div
                        key={idx}
                        style={{ backgroundColor: bg }}
                        className="rounded-[2px]"
                      />
                    )
                  })}
                </div>
                {/* Gold dot for this building */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-[#C9A84C] shadow-sm"
                  style={{
                    left: `calc(${(likelihoodIndex / 4) * 100}% - 0.25rem)`,
                    bottom: `calc(${(severityIndex / 4) * 100}% - 0.25rem)`,
                  }}
                />
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {t({
                  en: 'Likelihood (X axis) and Severity (Y axis) update automatically when MDRE layers detect new signals.',
                  ar: 'احتمالية الحدوث (المحور الأفقي) وشدة الأثر (المحور الرأسي) تتحدّث تلقائياً عند اكتشاف إشارات جديدة من طبقات محرك المخاطر.',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-100">
          {[
            { label: ui.requestInspection, primary: true },
            { label: ui.submitMaintenance },
            { label: ui.downloadReport },
          ].map((a, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                a.primary
                  ? 'bg-[#1B4F72] text-white hover:bg-[#164060]'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t(a.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Sensors grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t({ en: 'Sensor Network', ar: 'شبكة المستشعرات' })}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: { en: 'Total', ar: 'الإجمالي' }, value: b.sensors.total, color: 'text-gray-800' },
            { label: { en: 'Normal', ar: 'طبيعي' }, value: b.sensors.normal, color: 'text-green-700' },
            { label: { en: 'Warning', ar: 'تحذير' }, value: b.sensors.warning, color: 'text-amber-700' },
            { label: { en: 'Critical', ar: 'حرج' }, value: b.sensors.critical, color: 'text-red-700' },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{t(s.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident history */}
      {buildingIncidents.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t(ui.inspectionHistory)}</h2>
          <div className="space-y-3">
            {buildingIncidents.map(inc => (
              <div key={inc.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  inc.severity === 'critical' ? 'text-red-600' :
                  inc.severity === 'high' ? 'text-orange-500' : 'text-amber-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-gray-900">{t(inc.type)}</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{t(inc.description)}</p>
                  <p className="text-xs text-gray-400 mt-1">{inc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AlertsSection({ buildings, incidents, t, lang }) {
  const allAlerts = incidents.map(inc => {
    const bld = buildings.find(b => b.id === inc.buildingId)
    return { ...inc, building: bld }
  }).sort((a, b) => {
    const sev = { critical: 0, high: 1, medium: 2, low: 3 }
    return sev[a.severity] - sev[b.severity]
  })

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#F9FAFB]">{t(ui.alerts)}</h1>
      <div className="space-y-3">
        {allAlerts.map(alert => (
          <div
            key={alert.id}
            className="bg-[#111827] rounded-xl border border-[#2D3748] shadow-sm p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-0.5 h-8 mt-1 flex-shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-[#EF4444]'
                      : alert.severity === 'high'
                      ? 'bg-[#F97316]'
                      : alert.severity === 'medium'
                      ? 'bg-[#FBBF24]'
                      : 'bg-[#4B5563]'
                  }`}
                />
                <div>
                  <div className="font-semibold text-sm text-[#F9FAFB]">
                    {t(alert.type)}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {alert.building && t(alert.building.name)} · {alert.date}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {t(alert.description)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge
                  score={
                    alert.severity === 'critical'
                      ? 90
                      : alert.severity === 'high'
                      ? 75
                      : alert.severity === 'medium'
                      ? 60
                      : 40
                  }
                  showScore={false}
                />
                <StatusBadge status={alert.status} />
              </div>
            </div>
            {alert.status !== 'resolved' && alert.status !== 'settled' && (
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 bg-[#C9A84C] text-[#0A0E1A] text-xs font-medium rounded-lg hover:bg-[#B18E3D] transition-colors">
                  {t(ui.requestInspection)}
                </button>
                <button className="px-3 py-1.5 border border-[#2D3748] text-[#F9FAFB] text-xs font-medium rounded-lg hover:bg-[#1F2937] transition-colors">
                  {t(ui.submitMaintenance)}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketplaceSection({ products, t, lang }) {
  const badgeColors = {
    OFFICIAL:  'bg-[#1B4F72] text-white',
    CERTIFIED: 'bg-green-700 text-white',
    NEW:       'bg-purple-600 text-white',
    AI:        'bg-[#C5A028] text-white',
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#F9FAFB]">{t(ui.marketplace)}</h1>
        <p className="text-[#9CA3AF] text-sm">
          {t({
            en: 'Safety products and services from Madani Tech',
            ar: 'منتجات وخدمات السلامة من مدني تك',
          })}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map(p => (
          <div key={p.id} className="portal-card bg-[#111827] border-[#2D3748] flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#F9FAFB] text-sm">{t(p.name)}</h3>
                <p className="text-xs text-[#9CA3AF]">{t(p.category)}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  badgeColors[p.badge] ?? 'bg-[#1F2937] text-[#F9FAFB]'
                }`}
              >
                {p.badge}
              </span>
            </div>
            <ul className="space-y-1.5 flex-1 mb-4">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#9CA3AF]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  {t(f)}
                </li>
              ))}
            </ul>
            <div className="border-t border-[#2D3748] pt-3 flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">{t(p.pricing)}</span>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  p.installed
                    ? 'border border-[#10B981] text-[#10B981]'
                    : 'bg-[#C9A84C] text-[#0A0E1A] hover:bg-[#B18E3D]'
                }`}
              >
                {p.installed
                  ? t({ en: 'Installed', ar: 'مثبّت' })
                  : p.badge === 'CERTIFIED' && p.id !== 'PRD-002'
                  ? t(ui.requestQuote)
                  : t(ui.subscribe)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsSection({ buildings, t }) {
  const reports = [
    { icon: FileBarChart2, title: { en: 'Safety Compliance Report', ar: 'تقرير الامتثال للسلامة' }, desc: { en: 'Full compliance status across all buildings', ar: 'حالة الامتثال الكاملة لجميع المباني' }, format: 'PDF · Excel' },
    { icon: TrendingUp, title: { en: 'Risk History Report', ar: 'تقرير سجل المخاطر' }, desc: { en: 'Risk score trends over the past 12 months', ar: 'اتجاهات درجة المخاطر خلال الـ 12 شهراً الماضية' }, format: 'PDF' },
    { icon: AlertTriangle, title: { en: 'Incident Summary', ar: 'ملخص الحوادث' }, desc: { en: 'All incidents with resolution status and cost', ar: 'جميع الحوادث مع حالة الحل والتكلفة' }, format: 'PDF · Excel' },
    { icon: CheckCircle2, title: { en: 'License Status Report', ar: 'تقرير حالة التراخيص' }, desc: { en: 'All license expiry dates and renewal status', ar: 'جميع تواريخ انتهاء التراخيص وحالة التجديد' }, format: 'PDF' },
    { icon: Wifi, title: { en: 'Sensor Network Report', ar: 'تقرير شبكة المستشعرات' }, desc: { en: 'Sensor health and coverage gaps', ar: 'صحة المستشعرات وفجوات التغطية' }, format: 'PDF · Excel' },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#F9FAFB]">{t(ui.reports)}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((r, i) => {
          const Icon = r.icon
          return (
            <div key={i} className="portal-card bg-[#111827] border-[#2D3748] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1F2937] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#F9FAFB]">{t(r.title)}</div>
                <div className="text-xs text-[#9CA3AF]">{t(r.desc)}</div>
                <div className="text-xs text-[#6B7280] mt-0.5">{r.format}</div>
              </div>
              <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2D3748] text-[#F9FAFB] text-xs font-medium hover:bg-[#1F2937] transition-colors">
                <Download className="w-3.5 h-3.5" />
                {t(ui.downloadReport)}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
