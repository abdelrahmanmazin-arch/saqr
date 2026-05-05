/**
 * Tier 1 — National Command Dashboard
 * Executive read-only view. No dispatch buttons. No forms. Pure visibility.
 */
import { AlertTriangle } from 'lucide-react'
import { buildings } from '../../data/seed'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'

const REGIONS = [
  { name: { en: 'Riyadh',           ar: 'الرياض'          }, incidents: 12, units: 34, riskAvg: 72, compliance: 87 },
  { name: { en: 'Makkah',           ar: 'مكة المكرمة'      }, incidents:  8, units: 28, riskAvg: 68, compliance: 91 },
  { name: { en: 'Eastern Province', ar: 'المنطقة الشرقية'  }, incidents: 15, units: 41, riskAvg: 78, compliance: 83 },
  { name: { en: 'Madinah',          ar: 'المدينة المنورة'  }, incidents:  5, units: 19, riskAvg: 61, compliance: 94 },
  { name: { en: 'Qassim',           ar: 'القصيم'           }, incidents:  3, units: 12, riskAvg: 55, compliance: 96 },
  { name: { en: 'Asir',             ar: 'عسير'             }, incidents:  6, units: 17, riskAvg: 63, compliance: 89 },
  { name: { en: 'Tabuk',            ar: 'تبوك'             }, incidents:  2, units:  9, riskAvg: 48, compliance: 97 },
]

const COMPLIANCE_TREND = [
  { month: 'Nov', national: 83, riyadh: 81, eastern: 78, makkah: 88 },
  { month: 'Dec', national: 84, riyadh: 82, eastern: 79, makkah: 89 },
  { month: 'Jan', national: 85, riyadh: 83, eastern: 80, makkah: 90 },
  { month: 'Feb', national: 85, riyadh: 84, eastern: 81, makkah: 90 },
  { month: 'Mar', national: 86, riyadh: 85, eastern: 82, makkah: 91 },
  { month: 'Apr', national: 91, riyadh: 87, eastern: 83, makkah: 91 },
]

const NATIONAL_ALERTS = [
  { id: 'NA-001', sev: 'critical', msg: { en: 'Eastern Province: 3 CRITICAL incidents active — HAZMAT perimeter declared', ar: 'المنطقة الشرقية: 3 حوادث حرجة نشطة — تم إعلان محيط المواد الخطرة' }, time: '02:16' },
  { id: 'NA-002', sev: 'high',     msg: { en: 'Riyadh: Response time SLA breach — average 14.2 min (target 8 min)', ar: 'الرياض: خرق SLA وقت الاستجابة — متوسط 14.2 دقيقة (المستهدف 8 دقائق)' }, time: '08:42' },
  { id: 'NA-003', sev: 'high',     msg: { en: '43 open violations nationally — 7 flagged Life Safety severity', ar: '43 مخالفة مفتوحة وطنياً — 7 مصنفة بخطورة السلامة الحياتية' }, time: '11:00' },
  { id: 'NA-004', sev: 'medium',   msg: { en: 'Makkah: Compliance rate improved +4% this month following enforcement campaign', ar: 'مكة المكرمة: تحسن معدل الامتثال +4% هذا الشهر إثر حملة التطبيق' }, time: '09:15' },
  { id: 'NA-005', sev: 'medium',   msg: { en: 'AI Policy Rule "SBC 801 Section 9.4 Sprinkler Pressure" went live — scanning all buildings', ar: 'قاعدة السياسة الذكية "SBC 801 القسم 9.4" أصبحت نشطة — مسح جميع المباني' }, time: '10:30' },
]

const SEV_STYLE = {
  critical: { row: 'border-l-4 border-red-500',    badge: 'bg-red-100 text-red-700'    },
  high:     { row: 'border-l-4 border-orange-500', badge: 'bg-orange-100 text-orange-700' },
  medium:   { row: 'border-l-4 border-amber-500',  badge: 'bg-amber-100 text-amber-700'  },
}

function riskColor(score) {
  if (score >= 75) return 'text-red-600'
  if (score >= 60) return 'text-orange-600'
  return 'text-green-600'
}

function riskBarColor(score) {
  if (score >= 75) return '#DC2626'
  if (score >= 60) return '#EA580C'
  return '#16A34A'
}

const CustomBar = (props) => {
  const { x, y, width, height, riskAvg } = props
  const fill = riskBarColor(riskAvg)
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={3} />
}

export default function NationalView({ t, lang }) {
  const isRTL = lang === 'ar'
  const totalIncidents = REGIONS.reduce((s, r) => s + r.incidents, 0)
  const totalUnits     = REGIONS.reduce((s, r) => s + r.units, 0)
  const avgCompliance  = Math.round(REGIONS.reduce((s, r) => s + r.compliance, 0) / REGIONS.length)

  const topRiskBuildings = [...buildings]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)

  const kpis = [
    { label: { en: 'Active Incidents (National)', ar: 'الحوادث النشطة (وطنياً)' },   value: totalIncidents,        sub: { en: 'across all regions', ar: 'عبر جميع المناطق' },          color: 'text-red-600'   },
    { label: { en: 'Units Deployed',              ar: 'الوحدات المنتشرة'          },   value: `${totalUnits-32}/${totalUnits}`, sub: { en: 'deployed / total', ar: 'منتشرة / الإجمالي' }, color: 'text-orange-600'},
    { label: { en: 'Avg Response Time',           ar: 'متوسط وقت الاستجابة'       },   value: '8.3 min',             sub: { en: 'national average', ar: 'المتوسط الوطني' },              color: 'text-blue-600'  },
    { label: { en: 'Buildings Monitored',         ar: 'المباني المراقبة'           },   value: '1,247',               sub: { en: 'live MDRE scoring', ar: 'تقييم MDRE الفوري' },           color: 'text-gray-900'  },
    { label: { en: 'Open Violations',             ar: 'المخالفات المفتوحة'         },   value: '43',                  sub: { en: '7 Life Safety severity', ar: '7 بخطورة السلامة الحياتية' }, color: 'text-red-600' },
    { label: { en: 'National Compliance',         ar: 'الامتثال الوطني'            },   value: `${avgCompliance}%`,   sub: { en: 'weighted average', ar: 'المتوسط المرجح' },               color: 'text-green-600' },
  ]

  const regionChartData = REGIONS.map(r => ({
    name: lang === 'ar' ? r.name.ar : r.name.en,
    riskAvg: r.riskAvg,
  }))

  return (
    <div className="flex-1 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Read-only banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-blue-700 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{t({ en: 'National Command View — Read Only. No operational controls are available at this tier.', ar: 'عرض القيادة الوطنية — قراءة فقط. لا توجد أدوات تشغيلية في هذه الطبقة.' })}</span>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500 mb-1 leading-tight">{t(k.label)}</div>
              <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{t(k.sub)}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Risk Distribution by Region */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="font-bold text-gray-900 text-sm mb-4">{t({ en: 'Risk Score by Region', ar: 'درجة المخاطر حسب المنطقة' })}</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={regionChartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 8, fontSize: 12 }}
                  formatter={(val) => [val, t({ en: 'Risk Score', ar: 'درجة المخاطر' })]}
                />
                <Bar dataKey="riskAvg" shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block" />{t({ en: '≥75 Critical', ar: '≥75 حرج' })}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-600 inline-block" />{t({ en: '60–74 High', ar: '60–74 مرتفع' })}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" />{t({ en: '<60 Normal', ar: '<60 طبيعي' })}</span>
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="font-bold text-gray-900 text-sm mb-4">{t({ en: 'Compliance Trend (6 Months)', ar: 'اتجاه الامتثال (6 أشهر)' })}</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={COMPLIANCE_TREND} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 8, fontSize: 12 }}
                  formatter={(val, name) => [`${val}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: '#6B7280' }} />
                <Line type="monotone" dataKey="national" stroke="#991B1B" strokeWidth={2} dot={false} name={t({ en: 'National', ar: 'وطني' })} />
                <Line type="monotone" dataKey="riyadh"   stroke="#3B82F6" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name={t({ en: 'Riyadh', ar: 'الرياض' })} />
                <Line type="monotone" dataKey="eastern"  stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name={t({ en: 'Eastern', ar: 'الشرقية' })} />
                <Line type="monotone" dataKey="makkah"   stroke="#10B981" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name={t({ en: 'Makkah', ar: 'مكة' })} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Risk Buildings */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{t({ en: 'Top-Risk Buildings (National)', ar: 'المباني الأعلى خطورة (وطنياً)' })}</h2>
            <span className="text-xs text-gray-400 bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold">
              {t({ en: 'Read Only', ar: 'قراءة فقط' })}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="px-5 py-3 text-start font-medium">{t({ en: 'Building', ar: 'المبنى' })}</th>
                  <th className="px-4 py-3 text-center font-medium">{t({ en: 'SBC Type', ar: 'نوع SBC' })}</th>
                  <th className="px-4 py-3 text-center font-medium">{t({ en: 'Risk Score', ar: 'درجة المخاطر' })}</th>
                  <th className="px-4 py-3 text-start font-medium">{t({ en: 'Risk Bar', ar: 'شريط المخاطر' })}</th>
                </tr>
              </thead>
              <tbody>
                {topRiskBuildings.map((bld, i) => (
                  <tr key={bld.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{t(bld.name)}</div>
                      <div className="text-[10px] text-gray-400">{bld.id}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{bld.sbcType}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-bold text-sm ${riskColor(bld.riskScore)}`}>{bld.riskScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${bld.riskScore}%`, background: riskBarColor(bld.riskScore) }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">{t({ en: 'Regional Breakdown', ar: 'التفصيل الإقليمي' })}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="px-5 py-3 text-start font-medium">{t({ en: 'Region', ar: 'المنطقة' })}</th>
                  <th className="px-4 py-3 text-center font-medium">{t({ en: 'Active Incidents', ar: 'الحوادث النشطة' })}</th>
                  <th className="px-4 py-3 text-center font-medium">{t({ en: 'Units Deployed', ar: 'الوحدات المنتشرة' })}</th>
                  <th className="px-4 py-3 text-center font-medium">{t({ en: 'Risk Score Avg', ar: 'متوسط درجة المخاطر' })}</th>
                  <th className="px-4 py-3 text-center font-medium">{t({ en: 'Compliance %', ar: 'نسبة الامتثال' })}</th>
                </tr>
              </thead>
              <tbody>
                {REGIONS.map((r, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{t(r.name)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-semibold ${r.incidents >= 10 ? 'text-red-600' : r.incidents >= 6 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {r.incidents}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-gray-700">{r.units}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-semibold ${riskColor(r.riskAvg)}`}>{r.riskAvg}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${r.compliance >= 90 ? 'bg-green-500' : r.compliance >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${r.compliance}%` }} />
                        </div>
                        <span className="font-mono text-xs text-gray-700">{r.compliance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* National alert feed */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">{t({ en: 'National Alert Feed', ar: 'التنبيهات الوطنية' })}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {NATIONAL_ALERTS.map(alert => {
              const s = SEV_STYLE[alert.sev] ?? SEV_STYLE.medium
              return (
                <div key={alert.id} className={`px-5 py-3.5 flex items-start gap-3 ${s.row}`}>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex-shrink-0 mt-0.5 ${s.badge}`}>
                    {alert.sev}
                  </span>
                  <p className="flex-1 text-sm text-gray-700">{t(alert.msg)}</p>
                  <span className="text-xs text-gray-400 font-mono flex-shrink-0">{alert.time}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
