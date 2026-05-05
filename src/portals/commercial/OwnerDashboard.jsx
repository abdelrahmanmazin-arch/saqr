import { useState } from 'react'
import { getRiskBand, getRiskColor, daysUntil } from '../../data/seed'
import { scheduledTasks, riskTrends } from '../../data/commercialData'
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Building2, Zap, Clock, CheckSquare, ChevronRight, Play } from 'lucide-react'

const SURFACE = '#FFFFFF'
const ELEVATED = '#F7F5F2'
const BORDER = 'rgba(0,0,0,0.07)'
const GOLD = '#1E3A5F'
const TEXT_PRIMARY = '#18181B'
const TEXT_SECONDARY = '#52525B'

function RiskColor(score) {
  if (score >= 85) return '#EF4444'
  if (score >= 70) return '#F97316'
  if (score >= 50) return '#EAB308'
  return '#22C55E'
}

function ScoreBar({ score }) {
  return (
    <div style={{ background: BORDER }} className="h-1.5 rounded-full w-full overflow-hidden">
      <div style={{ width: `${score}%`, background: RiskColor(score) }} className="h-full rounded-full transition-all duration-500" />
    </div>
  )
}

// Tiny inline spark using SVG
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null
  const w = 80, h = 28
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default function OwnerDashboard({ t, lang, isRTL, buildings, owner, onSelectBuilding, addToast, simPhase, setSimPhase }) {
  const [simBuildings, setSimBuildings] = useState(buildings)
  const [simActive, setSimActive] = useState(false)

  const avgRisk = Math.round(simBuildings.reduce((s, b) => s + b.riskScore, 0) / simBuildings.length)
  const totalAlerts = simBuildings.reduce((s, b) => s + b.activeAlerts, 0)
  const expiring = simBuildings.filter(b => { const d = daysUntil(b.licenseExpiry); return d > 0 && d <= 90 }).length
  const overdueTaskCount = scheduledTasks.filter(t => t.status === 'overdue' && owner.buildingIds.includes(t.buildingId)).length

  const riskBand = getRiskBand(avgRisk)

  // Simulation 1: Al Jubail score change (bld-009 if available, else bld-001)
  const simTarget = simBuildings.find(b => b.id === 'bld-009') || simBuildings[0]

  function runSimulation() {
    if (simActive) return
    setSimActive(true)
    addToast(t({ en: `Sprinkler pressure drop detected at ${t(simTarget.name)}`, ar: `انخفاض ضغط الرشاشات في ${t(simTarget.name)}` }), 'critical', 5000)
    setTimeout(() => {
      setSimBuildings(prev => prev.map(b => b.id === simTarget.id ? { ...b, riskScore: 96, activeAlerts: b.activeAlerts + 2 } : b))
      addToast(t({ en: `Risk score elevated: ${simTarget.riskScore}→96`, ar: `ارتفع مؤشر المخاطر: ${simTarget.riskScore}→96` }), 'critical', 5000)
    }, 2000)
    setTimeout(() => {
      addToast(t({ en: 'Vendor dispatched — ETA 45 min', ar: 'تم إرسال المورد — وقت الوصول 45 دقيقة' }), 'warning', 5000)
    }, 4500)
    setTimeout(() => {
      setSimBuildings(prev => prev.map(b => b.id === simTarget.id ? { ...b, riskScore: simTarget.riskScore, activeAlerts: simTarget.activeAlerts } : b))
      addToast(t({ en: 'Resolved — score restored', ar: 'تم الحل — تم استعادة المؤشر' }), 'success', 4000)
      setSimActive(false)
    }, 9000)
  }

  const kpis = [
    {
      label: { en: 'Portfolio Avg Risk', ar: 'متوسط مخاطر المحفظة' },
      value: avgRisk,
      unit: '',
      color: RiskColor(avgRisk),
      icon: TrendingUp,
      sub: { en: riskBand.charAt(0).toUpperCase() + riskBand.slice(1) + ' band', ar: `نطاق ${riskBand === 'low' ? 'منخفض' : riskBand === 'medium' ? 'متوسط' : riskBand === 'high' ? 'مرتفع' : 'حرج'}` },
    },
    {
      label: { en: 'Active Alerts', ar: 'التنبيهات النشطة' },
      value: totalAlerts,
      unit: '',
      color: totalAlerts > 5 ? '#EF4444' : '#F97316',
      icon: AlertTriangle,
      sub: { en: 'Across all buildings', ar: 'عبر جميع المباني' },
    },
    {
      label: { en: 'License Status', ar: 'حالة الترخيص' },
      value: expiring,
      unit: '',
      color: expiring > 0 ? '#EAB308' : '#22C55E',
      icon: Clock,
      sub: { en: expiring > 0 ? 'Expiring within 90 days' : 'All licenses valid', ar: expiring > 0 ? 'تنتهي خلال 90 يوماً' : 'جميع التراخيص سارية' },
    },
    {
      label: { en: 'Overdue Tasks', ar: 'المهام المتأخرة' },
      value: overdueTaskCount,
      unit: '',
      color: overdueTaskCount > 0 ? '#EF4444' : '#22C55E',
      icon: CheckSquare,
      sub: { en: overdueTaskCount > 0 ? 'Require immediate attention' : 'All tasks on track', ar: overdueTaskCount > 0 ? 'تتطلب اهتماماً فورياً' : 'جميع المهام في موعدها' },
    },
  ]

  const ownerTasks = scheduledTasks.filter(t => owner.buildingIds.includes(t.buildingId)).slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Hero Banner */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div style={{ color: TEXT_SECONDARY }} className="text-sm mb-1">{t({ en: 'Portfolio Risk Posture', ar: 'وضع مخاطر المحفظة' })}</div>
            <div className="flex items-end gap-3">
              <span style={{ color: RiskColor(avgRisk), fontSize: 56, lineHeight: 1 }} className="font-bold ltr-num">{avgRisk}</span>
              <div className="mb-2">
                <div style={{ color: TEXT_SECONDARY }} className="text-xs">{t({ en: 'of 100', ar: 'من 100' })}</div>
                <div style={{ color: RiskColor(avgRisk) }} className="text-sm font-semibold uppercase">
                  {t({ en: riskBand, ar: riskBand === 'low' ? 'منخفض' : riskBand === 'medium' ? 'متوسط' : riskBand === 'high' ? 'مرتفع' : 'حرج' })}
                </div>
              </div>
            </div>
            <div style={{ color: TEXT_SECONDARY }} className="text-sm mt-1">
              {t({ en: `${simBuildings.length} buildings · ${totalAlerts} active alerts`, ar: `${simBuildings.length} مبانٍ · ${totalAlerts} تنبيه نشط` })}
            </div>
          </div>
          <button
            onClick={runSimulation}
            disabled={simActive}
            style={{ border: `1px solid ${GOLD}`, color: simActive ? TEXT_SECONDARY : GOLD }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-opacity disabled:opacity-50"
          >
            <Play size={14} />
            {t({ en: simActive ? 'Simulating…' : 'Run Sim: Pressure Drop', ar: simActive ? 'جارٍ المحاكاة…' : 'تشغيل محاكاة: انخفاض الضغط' })}
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderLeftColor: kpi.color, borderLeftWidth: 3 }} className="rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} style={{ color: kpi.color }} />
              </div>
              <div style={{ color: kpi.color }} className="text-3xl font-bold ltr-num">{kpi.value}</div>
              <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium mt-0.5">{t(kpi.label)}</div>
              <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{t(kpi.sub)}</div>
            </div>
          )
        })}
      </div>

      {/* Building Grid */}
      <div>
        <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider mb-3">{t({ en: 'Buildings', ar: 'المباني' })}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simBuildings.map(bld => {
            const trend = riskTrends[bld.id]
            const trendDir = trend ? trend[trend.length - 1] - trend[0] : 0
            const licDays = daysUntil(bld.licenseExpiry)
            return (
              <button
                key={bld.id}
                onClick={() => onSelectBuilding(bld)}
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                className="rounded-xl p-4 text-start transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div style={{ color: TEXT_PRIMARY }} className="font-semibold text-sm">{t(bld.name)}</div>
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">{bld.sbcType} · {t(bld.region)}</div>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: RiskColor(bld.riskScore) }}>
                    <span className="text-xl font-bold ltr-num">{bld.riskScore}</span>
                    {trendDir > 2 ? <TrendingUp size={14} /> : trendDir < -2 ? <TrendingDown size={14} /> : <Minus size={14} />}
                  </div>
                </div>
                <ScoreBar score={bld.riskScore} />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-3">
                    <span style={{ color: bld.activeAlerts > 0 ? '#EF4444' : TEXT_SECONDARY }} className="text-xs">
                      {bld.activeAlerts} {t({ en: 'alerts', ar: 'تنبيه' })}
                    </span>
                    <span style={{ color: TEXT_SECONDARY }} className="text-xs">
                      {bld.sensors.total} {t({ en: 'sensors', ar: 'مستشعر' })}
                    </span>
                  </div>
                  <span
                    style={{ color: licDays < 0 ? '#EF4444' : licDays < 60 ? '#EAB308' : TEXT_SECONDARY }}
                    className="text-xs ltr-num"
                  >
                    {licDays < 0
                      ? t({ en: 'License expired', ar: 'الترخيص منتهي' })
                      : licDays < 60
                      ? t({ en: `${licDays}d to expiry`, ar: `${licDays} يوم للانتهاء` })
                      : t({ en: 'License valid', ar: 'الترخيص ساري' })
                    }
                  </span>
                </div>
                {trend && (
                  <div className="mt-2 flex justify-end">
                    <Sparkline data={trend} color={RiskColor(bld.riskScore)} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Maintenance Calendar (upcoming tasks) */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
        <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider mb-3">{t({ en: 'Upcoming Tasks', ar: 'المهام القادمة' })}</div>
        <div className="space-y-2">
          {ownerTasks.map(task => {
            const days = daysUntil(task.dueDate)
            const isOverdue = task.status === 'overdue' || days < 0
            const isDone = task.status === 'completed'
            const bld = simBuildings.find(b => b.id === task.buildingId)
            return (
              <div key={task.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="flex items-center justify-between py-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: isDone ? '#22C55E' : isOverdue ? '#EF4444' : task.priority === 'high' ? '#F97316' : TEXT_SECONDARY }} />
                  <div>
                    <div style={{ color: TEXT_PRIMARY }} className="text-sm">{t(task.title)}</div>
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs">{bld ? t(bld.name) : task.buildingId}</div>
                  </div>
                </div>
                <div className="text-end">
                  <div style={{ color: isOverdue ? '#EF4444' : TEXT_SECONDARY }} className="text-xs ltr-num">
                    {isDone ? t({ en: 'Done', ar: 'مكتمل' }) : isOverdue ? t({ en: 'Overdue', ar: 'متأخر' }) : `${days}d`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
