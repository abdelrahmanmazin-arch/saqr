import { useState } from 'react'
import { cdLicenses, licenseApplications } from '../../data/cdData'
import StatusBadge from '../../components/StatusBadge'
import RiskBadge from '../../components/RiskBadge'
import { FileCheck, X, CheckCircle2, Upload, MessageSquare } from 'lucide-react'

const APP_STAGES = [
  { id: 'doc-review',       label: { en: 'Document Review',  ar: 'مراجعة الوثائق'   } },
  { id: 'site-inspection',  label: { en: 'Site Inspection',  ar: 'الفحص الموقعي'   } },
  { id: 'compliance-check', label: { en: 'Compliance Check', ar: 'فحص الامتثال'    } },
  { id: 'final-approval',   label: { en: 'Final Approval',   ar: 'الموافقة النهائية' } },
  { id: 'license-issued',   label: { en: 'License Issued',   ar: 'صدر الترخيص'     } },
]

const STAGE_DETAILS = {
  'doc-review': {
    officer: 'Sara Al-Zahrani', dueDate: '2025-01-15', status: 'complete',
    docs: [
      { name: { en: 'Trade License', ar: 'الرخصة التجارية' }, uploaded: true },
      { name: { en: 'Building Permit', ar: 'تصريح البناء' }, uploaded: true },
    ],
    comments: [{ by: 'Sara', msg: { en: 'All documents verified. Proceeding to site inspection.', ar: 'تم التحقق من جميع الوثائق.' }, time: '2025-01-14 09:12' }],
  },
  'site-inspection': {
    officer: 'Mohammed Al-Harbi', dueDate: '2025-01-25', status: 'in-progress',
    docs: [
      { name: { en: 'Site Photos (all floors)', ar: 'صور الموقع' }, uploaded: false },
      { name: { en: 'Fire System Report', ar: 'تقرير نظام الإطفاء' }, uploaded: true },
    ],
    comments: [{ by: 'Mohammed', msg: { en: 'Scheduled for 2025-01-22. Inspector: Ahmed Siddiqui.', ar: 'مقرر 2025-01-22. المفتش: أحمد صديقي.' }, time: '2025-01-16 14:30' }],
  },
  'compliance-check': { officer: 'Fatima Al-Otaibi', dueDate: '2025-02-05', status: 'pending', docs: [], comments: [] },
  'final-approval':   { officer: 'Director Khalid',  dueDate: '2025-02-15', status: 'pending', docs: [], comments: [] },
  'license-issued':   { officer: 'System',           dueDate: '—',          status: 'pending', docs: [], comments: [] },
}

function ApplicationCard({ app, t, lang, addToast }) {
  const [selectedStage, setSelectedStage] = useState(null)
  const currentIdx = APP_STAGES.findIndex(s => s.id === (app.currentStage ?? 'site-inspection'))
  const detail = selectedStage ? STAGE_DETAILS[selectedStage] : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-2">
        <div>
          <div className="font-bold text-gray-900">{t(app.buildingName ?? { en: app.id, ar: app.id })}</div>
          <div className="text-xs text-gray-400 mt-0.5">{app.id} · SBC {app.sbcType}</div>
        </div>
        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
          {t({ en: 'Pending', ar: 'معلق' })}
        </span>
      </div>

      {/* Stage tracker */}
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex items-center">
          {APP_STAGES.map((stage, i) => {
            const isDone = i < currentIdx, isCur = i === currentIdx
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full cursor-pointer group"
                  onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all group-hover:scale-110 ${
                    isDone ? 'bg-green-500 border-green-500 text-white' :
                    isCur  ? 'bg-[#0891B2] border-[#0891B2] text-white ring-4 ring-blue-100' :
                             'bg-white border-gray-200 text-gray-400'
                  } ${selectedStage === stage.id ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className={`text-[9px] mt-1 text-center leading-tight font-medium px-1 ${isCur ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                    {t(stage.label)}
                  </div>
                </div>
                {i < APP_STAGES.length - 1 && <div className={`h-0.5 flex-1 -mt-3 mx-0.5 ${isDone ? 'bg-green-400' : 'bg-gray-100'}`} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage detail panel */}
      {selectedStage && detail && (
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-800 text-sm">{t(APP_STAGES.find(s => s.id === selectedStage)?.label ?? { en: '', ar: '' })}</div>
            <button onClick={() => setSelectedStage(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[['Officer', detail.officer], ['Due', detail.dueDate], ['Status', detail.status]].map(([k, v]) => (
              <div key={k}><div className="text-gray-400 mb-0.5">{k}</div><div className="font-semibold text-gray-800">{v}</div></div>
            ))}
          </div>
          {detail.docs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-gray-500">{t({ en: 'Documents', ar: 'الوثائق' })}</div>
              {detail.docs.map((doc, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${doc.uploaded ? 'bg-green-50 border border-green-100' : 'bg-white border border-dashed border-gray-200'}`}>
                  <span className="text-xs text-gray-700">{t(doc.name)}</span>
                  {doc.uploaded
                    ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                    : <label className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold cursor-pointer">
                        <Upload className="w-3 h-3" />{t({ en: 'Upload', ar: 'رفع' })}
                        <input type="file" className="hidden" onChange={() => addToast(t({ en: 'Document uploaded', ar: 'تم رفع الوثيقة' }), 'success')} />
                      </label>
                  }
                </div>
              ))}
            </div>
          )}
          {detail.comments.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />{t({ en: 'Comments', ar: 'التعليقات' })}
              </div>
              {detail.comments.map((c, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-lg p-2.5 text-xs">
                  <div className="text-gray-400 mb-0.5">{c.by} · {c.time}</div>
                  <div className="text-gray-800">{t(c.msg)}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => addToast(t({ en: 'Stage approved', ar: 'تمت الموافقة' }), 'success')}
              className="flex-1 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700">
              {t({ en: 'Approve', ar: 'موافقة' })}
            </button>
            <button onClick={() => addToast(t({ en: 'Rejection recorded', ar: 'تم الرفض' }), 'error')}
              className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100">
              {t({ en: 'Reject', ar: 'رفض' })}
            </button>
            <button onClick={() => addToast(t({ en: 'More info requested', ar: 'طُلبت معلومات إضافية' }), 'info')}
              className="flex-1 py-2 rounded-xl border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-50">
              {t({ en: 'More Info', ar: 'معلومات' })}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DigitalLicensing({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [licenses, setLicenses] = useState(cdLicenses)
  const [tab, setTab]           = useState('registry')

  const simulateExpiry = (id) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'expired', riskScore: Math.min(100, (l.riskScore ?? 50) + 15) } : l))
    addToast(t({ en: 'License expired — owner notified, risk score penalized', ar: 'انتهى الترخيص — تم إخطار المالك وتطبيق الغرامة' }), 'warning')
    addToast(t({ en: 'Building added to inspection priority queue', ar: 'أضيف المبنى لأولوية طابور الفحص' }), 'info')
  }

  const kpis = [
    { label: { en: 'Active', ar: 'نشط' },         value: licenses.filter(l => l.status === 'active').length,     color: 'text-green-600' },
    { label: { en: 'Expiring', ar: 'ينتهي' },     value: licenses.filter(l => l.status === 'expiring').length,   color: 'text-amber-600' },
    { label: { en: 'Expired', ar: 'منتهي' },      value: licenses.filter(l => l.status === 'expired').length,    color: 'text-red-600' },
    { label: { en: 'SLA Breach', ar: 'خرق SLA' }, value: licenses.filter(l => l.status === 'sla-breach').length, color: 'text-red-900' },
  ]

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-[#0891B2]" />
        {t({ en: 'Digital Licensing', ar: 'التراخيص الرقمية' })}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{t(k.label)}</div>
            <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ id: 'registry', label: { en: 'License Registry', ar: 'سجل التراخيص' } }, { id: 'applications', label: { en: 'Applications', ar: 'الطلبات' } }].map(t_ => (
          <button key={t_.id} onClick={() => setTab(t_.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t_.id ? 'bg-white text-[#0891B2] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t(t_.label)}
          </button>
        ))}
      </div>

      {tab === 'registry' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-xs text-gray-500">
                <th className="px-4 py-3 text-start font-medium">{t({ en: 'Building', ar: 'المبنى' })}</th>
                <th className="px-4 py-3 text-center font-medium">{t({ en: 'Status', ar: 'الحالة' })}</th>
                <th className="px-4 py-3 text-center font-medium">{t({ en: 'Expiry', ar: 'الانتهاء' })}</th>
                <th className="px-4 py-3 text-center font-medium">{t({ en: 'Risk', ar: 'المخاطر' })}</th>
                <th className="px-4 py-3 text-center font-medium">{t({ en: 'Actions', ar: 'الإجراءات' })}</th>
              </tr></thead>
              <tbody>
                {licenses.map(lic => (
                  <tr key={lic.id} className={`border-t border-gray-50 hover:bg-gray-50 ${lic.status === 'expired' || lic.status === 'sla-breach' ? 'border-l-4 border-red-400' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{t(lic.buildingName ?? { en: lic.id, ar: lic.id })}</div>
                      <div className="text-[10px] text-gray-400">{lic.id}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lic.status === 'active'     ? 'bg-green-100 text-green-700' :
                        lic.status === 'expiring'   ? 'bg-amber-100 text-amber-700' :
                        lic.status === 'expired'    ? 'bg-red-100 text-red-700' :
                        'bg-red-900 text-white'
                      }`}>{lic.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-mono text-gray-600">{lic.expiryDate ?? '—'}</td>
                    <td className="px-4 py-3 text-center"><RiskBadge score={lic.riskScore ?? 50} showScore size="sm" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {lic.status === 'active' && (
                          <button onClick={() => simulateExpiry(lic.id)}
                            className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold hover:bg-amber-200">
                            {t({ en: 'Simulate Expiry', ar: 'محاكاة انتهاء' })}
                          </button>
                        )}
                        {(lic.status === 'expired' || lic.status === 'sla-breach') && (
                          <button onClick={() => addToast(t({ en: 'Enforcement scheduled', ar: 'جدولة التطبيق' }), 'warning')}
                            className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-[10px] font-bold hover:bg-red-200">
                            {t({ en: 'Enforce', ar: 'تطبيق' })}
                          </button>
                        )}
                        {lic.status === 'expiring' && (
                          <button onClick={() => addToast(t({ en: 'Renewal scheduled', ar: 'جدولة التجديد' }), 'info')}
                            className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold hover:bg-blue-200">
                            {t({ en: 'Schedule Renewal', ar: 'جدولة تجديد' })}
                          </button>
                        )}
                        <button className="px-2 py-1 rounded-lg border border-gray-200 text-gray-500 text-[10px] font-bold hover:bg-gray-50">
                          {t({ en: 'View', ar: 'عرض' })}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'applications' && (
        <div className="space-y-4">
          {licenseApplications.map(app => (
            <ApplicationCard key={app.id} app={app} t={t} lang={lang} addToast={addToast} />
          ))}
        </div>
      )}
    </div>
  )
}
