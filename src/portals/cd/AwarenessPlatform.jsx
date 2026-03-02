import { useState } from 'react'
import { cdCampaigns, lessonsLearned, contentLibrary } from '../../data/cdData'
import { Megaphone, BookOpen, Library, FileText, Video, Image, Mail, FileCheck, Plus, X, ChevronDown, ChevronUp, BarChart3, Eye, EyeOff } from 'lucide-react'

const CAMPAIGN_STATUS = {
  active:    'bg-green-100 text-green-700 border-green-200',
  planned:   'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
}

const CONTENT_ICONS = {
  video:           Video,
  guide:           FileText,
  infographic:     Image,
  drill:           FileCheck,
  newsletter:      Mail,
  'case-study':    BookOpen,
}

// ── New Campaign Modal ─────────────────────────────────────────────────────────
function NewCampaignModal({ onClose, onSave, t }) {
  const [form, setForm] = useState({ nameEn: '', nameAr: '', audience: [], channels: [], start: '', end: '', reach: '', status: 'Draft' })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleArr = (k, v) => setF(k, form[k].includes(v) ? form[k].filter(x => x !== v) : [...form[k], v])

  const AUDIENCES = ['Building Owners', 'Residents', 'Students', 'BSOs', 'General Public']
  const CHANNELS  = ['SMS', 'Email', 'TV', 'Social Media', 'In-App', 'Print']
  const STATUSES  = ['Draft', 'Active', 'Planned']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="font-bold text-gray-900">{t({ en: 'New Awareness Campaign', ar: 'حملة توعوية جديدة' })}</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Campaign Name (EN)', ar: 'اسم الحملة (EN)' })}</label>
              <input value={form.nameEn} onChange={e => setF('nameEn', e.target.value)} placeholder="e.g. Fire Exit Awareness"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div dir="rtl">
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Campaign Name (AR)', ar: 'اسم الحملة (AR)' })}</label>
              <input value={form.nameAr} onChange={e => setF('nameAr', e.target.value)} placeholder="مثال: توعية مخارج الطوارئ"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({ en: 'Target Audience', ar: 'الجمهور المستهدف' })}</label>
            <div className="flex flex-wrap gap-1.5">
              {AUDIENCES.map(a => (
                <button key={a} onClick={() => toggleArr('audience', a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.audience.includes(a) ? 'bg-[#991B1B] border-[#991B1B] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{a}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t({ en: 'Channels', ar: 'القنوات' })}</label>
            <div className="flex flex-wrap gap-1.5">
              {CHANNELS.map(c => (
                <button key={c} onClick={() => toggleArr('channels', c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.channels.includes(c) ? 'bg-[#1B2F5B] border-[#1B2F5B] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Start Date', ar: 'تاريخ البدء' })}</label>
              <input type="date" value={form.start} onChange={e => setF('start', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'End Date', ar: 'تاريخ الانتهاء' })}</label>
              <input type="date" value={form.end} onChange={e => setF('end', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Target Reach', ar: 'الوصول المستهدف' })}</label>
              <input type="number" value={form.reach} onChange={e => setF('reach', e.target.value)} placeholder="10000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{t({ en: 'Status', ar: 'الحالة' })}</label>
              <select value={form.status} onChange={e => setF('status', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">{t({ en: 'Cancel', ar: 'إلغاء' })}</button>
          <button onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800">{t({ en: 'Create Campaign', ar: 'إنشاء الحملة' })}</button>
        </div>
      </div>
    </div>
  )
}

// ── Publish Toggle Modal ─────────────────────────────────────────────────────
function PublishModal({ visibility, onConfirm, onClose, t }) {
  const next = visibility === 'internal' ? 'public' : 'internal'
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
        {next === 'public' ? <Eye className="w-10 h-10 text-blue-500 mx-auto mb-3" /> : <EyeOff className="w-10 h-10 text-gray-400 mx-auto mb-3" />}
        <div className="font-bold text-gray-900 mb-2">{t({ en: `Change visibility to ${next.toUpperCase()}?`, ar: `تغيير الظهور إلى ${next === 'public' ? 'عام' : 'داخلي'}؟` })}</div>
        <p className="text-sm text-gray-500 mb-5">
          {next === 'public'
            ? t({ en: 'This lesson learned will be visible to the public portal and partner agencies.', ar: 'ستكون هذه الدروس المستفادة مرئية للبوابة العامة والجهات الشريكة.' })
            : t({ en: 'This lesson learned will only be visible to Civil Defense staff.', ar: 'ستكون هذه الدروس المستفادة مرئية لموظفي الدفاع المدني فقط.' })
          }
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">{t({ en: 'Cancel', ar: 'إلغاء' })}</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-[#1B2F5B] text-white text-sm font-bold">{t({ en: 'Confirm', ar: 'تأكيد' })}</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AwarenessPlatform({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [campaigns, setCampaigns] = useState(cdCampaigns)
  const [lessons, setLessons]     = useState(lessonsLearned)
  const [expanded, setExpanded]   = useState(null)
  const [showNewCamp, setShowNewCamp] = useState(false)
  const [publishTarget, setPublishTarget] = useState(null) // { lessonId, visibility }

  const addCampaign = (form) => {
    const nc = {
      id: `CAMP-${Date.now()}`,
      name: { en: form.nameEn || 'New Campaign', ar: form.nameAr || 'حملة جديدة' },
      status: form.status.toLowerCase(), reach: parseInt(form.reach) || 0,
      channels: form.channels.length, audience: form.audience,
      startDate: form.start, endDate: form.end,
    }
    setCampaigns(prev => [nc, ...prev])
    setShowNewCamp(false)
    addToast(t({ en: 'Campaign created successfully', ar: 'تم إنشاء الحملة بنجاح' }), 'success')
  }

  const togglePublish = (lessonId, currentVis) => {
    setPublishTarget({ lessonId, visibility: currentVis ?? 'internal' })
  }

  const confirmPublish = () => {
    const { lessonId, visibility } = publishTarget
    const next = visibility === 'internal' ? 'public' : 'internal'
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, published: next } : l))
    setPublishTarget(null)
    addToast(t({ en: `Lesson visibility changed to ${next}`, ar: `تم تغيير ظهور الدرس إلى ${next === 'public' ? 'عام' : 'داخلي'}` }), 'success')
  }

  const kpis = [
    { label: { en: 'Active Campaigns', ar: 'الحملات النشطة' }, value: campaigns.filter(c => c.status === 'active').length, color: 'text-green-600' },
    { label: { en: 'Total Reach', ar: 'إجمالي الوصول' },       value: campaigns.reduce((s, c) => s + (c.reach ?? 0), 0).toLocaleString(), color: 'text-blue-600' },
    { label: { en: 'Lessons Learned', ar: 'الدروس المستفادة' }, value: lessons.length,         color: 'text-purple-600' },
    { label: { en: 'Content Assets', ar: 'الأصول المحتوية' },  value: contentLibrary.reduce((s, item) => s + item.count, 0), color: 'text-gray-900' },
  ]

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#D97706]" />
          {t({ en: 'Awareness Platform', ar: 'منصة التوعية' })}
        </h1>
        <button onClick={() => setShowNewCamp(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-sm font-bold hover:bg-red-800">
          <Plus className="w-4 h-4" />{t({ en: 'New Campaign', ar: 'حملة جديدة' })}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{t(k.label)}</div>
            <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'Campaigns', ar: 'الحملات' })}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {campaigns.map(c => {
            const statusStyle = CAMPAIGN_STATUS[c.status] ?? CAMPAIGN_STATUS.planned
            return (
              <div key={c.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{t(c.name)}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${statusStyle}`}>{c.status}</span>
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  {c.reach > 0 && <div>{t({ en: 'Reach', ar: 'الوصول' })}: <strong className="text-gray-800">{c.reach.toLocaleString()}</strong></div>}
                  {c.startDate && <div>{c.startDate} → {c.endDate ?? '—'}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'Lessons Learned', ar: 'الدروس المستفادة' })}</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {lessons.map(lesson => {
            const isExp = expanded === lesson.id
            const vis = lesson.published ?? 'internal'
            return (
              <div key={lesson.id}>
                {/* Row header */}
                <div className="px-5 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(isExp ? null : lesson.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{t(lesson.title ?? lesson.incidentRef ?? { en: lesson.id, ar: lesson.id })}</div>
                    <div className="text-xs text-gray-400">{lesson.incidentRef} · {lesson.date}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${vis === 'public' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {vis}
                  </span>
                  {isExp ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>

                {/* Expanded */}
                {isExp && (
                  <div className="px-5 pb-5 space-y-4 bg-gray-50 border-t border-gray-100">
                    {/* 5-Whys */}
                    {lesson.whys && (
                      <div>
                        <div className="font-semibold text-gray-700 text-sm mt-4 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-500" />
                          {t({ en: '5-Whys Analysis', ar: 'تحليل الـ5 لماذا' })}
                        </div>
                        <div className="space-y-2">
                          {lesson.whys.map((why, i) => {
                            const isRoot = i === lesson.whys.length - 1
                            return (
                              <div key={i} className={`flex gap-2 ${isRoot ? '' : ''}`}>
                                <div className="flex flex-col items-center flex-shrink-0">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isRoot ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
                                    {i + 1}
                                  </div>
                                  {i < lesson.fiveWhys.length - 1 && <div className="flex-1 w-0.5 bg-gray-200 my-0.5 min-h-[8px]" />}
                                </div>
                                <div className={`flex-1 pb-2 ${isRoot ? 'border border-red-200 rounded-xl p-3 bg-red-50' : ''}`}>
                                  <div className={`text-xs font-bold mb-0.5 ${isRoot ? 'text-red-700' : 'text-gray-500'}`}>
                                    {isRoot ? t({ en: 'Root Cause', ar: 'السبب الجذري' }) : `${t({ en: 'Why', ar: 'لماذا' })} ${i + 1}`}
                                  </div>
                                  <div className={`text-xs ${isRoot ? 'text-red-800 font-semibold' : 'text-gray-700'}`}>{t(why.question ?? why)}</div>
                                  {why.answer && <div className="text-xs text-gray-500 mt-0.5 italic">{t(why.answer)}</div>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Corrective actions */}
                    {lesson.correctiveAction && (
                      <div>
                        <div className="font-semibold text-gray-700 text-sm mb-2">{t({ en: 'Corrective Actions', ar: 'الإجراءات التصحيحية' })}</div>
                        <label className="flex items-start gap-2 cursor-pointer group">
                          <input type="checkbox" className="mt-0.5 accent-green-600 flex-shrink-0" />
                          <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">{t(lesson.correctiveAction)}</span>
                        </label>
                      </div>
                    )}

                    {/* Policy link */}
                    {lesson.policyUpdateTriggered && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2 text-xs">
                        <FileCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-blue-700">{t({ en: 'Policy Update Triggered', ar: 'تم تفعيل تحديث السياسة' })}</div>
                          <div className="text-blue-600">{t(lesson.correctiveAction)}</div>
                        </div>
                      </div>
                    )}

                    {/* Publish toggle */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <span className="text-xs text-gray-500">{t({ en: 'Visibility', ar: 'الظهور' })}:</span>
                      <button onClick={() => togglePublish(lesson.id, vis)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          vis === 'public' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}>
                        {vis === 'public' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {vis === 'public' ? t({ en: 'Public', ar: 'عام' }) : t({ en: 'Internal Only', ar: 'داخلي فقط' })}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Library */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t({ en: 'Content Library', ar: 'مكتبة المحتوى' })}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-y divide-gray-50">
          {contentLibrary.map(item => {
            const Icon = CONTENT_ICONS[item.type] ?? Library
            return (
              <div key={item.type} className="p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Icon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <div className="text-xl font-bold font-mono text-gray-900">{item.count}</div>
                <div className="text-[10px] text-gray-400 capitalize mt-0.5">{t(item.label)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* New campaign modal */}
      {showNewCamp && <NewCampaignModal onClose={() => setShowNewCamp(false)} onSave={addCampaign} t={t} />}

      {/* Publish confirmation modal */}
      {publishTarget && (
        <PublishModal
          visibility={publishTarget.visibility}
          onConfirm={confirmPublish}
          onClose={() => setPublishTarget(null)}
          t={t}
        />
      )}
    </div>
  )
}
