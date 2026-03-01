import { cdCampaigns, lessonsLearned, contentLibrary } from '../../data/cdData'
import { Megaphone, BookOpen, Library, FileText, Video, Image, Mail, FileCheck } from 'lucide-react'

const CAMPAIGN_STATUS = {
  active:    'bg-green-100 text-green-800 border-green-200',
  planned:   'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
}

const ICON_MAP = { FileText, Video, Image, BookOpen, Mail, FileCheck }

const PUBLISHED_STYLE = {
  public:   'bg-green-100 text-green-800',
  internal: 'bg-gray-100 text-gray-700',
}

export default function AwarenessPlatform({ t, lang }) {
  const isRTL = lang === 'ar'

  const totalReach = cdCampaigns.reduce((s, c) => s + c.reach, 0)

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Awareness Platform', ar: 'منصة التوعية الوقائية' })}</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: { en: 'Active Campaigns', ar: 'حملات نشطة' }, value: cdCampaigns.filter(c => c.status === 'active').length },
          { label: { en: 'Total Reach', ar: 'إجمالي الوصول' }, value: (totalReach / 1000000).toFixed(1) + 'M' },
          { label: { en: 'Lessons Learned', ar: 'دروس مستفادة' }, value: lessonsLearned.length },
          { label: { en: 'Content Assets', ar: 'أصول المحتوى' }, value: 103 },
        ].map((k, i) => (
          <div key={i} className="kpi-tile">
            <span className="text-xs text-gray-500">{t(k.label)}</span>
            <span className="text-2xl font-bold text-gray-900 ltr-num">{k.value}</span>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div>
        <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#D97706]" />
          {t({ en: 'Campaign Management', ar: 'إدارة الحملات' })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cdCampaigns.map(c => (
            <div key={c.id} className={`bg-white rounded-xl border-2 shadow-sm p-4 ${CAMPAIGN_STATUS[c.status] ?? 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-sm text-gray-900 flex-1">{t(c.name)}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${CAMPAIGN_STATUS[c.status]}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{t(c.target)}</p>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-400">{t({ en: 'Reach', ar: 'الوصول' })}</div>
                  <div className="font-bold text-gray-900 text-sm ltr-num">
                    {c.reach > 0 ? c.reach.toLocaleString() : t({ en: 'Not started', ar: 'لم يبدأ' })}
                  </div>
                  {c.targetReach && (
                    <div className="text-[10px] text-gray-400">{t({ en: 'Target', ar: 'الهدف' })}: {c.targetReach.toLocaleString()}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.channels.map((ch, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">{ch}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Learned */}
      <div>
        <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#D97706]" />
          {t({ en: 'Lessons Learned — 5-Whys Analysis', ar: 'الدروس المستفادة — تحليل 5 لماذا' })}
        </h2>
        <div className="space-y-4">
          {lessonsLearned.map(ll => (
            <div key={ll.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{t(ll.title)}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{t({ en: 'Incident Ref', ar: 'مرجع الحادث' })}: {ll.incidentRef}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${PUBLISHED_STYLE[ll.published]}`}>
                    {t({ public: { en: 'Public', ar: 'عام' }, internal: { en: 'Internal', ar: 'داخلي' } }[ll.published])}
                  </span>
                  {ll.policyUpdateTriggered && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#0891B2]/10 text-[#0891B2]">
                      {t({ en: 'Policy Updated', ar: 'سياسة محدّثة' })}
                    </span>
                  )}
                </div>
              </div>

              {/* 5-Whys chain */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">{t({ en: 'Root Cause Chain (5-Whys)', ar: 'سلسلة السبب الجذري (5 لماذا)' })}</div>
                <div className="space-y-1.5">
                  {ll.whys.map((w, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="text-amber-600 font-bold flex-shrink-0">{i + 1}.</span>
                      <span className="text-gray-700">{t(w)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corrective action */}
              <div className="p-3 bg-green-50 rounded-xl">
                <div className="text-[10px] font-semibold text-green-700 mb-1">{t({ en: 'Corrective Action Taken', ar: 'الإجراء التصحيحي المتخذ' })}</div>
                <p className="text-xs text-green-900">{t(ll.correctiveAction)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Library */}
      <div>
        <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <Library className="w-4 h-4 text-[#D97706]" />
          {t({ en: 'Content Library', ar: 'مكتبة المحتوى' })}
          <span className="ms-auto text-xs text-gray-400">{t({ en: '103 assets', ar: '103 أصل' })}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {contentLibrary.map(item => {
            const Icon = ICON_MAP[item.icon] ?? FileText
            return (
              <div key={item.type} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#D97706]" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{item.count}</div>
                <div className="text-[10px] text-gray-500 leading-tight mb-2">{t(item.label)}</div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  item.access === 'public' ? 'bg-green-100 text-green-800' :
                  item.access === 'restricted' ? 'bg-red-100 text-red-800' :
                  item.access === 'subscribers' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>{item.access}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
