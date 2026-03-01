import { cdTrainingPrograms, leaderboard } from '../../data/cdData'
import { Users, Trophy, BookOpen, Calendar } from 'lucide-react'

const MODALITY = {
  VR:  { cls: 'bg-purple-100 text-purple-800', label: 'VR' },
  AR:  { cls: 'bg-indigo-100 text-indigo-800', label: 'AR' },
  SIM: { cls: 'bg-blue-100 text-blue-800',     label: 'SIM' },
  AI:  { cls: 'bg-amber-100 text-amber-800',   label: 'AI' },
}

const drillCalendar = [
  { date: '2025-02-10', type: 'AI', team: { en: 'All BSOs — Foundation Program', ar: 'جميع BSOs — البرنامج الأساسي' }, trainer: 'Maj. Faisal Al-Dossari' },
  { date: '2025-02-15', type: 'VR', team: { en: 'High-Rise Certified Officers', ar: 'الضباط المعتمدون للأبراج' }, trainer: 'Capt. Ahmad Al-Zahrani' },
  { date: '2025-02-22', type: 'AR', team: { en: 'HAZMAT Unit', ar: 'وحدة المواد الخطرة' }, trainer: 'Lt. Khalid Al-Harbi' },
  { date: '2025-02-28', type: 'SIM', team: { en: 'Station Commanders', ar: 'قادة المحطات' }, trainer: 'Maj. Faisal Al-Dossari' },
  { date: '2025-03-01', type: 'AI', team: { en: 'CD Inspectors + Senior BSOs', ar: 'مفتشو CD + كبار BSOs' }, trainer: 'Capt. Ahmad Al-Zahrani' },
]

export default function Training({ t, lang }) {
  const isRTL = lang === 'ar'

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900">{t({ en: 'Training & Simulation', ar: 'التدريب ومحاكاة الطوارئ' })}</h1>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: { en: 'Active Programs', ar: 'برامج نشطة' }, value: cdTrainingPrograms.length },
          { label: { en: 'Total Enrolled', ar: 'إجمالي المسجلين' }, value: cdTrainingPrograms.reduce((s, p) => s + p.enrolled, 0) },
          { label: { en: 'Total Completed', ar: 'إجمالي المكتملين' }, value: cdTrainingPrograms.reduce((s, p) => s + p.completed, 0) },
          { label: { en: 'Avg Completion', ar: 'متوسط الإكمال' }, value: `${Math.round(cdTrainingPrograms.reduce((s, p) => s + p.completed / p.enrolled * 100, 0) / cdTrainingPrograms.length)}%` },
        ].map((k, i) => (
          <div key={i} className="kpi-tile">
            <span className="text-xs text-gray-500">{t(k.label)}</span>
            <span className="text-2xl font-bold text-gray-900">{k.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Training Programs */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#DC2626]" />
            {t({ en: 'Active Programs', ar: 'البرامج النشطة' })}
          </h2>
          {cdTrainingPrograms.map(p => {
            const pct = Math.round(p.completed / p.enrolled * 100)
            const m = MODALITY[p.modality] ?? MODALITY.AI
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{t(p.name)}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{t(p.target)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${m.cls}`}>{m.label}</span>
                </div>

                <div className="flex items-center gap-3 mb-2 text-xs text-gray-500">
                  <span><Users className="w-3 h-3 inline me-1" />{p.enrolled}</span>
                  <span className="text-gray-300">·</span>
                  <span>{p.completed} {t({ en: 'completed', ar: 'مكتمل' })}</span>
                  <span className="text-gray-300">·</span>
                  <span>{pct}%</span>
                </div>

                {/* Progress */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? 'bg-green-500' : pct > 60 ? 'bg-[#1A6B3A]' : 'bg-amber-400'}`}
                    style={{ width: `${pct}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{t({ en: 'Validity', ar: 'مدة الصلاحية' })}: {t(p.certValidity)}</span>
                  <span className="text-gray-500">{t({ en: 'Next', ar: 'التالي' })}: {p.nextSession}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leaderboard + Drill Calendar */}
        <div className="space-y-5">
          {/* Leaderboard */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#C5A028]" />
              {t({ en: 'Team Leaderboard', ar: 'قائمة الفرق المتصدرة' })}
            </h2>
            <div className="space-y-2">
              {leaderboard.map(entry => (
                <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl ${entry.rank === 1 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    entry.rank === 1 ? 'bg-[#C5A028] text-white' :
                    entry.rank === 2 ? 'bg-gray-400 text-white' :
                    entry.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{entry.rank}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{t(entry.team)}</div>
                    <div className="text-xs text-gray-400">{entry.drills} {t({ en: 'drills', ar: 'تدريب' })}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-[#1B2F5B]">{entry.score}</span>
                    <span className={`text-xs ${entry.improvement === 'up' ? 'text-green-500' : 'text-gray-400'}`}>
                      {entry.improvement === 'up' ? '↑' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drill Calendar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#DC2626]" />
              {t({ en: 'Drill Calendar', ar: 'تقويم التدريبات' })}
            </h2>
            <div className="space-y-2">
              {drillCalendar.map((d, i) => {
                const m = MODALITY[d.type] ?? MODALITY.AI
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="text-center min-w-[40px]">
                      <div className="text-[10px] text-gray-400">{d.date.split('-')[1]}/{d.date.split('-')[0]}</div>
                      <div className="font-bold text-gray-900 text-sm">{d.date.split('-')[2]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{t(d.team)}</div>
                      <div className="text-xs text-gray-400">{d.trainer}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${m.cls}`}>{d.type}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
