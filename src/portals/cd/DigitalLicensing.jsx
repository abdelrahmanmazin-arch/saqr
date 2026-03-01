import { useState } from 'react'
import { cdLicenses, licenseApplications } from '../../data/cdData'
import StatusBadge from '../../components/StatusBadge'
import { FileCheck, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'

const STATUS_RING = {
  active:     'border-green-400 bg-green-50 text-green-900',
  expiring:   'border-amber-400 bg-amber-50 text-amber-900',
  expired:    'border-red-500 bg-red-50 text-red-900',
  'sla-breach': 'border-red-900 bg-red-950 text-white',
}

const STAGE_STATUS = {
  complete: 'bg-green-500 text-white',
  active:   'bg-[#2563EB] text-white animate-pulse',
  pending:  'bg-gray-200 text-gray-500',
}

export default function DigitalLicensing({ t, lang }) {
  const isRTL = lang === 'ar'
  const [licenses, setLicenses] = useState(cdLicenses)
  const [applications, setApplications] = useState(licenseApplications)
  const [simExpiry, setSimExpiry] = useState(false)
  const [tab, setTab] = useState('registry') // 'registry' | 'applications'

  // Summary counts
  const counts = {
    active:     licenses.filter(l => l.status === 'active').length,
    expiring:   licenses.filter(l => l.status === 'expiring').length,
    expired:    licenses.filter(l => l.status === 'expired').length,
    'sla-breach': licenses.filter(l => l.status === 'sla-breach').length,
  }

  // Simulate license expiry for Kingdom Centre
  const triggerExpiry = () => {
    setSimExpiry(true)
    setLicenses(prev => prev.map(l =>
      l.id === 'LIC-0019'
        ? { ...l, status: 'expired', daysLeft: 0 }
        : l
    ))
  }

  const getAction = (lic) => {
    if (lic.status === 'expired' || lic.status === 'sla-breach') return {
      label: { en: 'Enforce', ar: 'تطبيق' },
      cls: 'bg-red-100 text-red-800 hover:bg-red-200',
    }
    if (lic.status === 'expiring') return {
      label: { en: 'Schedule Renewal', ar: 'جدولة التجديد' },
      cls: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    }
    return { label: { en: 'View', ar: 'عرض' }, cls: 'bg-gray-100 text-gray-700 hover:bg-gray-200' }
  }

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Digital Licensing', ar: 'الترخيص الرقمي' })}</h1>
        <button
          onClick={simExpiry ? () => { setSimExpiry(false); setLicenses(cdLicenses) } : triggerExpiry}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            simExpiry ? 'bg-gray-200 text-gray-700' : 'bg-[#2563EB] text-white hover:bg-blue-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          {t(simExpiry ? { en: 'Reset Expiry Simulation', ar: 'إعادة تعيين المحاكاة' } : { en: 'Simulate License Expiry', ar: 'محاكاة انتهاء الترخيص' })}
        </button>
      </div>

      {/* Simulation result */}
      {simExpiry && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900 text-sm">{t({ en: 'License Expiry Cascade — Granada Mall', ar: 'تسلسل انتهاء الترخيص — غرناطة مول' })}</div>
            <div className="text-xs text-red-700 mt-1 space-y-0.5">
              <div>⚠ {t({ en: 'Risk score penalty applied: +22 points', ar: 'غرامة درجة المخاطر مُطبَّقة: +22 نقطة' })}</div>
              <div>📱 {t({ en: 'Owner notified via Saqr app — critical alert', ar: 'تم إخطار المالك عبر صقر — تنبيه حرج' })}</div>
              <div>📋 {t({ en: 'License added to priority inspection queue (Rank #1)', ar: 'الترخيص أُضيف لقائمة الفحوصات الأولوية (رتبة #1)' })}</div>
              <div>🔒 {t({ en: 'Insurance portal flagged — underwriter alerted for premium reassessment', ar: 'بوابة التأمين محدّثة — تنبيه المكتتب لإعادة تقييم القسط' })}</div>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([st, cnt]) => (
          <div key={st} className={`kpi-tile border-2 ${STATUS_RING[st] ?? 'border-gray-100'}`}>
            <span className="text-xs font-medium">
              {t({ active: { en: 'Active', ar: 'نشط' }, expiring: { en: 'Expiring', ar: 'ينتهي قريباً' }, expired: { en: 'Expired', ar: 'منتهي' }, 'sla-breach': { en: 'SLA Breach', ar: 'خرق SLA' } }[st])}
            </span>
            <span className="text-2xl font-bold">{cnt}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'registry', label: { en: 'License Registry', ar: 'سجل التراخيص' } },
          { id: 'applications', label: { en: 'Applications', ar: 'الطلبات' } },
        ].map(tab_ => (
          <button
            key={tab_.id}
            onClick={() => setTab(tab_.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === tab_.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t(tab_.label)}
          </button>
        ))}
      </div>

      {tab === 'registry' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    { en: 'Building', ar: 'المبنى' },
                    { en: 'License Type', ar: 'نوع الترخيص' },
                    { en: 'Status', ar: 'الحالة' },
                    { en: 'Expiry', ar: 'تاريخ الانتهاء' },
                    { en: 'Days', ar: 'الأيام' },
                    { en: 'Vendor OK', ar: 'المورد' },
                    { en: 'Officer', ar: 'الضابط' },
                    { en: 'Action', ar: 'إجراء' },
                  ].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {licenses.map(lic => {
                  const action = getAction(lic)
                  return (
                    <tr key={lic.id} className={`hover:bg-gray-50 transition-colors ${
                      lic.status === 'sla-breach' ? 'bg-red-950/5' :
                      lic.status === 'expired'    ? 'bg-red-50' : ''
                    }`}>
                      <td className="px-4 py-3 font-medium text-gray-900 text-sm">{t(lic.buildingName)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{t(lic.type)}</td>
                      <td className="px-4 py-3"><StatusBadge status={lic.status} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{lic.expiry}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-sm ${lic.daysLeft < 0 ? 'text-red-700' : lic.daysLeft < 120 ? 'text-amber-700' : 'text-green-700'}`}>
                          {lic.daysLeft < 0 ? lic.daysLeft : `+${lic.daysLeft}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {lic.vendorOk
                          ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                          : <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{lic.officer}</td>
                      <td className="px-4 py-3">
                        <button className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${action.cls}`}>
                          {t(action.label)}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'applications' && (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{t(app.buildingName)}</h3>
                  <p className="text-xs text-gray-400">SBC {app.sbcType} · {t({ en: 'Submitted', ar: 'تاريخ التقديم' })}: {app.submittedDate} · {app.officer}</p>
                </div>
              </div>

              {/* Stage flow */}
              <div className="flex items-center gap-0 overflow-x-auto pb-1">
                {app.stages.map((st, i) => (
                  <div key={st.id} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[90px]">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${STAGE_STATUS[st.status]}`}>
                        {st.status === 'complete' ? '✓' : i + 1}
                      </div>
                      <div className="text-[10px] text-center text-gray-500 mt-1 leading-tight">{t(st.label)}</div>
                    </div>
                    {i < app.stages.length - 1 && (
                      <div className={`h-0.5 w-6 flex-shrink-0 ${st.status === 'complete' ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  {t({ en: 'Approve Stage', ar: 'الموافقة على المرحلة' })}
                </button>
                <button className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50">
                  {t({ en: 'Request Info', ar: 'طلب معلومات' })}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
