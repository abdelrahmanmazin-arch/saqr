import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { daysUntil, formatSAR } from '../../data/seed'
import { maintenanceReports, commercialViolations, buildingSensors, riskTrends, scheduledTasks } from '../../data/commercialData'
import { Building2, Wifi, WifiOff, AlertTriangle, CheckCircle2, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const SURFACE = '#FFFFFF'
const ELEVATED = '#F3F4F6'
const BORDER = '#E5E7EB'
const GOLD = '#1B4F72'
const TEXT_PRIMARY = '#111827'
const TEXT_SECONDARY = '#6B7280'

function RiskColor(score) {
  if (score >= 85) return '#EF4444'
  if (score >= 70) return '#F97316'
  if (score >= 50) return '#EAB308'
  return '#22C55E'
}

const SHAP_FACTORS = [
  { key: 'fireSuppression', label: { en: 'Fire Suppression', ar: 'نظام الإطفاء' }, weight: 0.30 },
  { key: 'electrical', label: { en: 'Electrical', ar: 'الكهربائي' }, weight: 0.25 },
  { key: 'sensorCoverage', label: { en: 'Sensor Coverage', ar: 'تغطية المستشعرات' }, weight: 0.20 },
  { key: 'inspectionComp', label: { en: 'Inspection Compliance', ar: 'الامتثال للفحص' }, weight: 0.15 },
  { key: 'evacuation', label: { en: 'Evacuation', ar: 'الإخلاء' }, weight: 0.10 },
]

// Generate pseudo SHAP scores from overall risk score
function getSHAPScores(riskScore) {
  const base = riskScore
  return {
    fireSuppression: Math.min(100, Math.round(base * 0.95 + 4)),
    electrical: Math.min(100, Math.round(base * 1.05 - 2)),
    sensorCoverage: Math.min(100, Math.round(base * 0.85 + 10)),
    inspectionComp: Math.min(100, Math.round(base * 0.90 + 6)),
    evacuation: Math.min(100, Math.round(base * 0.88 + 8)),
  }
}

const SENSOR_TYPE_LABEL = {
  smoke: { en: 'Smoke', ar: 'دخان' },
  temperature: { en: 'Temperature', ar: 'حرارة' },
  'sprinkler-pressure': { en: 'Sprinkler Pressure', ar: 'ضغط الرشاشات' },
  co: { en: 'CO', ar: 'CO' },
}

const STATUS_COLOR = { normal: '#22C55E', warning: '#EAB308', critical: '#EF4444', offline: '#6B7280' }

export default function BuildingDetail({ t, lang, isRTL, buildings, building, onSelectBuilding }) {
  const [tab, setTab] = useState('overview')
  const [reportDraft, setReportDraft] = useState({ title: '', description: '' })
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const tabs = [
    { id: 'overview', label: { en: 'Overview', ar: 'نظرة عامة' } },
    { id: 'sensors', label: { en: 'Sensor Network', ar: 'شبكة المستشعرات' } },
    { id: 'maintenance', label: { en: 'Maintenance', ar: 'الصيانة' } },
    { id: 'license', label: { en: 'License & Compliance', ar: 'الترخيص والامتثال' } },
  ]

  if (!building) {
    return (
      <div className="p-6">
        <div style={{ color: TEXT_SECONDARY }} className="text-sm mb-4">{t({ en: 'Select a building to view details', ar: 'اختر مبنى لعرض التفاصيل' })}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {buildings.map(b => (
            <button
              key={b.id}
              onClick={() => onSelectBuilding(b)}
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-4 text-start hover:border-gray-300 transition-colors"
            >
              <div style={{ color: TEXT_PRIMARY }} className="font-semibold">{t(b.name)}</div>
              <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{b.sbcType} · {t(b.region)}</div>
              <div style={{ color: RiskColor(b.riskScore) }} className="text-sm font-bold mt-2 ltr-num">{b.riskScore}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const shapScores = getSHAPScores(building.riskScore)
  const trendData = (riskTrends[building.id] || []).map((score, i) => ({ day: i + 1, score }))
  const sensors = buildingSensors[building.id] || []
  const bldReports = maintenanceReports.filter(r => r.buildingId === building.id)
  const bldViolations = commercialViolations.filter(v => v.buildingId === building.id)
  const bldTasks = scheduledTasks.filter(t => t.buildingId === building.id)
  const licDays = daysUntil(building.licenseExpiry)

  function submitReport() {
    if (!reportDraft.title.trim()) return
    setReportSubmitted(true)
    setTimeout(() => { setReportSubmitted(false); setReportDraft({ title: '', description: '' }) }, 3000)
  }

  const statusReportLabel = {
    approved: { en: 'Approved', ar: 'معتمد', color: '#22C55E' },
    'pending-cd': { en: 'Pending CD', ar: 'قيد الدفاع المدني', color: '#EAB308' },
    rejected: { en: 'Rejected', ar: 'مرفوض', color: '#EF4444' },
  }

  const violSeverityColor = { critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#6B7280' }
  const violStatusColor = { open: '#EF4444', 'under-review': '#F97316', resolved: '#22C55E' }

  return (
    <div className="flex flex-col h-full">
      {/* Building Header */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }} className="p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <button onClick={() => onSelectBuilding(null)} style={{ color: TEXT_SECONDARY }} className="text-xs mb-1 hover:text-gray-900 flex items-center gap-1">
              {isRTL ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
              {t({ en: 'All Buildings', ar: 'جميع المباني' })}
            </button>
            <h2 style={{ color: TEXT_PRIMARY }} className="text-xl font-bold">{t(building.name)}</h2>
            <div style={{ color: TEXT_SECONDARY }} className="text-sm mt-0.5">
              {building.sbcType} · {t(building.region)} · {building.floors} {t({ en: 'floors', ar: 'طابق' })}
            </div>
          </div>
          <div style={{ color: RiskColor(building.riskScore) }} className="text-4xl font-bold ltr-num">{building.riskScore}</div>
        </div>
        {/* Tab Bar */}
        <div className="flex gap-1 mt-4">
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                color: tab === tb.id ? GOLD : TEXT_SECONDARY,
                borderBottom: `2px solid ${tab === tb.id ? GOLD : 'transparent'}`,
              }}
              className="px-4 py-2 text-sm font-medium transition-colors"
            >
              {t(tb.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            {/* 30-day trend */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
              <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider mb-3">{t({ en: '30-Day Risk Trend', ar: 'اتجاه المخاطر — 30 يوماً' })}</div>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="day" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      contentStyle={{ background: ELEVATED, border: `1px solid ${BORDER}`, color: TEXT_PRIMARY, fontSize: 12 }}
                      formatter={(v) => [v, t({ en: 'Risk Score', ar: 'مؤشر المخاطر' })]}
                    />
                    <Line type="monotone" dataKey="score" stroke={RiskColor(building.riskScore)} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ color: TEXT_SECONDARY }} className="text-sm">{t({ en: 'No trend data', ar: 'لا توجد بيانات اتجاه' })}</div>
              )}
            </div>

            {/* SHAP Risk Factors */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
              <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider mb-4">{t({ en: 'Risk Engine — Factor Breakdown', ar: 'محرك المخاطر — تفصيل العوامل' })}</div>
              <div className="space-y-3">
                {SHAP_FACTORS.map(f => {
                  const score = shapScores[f.key]
                  return (
                    <div key={f.key}>
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ color: TEXT_PRIMARY }} className="text-sm">{t(f.label)}</span>
                        <div className="flex items-center gap-3">
                          <span style={{ color: TEXT_SECONDARY }} className="text-xs">{Math.round(f.weight * 100)}%</span>
                          <span style={{ color: RiskColor(score) }} className="text-sm font-bold ltr-num w-8 text-end">{score}</span>
                        </div>
                      </div>
                      <div style={{ background: BORDER }} className="h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${score}%`, background: RiskColor(score) }} className="h-full rounded-full transition-all duration-700" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Building Info */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
              <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider mb-3">{t({ en: 'Building Info', ar: 'معلومات المبنى' })}</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: { en: 'License No', ar: 'رقم الترخيص' }, v: building.licenseNo },
                  { k: { en: 'SBC Type', ar: 'نوع SBC' }, v: building.sbcType },
                  { k: { en: 'Area', ar: 'المساحة' }, v: `${building.areaSqm.toLocaleString()} m²` },
                  { k: { en: 'Vendor', ar: 'المورد' }, v: t(building.vendor) },
                  { k: { en: 'Last Inspection', ar: 'آخر فحص' }, v: building.lastInspection },
                  { k: { en: 'License Expiry', ar: 'انتهاء الترخيص' }, v: building.licenseExpiry },
                ].map((row, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }} className="pb-2">
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs">{t(row.k)}</div>
                    <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium mt-0.5 ltr-num">{row.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Sensor Network ── */}
        {tab === 'sensors' && (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
            <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider">{t({ en: 'Sensor Network', ar: 'شبكة المستشعرات' })}</div>
              <div className="flex gap-4 mt-2">
                {['normal', 'warning', 'critical', 'offline'].map(s => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[s] }} />
                    <span style={{ color: TEXT_SECONDARY }} className="text-xs capitalize">{t({ normal: { en: 'Normal', ar: 'طبيعي' }, warning: { en: 'Warning', ar: 'تحذير' }, critical: { en: 'Critical', ar: 'حرج' }, offline: { en: 'Offline', ar: 'معطل' } }[s])}</span>
                  </div>
                ))}
              </div>
            </div>
            {sensors.length === 0 ? (
              <div className="p-6" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No sensor data for this building', ar: 'لا توجد بيانات مستشعر لهذا المبنى' })}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {[{ en: 'Sensor ID', ar: 'معرّف المستشعر' }, { en: 'Floor', ar: 'الطابق' }, { en: 'Zone', ar: 'المنطقة' }, { en: 'Type', ar: 'النوع' }, { en: 'Status', ar: 'الحالة' }, { en: 'Last Reading', ar: 'آخر قراءة' }].map((h, i) => (
                      <th key={i} style={{ color: TEXT_SECONDARY }} className="text-start px-4 py-2 font-medium text-xs">{t(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensors.map(s => (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ color: TEXT_PRIMARY }} className="px-4 py-2.5 ltr-num text-xs font-mono">{s.id}</td>
                      <td style={{ color: TEXT_PRIMARY }} className="px-4 py-2.5 ltr-num">{s.floor}</td>
                      <td style={{ color: TEXT_SECONDARY }} className="px-4 py-2.5">{s.zone}</td>
                      <td style={{ color: TEXT_SECONDARY }} className="px-4 py-2.5">{t(SENSOR_TYPE_LABEL[s.type] || { en: s.type, ar: s.type })}</td>
                      <td className="px-4 py-2.5">
                        <span style={{ color: STATUS_COLOR[s.status] }} className="flex items-center gap-1.5 text-xs">
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[s.status], display: 'inline-block' }} />
                          {t({ normal: { en: 'Normal', ar: 'طبيعي' }, warning: { en: 'Warning', ar: 'تحذير' }, critical: { en: 'Critical', ar: 'حرج' }, offline: { en: 'Offline', ar: 'معطل' } }[s.status])}
                        </span>
                      </td>
                      <td style={{ color: TEXT_SECONDARY }} className="px-4 py-2.5 text-xs ltr-num">{s.lastReading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Maintenance ── */}
        {tab === 'maintenance' && (
          <>
            {/* Scheduled Tasks */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
              <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider">{t({ en: 'Scheduled Tasks', ar: 'المهام المجدولة' })}</div>
              </div>
              {bldTasks.length === 0 ? (
                <div className="p-4" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No tasks', ar: 'لا توجد مهام' })}</div>
              ) : (
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {bldTasks.map(task => {
                    const days = daysUntil(task.dueDate)
                    const isOverdue = task.status === 'overdue' || days < 0
                    const isDone = task.status === 'completed'
                    return (
                      <div key={task.id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: isDone ? '#22C55E' : isOverdue ? '#EF4444' : task.priority === 'high' || task.priority === 'critical' ? '#F97316' : TEXT_SECONDARY }} />
                          <div>
                            <div style={{ color: TEXT_PRIMARY }} className="text-sm">{t(task.title)}</div>
                            <div style={{ color: TEXT_SECONDARY }} className="text-xs">{t(task.assignee)}</div>
                          </div>
                        </div>
                        <div style={{ color: isDone ? '#22C55E' : isOverdue ? '#EF4444' : TEXT_SECONDARY }} className="text-xs ltr-num">
                          {isDone ? t({ en: 'Done', ar: 'مكتمل' }) : isOverdue ? t({ en: 'Overdue', ar: 'متأخر' }) : `${days}d`}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Maintenance Reports */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
              <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider">{t({ en: 'Reports', ar: 'التقارير' })}</div>
              </div>
              {bldReports.length === 0 ? (
                <div className="p-4" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No reports', ar: 'لا توجد تقارير' })}</div>
              ) : (
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {bldReports.map(r => {
                    const s = statusReportLabel[r.status] || { en: r.status, ar: r.status, color: TEXT_SECONDARY }
                    return (
                      <div key={r.id} className="px-4 py-3" style={{ borderLeft: `3px solid ${s.color}` }}>
                        <div className="flex items-center justify-between">
                          <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{t(r.title)}</div>
                          <span style={{ color: s.color }} className="text-xs">{t({ en: s.en, ar: s.ar })}</span>
                        </div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{r.date} · {t(r.submittedBy)}</div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{t(r.description)}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Report Submission Form */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
              <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider mb-3">{t({ en: 'Submit Maintenance Report', ar: 'تقديم تقرير صيانة' })}</div>
              {reportSubmitted ? (
                <div style={{ color: '#22C55E' }} className="text-sm">{t({ en: 'Report submitted successfully.', ar: 'تم تقديم التقرير بنجاح.' })}</div>
              ) : (
                <div className="space-y-3">
                  <input
                    value={reportDraft.title}
                    onChange={e => setReportDraft(p => ({ ...p, title: e.target.value }))}
                    placeholder={t({ en: 'Report title…', ar: 'عنوان التقرير…' })}
                    style={{ background: ELEVATED, border: `1px solid ${BORDER}`, color: TEXT_PRIMARY }}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none placeholder:text-[#6B7280]"
                  />
                  <textarea
                    value={reportDraft.description}
                    onChange={e => setReportDraft(p => ({ ...p, description: e.target.value }))}
                    placeholder={t({ en: 'Description…', ar: 'الوصف…' })}
                    rows={3}
                    style={{ background: ELEVATED, border: `1px solid ${BORDER}`, color: TEXT_PRIMARY }}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none placeholder:text-[#6B7280] resize-none"
                  />
                  <button
                    onClick={submitReport}
                    style={{ background: GOLD, color: '#0A0E1A' }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    {t({ en: 'Submit Report', ar: 'تقديم التقرير' })}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── License & Compliance ── */}
        {tab === 'license' && (
          <>
            {/* License Card */}
            <div
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${licDays < 0 ? '#EF4444' : licDays < 60 ? '#EAB308' : '#22C55E'}` }}
              className="rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ color: TEXT_SECONDARY }} className="text-xs mb-1">{t({ en: 'Fire Safety License', ar: 'ترخيص السلامة من الحريق' })}</div>
                  <div style={{ color: TEXT_PRIMARY }} className="font-bold">{building.licenseNo}</div>
                  <div style={{ color: TEXT_SECONDARY }} className="text-sm mt-1">{t({ en: 'Expiry:', ar: 'الانتهاء:' })} <span className="ltr-num">{building.licenseExpiry}</span></div>
                </div>
                <div style={{ color: licDays < 0 ? '#EF4444' : licDays < 60 ? '#EAB308' : '#22C55E' }} className="text-sm font-semibold">
                  {licDays < 0
                    ? t({ en: 'EXPIRED', ar: 'منتهي' })
                    : licDays < 60
                    ? t({ en: `${licDays} days left`, ar: `${licDays} يوم متبقي` })
                    : t({ en: 'Active', ar: 'ساري' })
                  }
                </div>
              </div>
            </div>

            {/* Violations */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
              <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider">{t({ en: 'Violations', ar: 'المخالفات' })}</div>
              </div>
              {bldViolations.length === 0 ? (
                <div className="p-4 text-sm" style={{ color: '#22C55E' }}>{t({ en: 'No violations recorded', ar: 'لا توجد مخالفات مسجلة' })}</div>
              ) : (
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {bldViolations.map(v => (
                    <div key={v.id} style={{ borderLeft: `3px solid ${violSeverityColor[v.severity]}` }} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{t(v.description)}</div>
                        <span style={{ color: violStatusColor[v.status] }} className="text-xs capitalize">{t({ open: { en: 'Open', ar: 'مفتوح' }, 'under-review': { en: 'Under Review', ar: 'قيد المراجعة' }, resolved: { en: 'Resolved', ar: 'محلول' } }[v.status])}</span>
                      </div>
                      <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{v.code} · {t({ en: `Fine: SAR ${v.fine.toLocaleString()}`, ar: `الغرامة: ${v.fine.toLocaleString()} ريال` })}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
