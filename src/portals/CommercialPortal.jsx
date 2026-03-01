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

const SECTIONS = ['dashboard', 'buildings', 'alerts', 'marketplace', 'reports']

export default function CommercialPortal() {
  const { lang, t, buildings, incidents, products, simulateRiskEvent, resetRiskEvent, simulatingEvent, riskEventActive } = useApp()
  const [section, setSection] = useState('dashboard')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const isRTL = lang === 'ar'

  const totalAlerts = buildings.reduce((s, b) => s + b.activeAlerts, 0)
  const expiringSoon = buildings.filter(b => {
    const d = daysUntil(b.licenseExpiry)
    return d > 0 && d <= 90
  }).length
  const avgRisk = Math.round(buildings.reduce((s, b) => s + b.riskScore, 0) / buildings.length)

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
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onNavClick={setSection} activeSection={section} />

      {/* Mobile nav */}
      <nav className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
                  section === item.id
                    ? 'text-[#1B4F72] border-b-2 border-[#1B4F72]'
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

      {/* Simulate risk event banner */}
      {riskEventActive && (
        <div className="bg-red-900 text-white px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span className="font-medium">{t({ en: 'CRITICAL ALERT: Al Jubail Industrial — Sprinkler pressure drop detected. Risk score: 96/100. SLA: 4 hours', ar: 'تنبيه حرج: الجبيل الصناعية — انخفاض ضغط الرشاشات. درجة المخاطر: 96/100. SLA: 4 ساعات' })}</span>
          </div>
          <button onClick={resetRiskEvent} className="flex-shrink-0 text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ─── Dashboard ─────────────────────────── */}
        {section === 'dashboard' && (
          <div className="space-y-6">
            {/* Page title + simulate */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t(ui.dashboard)}</h1>
                <p className="text-gray-500 text-sm">{t({ en: 'Good morning — your portfolio at a glance', ar: 'صباح الخير — لمحة عن محفظتك العقارية' })}</p>
              </div>
              <button
                onClick={riskEventActive ? resetRiskEvent : simulateRiskEvent}
                disabled={simulatingEvent}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  riskEventActive
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-[#1B4F72] text-white hover:bg-[#164060]'
                } ${simulatingEvent ? 'opacity-60 cursor-wait' : ''}`}
              >
                {simulatingEvent ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {t(riskEventActive
                  ? { en: 'Reset Risk Event', ar: 'إعادة تعيين الحدث' }
                  : { en: 'Simulate Risk Event', ar: 'محاكاة حدث مخاطر' }
                )}
              </button>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: { en: 'Total Buildings', ar: 'إجمالي المباني' }, value: buildings.length, icon: Building2, color: 'text-[#1B4F72]', bg: 'bg-blue-50' },
                { label: { en: 'Active Alerts', ar: 'التنبيهات النشطة' }, value: totalAlerts, icon: Bell, color: 'text-red-600', bg: 'bg-red-50', urgent: totalAlerts > 5 },
                { label: { en: 'Licenses Expiring (90d)', ar: 'تراخيص تنتهي (90 يوم)' }, value: expiringSoon, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: { en: 'Portfolio Risk Avg', ar: 'متوسط مخاطر المحفظة' }, value: avgRisk, icon: TrendingUp, color: 'text-[#1B4F72]', bg: 'bg-blue-50', isScore: true },
              ].map((kpi, i) => {
                const Icon = kpi.icon
                return (
                  <div key={i} className={`kpi-tile ${kpi.urgent ? 'border-red-300 bg-red-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">{t(kpi.label)}</span>
                      <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      {kpi.isScore ? (
                        <RiskBadge score={kpi.value} size="lg" />
                      ) : (
                        <span className={`text-2xl font-bold ${kpi.urgent ? 'text-red-700' : 'text-gray-900'}`}>
                          {kpi.value}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Building cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">{t({ en: 'Building Portfolio', ar: 'محفظة المباني' })}</h2>
                <button onClick={() => setSection('buildings')} className="text-[#1B4F72] text-sm font-medium flex items-center gap-1 hover:underline">
                  {t({ en: 'View all', ar: 'عرض الكل' })}
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {buildings.slice(0, 6).map(b => (
                  <BuildingCard key={b.id} building={b} onSelect={() => { setSelectedBuilding(b); setSection('buildings') }} lang={lang} t={t} />
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">{t({ en: 'Quick Actions', ar: 'الإجراءات السريعة' })}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Eye, label: ui.requestInspection, color: 'text-[#1B4F72]', bg: 'bg-blue-50 hover:bg-blue-100' },
                  { icon: FileBarChart2, label: ui.submitMaintenance, color: 'text-green-700', bg: 'bg-green-50 hover:bg-green-100' },
                  { icon: ShoppingBag, label: ui.viewMarketplace, color: 'text-purple-700', bg: 'bg-purple-50 hover:bg-purple-100', action: () => setSection('marketplace') },
                  { icon: Bell, label: ui.contactSupport, color: 'text-amber-700', bg: 'bg-amber-50 hover:bg-amber-100' },
                ].map((qa, i) => {
                  const Icon = qa.icon
                  return (
                    <button
                      key={i}
                      onClick={qa.action}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl ${qa.bg} transition-colors`}
                    >
                      <Icon className={`w-5 h-5 ${qa.color}`} />
                      <span className={`text-xs font-medium text-center ${qa.color}`}>{t(qa.label)}</span>
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
              <h1 className="text-xl font-bold text-gray-900">{t(ui.buildings)}</h1>
              <div className="relative">
                <Search className="w-4 h-4 absolute top-2.5 start-3 text-gray-400 pointer-events-none" />
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder={t(ui.search)}
                  className="ps-9 pe-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 w-64"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
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
                        <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBuildings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{t(b.name)}</div>
                          <div className="text-xs text-gray-400">{t(b.region)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono">{b.sbcType}</span>
                        </td>
                        <td className="px-4 py-3">
                          <RiskBadge score={b.riskScore} />
                        </td>
                        <td className="px-4 py-3">
                          {b.activeAlerts > 0
                            ? <span className="font-semibold text-red-600">{b.activeAlerts}</span>
                            : <span className="text-gray-400">0</span>
                          }
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
                            className="text-[#1B4F72] font-medium text-xs hover:underline flex items-center gap-1"
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

function BuildingCard({ building: b, onSelect, lang, t }) {
  const pct = (b.sensors.normal / b.sensors.total) * 100
  const d = daysUntil(b.licenseExpiry)
  const isRTL = lang === 'ar'
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div
      className="portal-card cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{t(b.name)}</h3>
          <p className="text-xs text-gray-400">{b.sbcType} · {b.floors} {t(ui.floors)} · {formatNum(b.areaSqm)} m²</p>
        </div>
        <RiskBadge score={b.riskScore} />
      </div>

      {/* Sensor bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{t(ui.sensors)}</span>
          <span className="text-xs text-gray-500">{b.sensors.normal}/{b.sensors.total}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
          <div className="bg-green-400 rounded-full" style={{ width: `${(b.sensors.normal / b.sensors.total) * 100}%` }} />
          <div className="bg-amber-400 rounded-full" style={{ width: `${(b.sensors.warning / b.sensors.total) * 100}%` }} />
          <div className="bg-red-500 rounded-full" style={{ width: `${(b.sensors.critical / b.sensors.total) * 100}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={b.licenseStatus} />
          {b.activeAlerts > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <AlertTriangle className="w-3 h-3" />
              {b.activeAlerts}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{t({ en: `${d}d to renewal`, ar: `${d} يوم للتجديد` })}</span>
      </div>
    </div>
  )
}

function SensorBar({ sensors }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-2 w-20 rounded-full overflow-hidden bg-gray-100">
        <div className="bg-green-400" style={{ width: `${(sensors.normal / sensors.total) * 100}%` }} />
        <div className="bg-amber-400" style={{ width: `${(sensors.warning / sensors.total) * 100}%` }} />
        <div className="bg-red-500" style={{ width: `${(sensors.critical / sensors.total) * 100}%` }} />
      </div>
      <span className="text-xs text-gray-400">{sensors.total}</span>
    </div>
  )
}

function BuildingDetail({ building: b, onBack, incidents, t, lang, isRTL }) {
  const buildingIncidents = incidents.filter(i => i.buildingId === b.id)
  const ArrowIcon = isRTL ? ChevronRight : ChevronLeft

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#1B4F72] text-sm font-medium hover:underline">
        <ArrowIcon className="w-4 h-4" />
        {t(ui.buildings)}
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t(b.name)}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(b.region)} · {b.sbcType} · {b.floors} {t(ui.floors)} · {formatNum(b.areaSqm)} m²</p>
            <p className="text-gray-400 text-xs mt-1">{b.licenseNo}</p>
          </div>
          <RiskBadge score={b.riskScore} size="lg" />
        </div>

        {/* Risk factor bars */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t({ en: 'Top Risk Drivers', ar: 'أبرز محركات المخاطر' })}</h3>
            {[
              { label: { en: 'Fire Suppression', ar: 'نظام الإطفاء' }, pct: 72 },
              { label: { en: 'Sensor Coverage', ar: 'تغطية المستشعرات' }, pct: Math.round((b.sensors.normal / b.sensors.total) * 100) },
              { label: { en: 'Inspection Compliance', ar: 'الامتثال للفحوصات' }, pct: b.licenseStatus === 'active' ? 85 : 30 },
            ].map((r, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{t(r.label)}</span>
                  <span className="font-mono">{r.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      r.pct >= 80 ? 'bg-green-400' : r.pct >= 60 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">{t({ en: 'License Info', ar: 'معلومات الترخيص' })}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">{t(ui.license)}</span>
                <StatusBadge status={b.licenseStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t({ en: 'Expiry', ar: 'الانتهاء' })}</span>
                <span className="font-medium text-gray-800">{b.licenseExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t(ui.vendor)}</span>
                <span className="font-medium text-gray-800 text-end">{t(b.vendor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t({ en: 'Last Inspection', ar: 'آخر فحص' })}</span>
                <span className="font-medium text-gray-800">{b.lastInspection}</span>
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
      <h1 className="text-xl font-bold text-gray-900">{t(ui.alerts)}</h1>
      <div className="space-y-3">
        {allAlerts.map(alert => (
          <div
            key={alert.id}
            className={`bg-white rounded-xl border shadow-sm p-4 ${
              alert.severity === 'critical' ? 'border-red-200' :
              alert.severity === 'high' ? 'border-orange-200' :
              'border-gray-100'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-600 animate-pulse' :
                  alert.severity === 'high' ? 'bg-orange-500' :
                  alert.severity === 'medium' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
                <div>
                  <div className="font-semibold text-sm text-gray-900">{t(alert.type)}</div>
                  <div className="text-xs text-gray-500">{alert.building && t(alert.building.name)} · {alert.date}</div>
                  <div className="text-xs text-gray-400 mt-1">{t(alert.description)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge score={
                  alert.severity === 'critical' ? 90 :
                  alert.severity === 'high' ? 75 :
                  alert.severity === 'medium' ? 60 : 40
                } showScore={false} />
                <StatusBadge status={alert.status} />
              </div>
            </div>
            {alert.status !== 'resolved' && alert.status !== 'settled' && (
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 bg-[#1B4F72] text-white text-xs font-medium rounded-lg hover:bg-[#164060] transition-colors">
                  {t(ui.requestInspection)}
                </button>
                <button className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
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
        <h1 className="text-xl font-bold text-gray-900">{t(ui.marketplace)}</h1>
        <p className="text-gray-500 text-sm">{t({ en: 'Safety products and services from Madani Tech', ar: 'منتجات وخدمات السلامة من مدني تك' })}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map(p => (
          <div key={p.id} className="portal-card flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{t(p.name)}</h3>
                <p className="text-xs text-gray-400">{t(p.category)}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${badgeColors[p.badge] ?? 'bg-gray-100 text-gray-700'}`}>
                {p.badge}
              </span>
            </div>
            <ul className="space-y-1.5 flex-1 mb-4">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  {t(f)}
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">{t(p.pricing)}</span>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                p.installed
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-[#1B4F72] text-white hover:bg-[#164060]'
              }`}>
                {p.installed
                  ? t({ en: 'Installed', ar: 'مثبّت' })
                  : p.badge === 'CERTIFIED' && p.id !== 'PRD-002'
                    ? t(ui.requestQuote)
                    : t(ui.subscribe)
                }
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
      <h1 className="text-xl font-bold text-gray-900">{t(ui.reports)}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((r, i) => {
          const Icon = r.icon
          return (
            <div key={i} className="portal-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#1B4F72]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">{t(r.title)}</div>
                <div className="text-xs text-gray-400">{t(r.desc)}</div>
                <div className="text-xs text-gray-300 mt-0.5">{r.format}</div>
              </div>
              <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
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
