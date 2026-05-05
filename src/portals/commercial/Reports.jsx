import { useState } from 'react'
import { FileText, Download, TrendingUp, TrendingDown, ChevronRight, X } from 'lucide-react'

const SURFACE = '#FFFFFF'
const ELEVATED = '#F7F5F2'
const BORDER = 'rgba(0,0,0,0.07)'
const GOLD = '#1E3A5F'
const TEXT_PRIMARY = '#18181B'
const TEXT_SECONDARY = '#52525B'

const TYPE_LABEL = {
  'monthly-risk':        { en: 'Monthly Risk Report', ar: 'تقرير المخاطر الشهري' },
  'quarterly-compliance': { en: 'Quarterly Compliance', ar: 'الامتثال الفصلي' },
  'annual-audit':        { en: 'Annual Audit', ar: 'التدقيق السنوي' },
  'incident-analysis':   { en: 'Incident Analysis', ar: 'تحليل الحادثة' },
}

export default function Reports({ t, lang, isRTL, buildings, reports, addToast }) {
  const [preview, setPreview] = useState(null)

  function download(report) {
    addToast(t({ en: `Downloading ${t(report.title)}…`, ar: `جارٍ تنزيل ${t(report.title)}…` }), 'info', 3000)
  }

  return (
    <div className="p-6 space-y-4">
      <div style={{ color: '#9CA3AF' }} className="text-xs font-semibold uppercase tracking-wider">
        {t({ en: 'Auto-Generated Reports', ar: 'التقارير المولَّدة تلقائياً' })}
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-8 text-center" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No reports available', ar: 'لا توجد تقارير متاحة' })}</div>
        ) : (
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {reports.map(rpt => {
              const bld = buildings.find(b => b.id === rpt.buildingId)
              const improved = rpt.trend === 'improved'
              const typeLabel = TYPE_LABEL[rpt.type] || { en: rpt.type, ar: rpt.type }
              return (
                <div key={rpt.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText size={16} style={{ color: GOLD, marginTop: 2, flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{t(rpt.title)}</div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">
                          {t(typeLabel)} · {rpt.pages} {t({ en: 'pages', ar: 'صفحة' })} · {rpt.generatedDate}
                          {bld && ` · ${t(bld.name)}`}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span style={{ color: TEXT_SECONDARY }} className="text-xs ltr-num">{rpt.scoreStart}</span>
                          <span style={{ color: TEXT_SECONDARY }} className="text-xs">→</span>
                          <span style={{ color: improved ? '#22C55E' : '#EF4444', fontWeight: 600 }} className="text-xs ltr-num">{rpt.scoreEnd}</span>
                          {improved ? <TrendingDown size={12} style={{ color: '#22C55E' }} /> : <TrendingUp size={12} style={{ color: '#EF4444' }} />}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPreview(rpt)}
                        style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}
                        className="text-xs px-2.5 py-1 rounded-lg hover:text-[#F9FAFB] transition-colors"
                      >
                        {t({ en: 'Preview', ar: 'معاينة' })}
                      </button>
                      <button
                        onClick={() => download(rpt)}
                        style={{ color: GOLD, border: `1px solid ${GOLD}` }}
                        className="p-1.5 rounded-lg"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Inline Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreview(null)} />
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, maxWidth: 560, width: '100%', maxHeight: '80vh', zIndex: 1 }} className="rounded-xl flex flex-col overflow-hidden">
            <div style={{ borderBottom: `1px solid ${BORDER}` }} className="p-4 flex items-center justify-between">
              <div>
                <div style={{ color: TEXT_PRIMARY }} className="font-semibold text-sm">{t(preview.title)}</div>
                <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">{preview.generatedDate} · {preview.pages} {t({ en: 'pages', ar: 'صفحة' })}</div>
              </div>
              <button onClick={() => setPreview(null)} style={{ color: TEXT_SECONDARY }}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Mock report content */}
              <div style={{ background: ELEVATED, border: `1px solid ${BORDER}` }} className="rounded-lg p-3">
                <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase mb-2">{t({ en: 'Executive Summary', ar: 'الملخص التنفيذي' })}</div>
                <div style={{ color: TEXT_PRIMARY }} className="text-sm">
                  {t({
                    en: `Risk score moved from ${preview.scoreStart} to ${preview.scoreEnd} over the reporting period. ${preview.trend === 'improved' ? 'Overall safety posture improved.' : 'Risk elevation requires attention.'}`,
                    ar: `تحرك مؤشر المخاطر من ${preview.scoreStart} إلى ${preview.scoreEnd} خلال فترة التقرير. ${preview.trend === 'improved' ? 'تحسّن الوضع العام للسلامة.' : 'يتطلب ارتفاع المخاطر الاهتمام.'}`,
                  })}
                </div>
              </div>
              <div style={{ background: ELEVATED, border: `1px solid ${BORDER}` }} className="rounded-lg p-3">
                <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase mb-2">{t({ en: 'Key Metrics', ar: 'المقاييس الرئيسية' })}</div>
                {[
                  { k: { en: 'Risk Score (Start)', ar: 'مؤشر المخاطر (البداية)' }, v: preview.scoreStart },
                  { k: { en: 'Risk Score (End)', ar: 'مؤشر المخاطر (النهاية)' }, v: preview.scoreEnd },
                  { k: { en: 'Change', ar: 'التغيير' }, v: `${preview.scoreEnd - preview.scoreStart > 0 ? '+' : ''}${preview.scoreEnd - preview.scoreStart}` },
                  { k: { en: 'Report Pages', ar: 'صفحات التقرير' }, v: preview.pages },
                ].map((row, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }} className="flex justify-between py-1.5 last:border-0">
                    <span style={{ color: TEXT_SECONDARY }} className="text-xs">{t(row.k)}</span>
                    <span style={{ color: TEXT_PRIMARY }} className="text-xs font-semibold ltr-num">{row.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: ELEVATED, border: `1px solid ${BORDER}` }} className="rounded-lg p-3">
                <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase mb-2">{t({ en: 'Recommendations', ar: 'التوصيات' })}</div>
                <ul className="space-y-1.5">
                  {[
                    { en: 'Review and renew all expiring licenses within 30 days.', ar: 'مراجعة وتجديد جميع التراخيص المنتهية خلال 30 يوماً.' },
                    { en: 'Prioritize overdue maintenance tasks to prevent score degradation.', ar: 'إعطاء الأولوية للمهام المتأخرة لمنع تدهور المؤشر.' },
                    { en: 'Schedule quarterly inspection with CD-approved vendors.', ar: 'جدولة الفحص الفصلي مع موردين معتمدين من الدفاع المدني.' },
                  ].map((rec, i) => (
                    <li key={i} style={{ color: TEXT_SECONDARY }} className="text-xs flex items-start gap-1.5">
                      <span style={{ color: GOLD }}>·</span>
                      {t(rec)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}` }} className="p-4 flex justify-end gap-2">
              <button onClick={() => setPreview(null)} style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }} className="px-4 py-1.5 rounded-lg text-sm">
                {t({ en: 'Close', ar: 'إغلاق' })}
              </button>
              <button onClick={() => { download(preview); setPreview(null) }} style={{ background: GOLD, color: 'white' }} className="px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                <Download size={13} />
                {t({ en: 'Download PDF', ar: 'تنزيل PDF' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
