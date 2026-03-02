import { useState } from 'react'
import { cdTrainingPrograms, leaderboard } from '../../data/cdData'
import { BookOpen, Trophy, Calendar, X, CheckCircle2, Award, Download } from 'lucide-react'

const MODALITY = {
  VR:  { cls: 'bg-purple-100 text-purple-700', label: 'VR Simulation' },
  AR:  { cls: 'bg-blue-100 text-blue-700',     label: 'Augmented Reality' },
  SIM: { cls: 'bg-orange-100 text-orange-700', label: 'Simulator' },
  AI:  { cls: 'bg-green-100 text-green-700',   label: 'AI-Driven' },
}

const RANK_STYLES = ['bg-yellow-400 text-yellow-900', 'bg-gray-300 text-gray-700', 'bg-orange-300 text-orange-900']

// Fake participants per program
function buildParticipants(progId) {
  return [
    { id: 'P001', name: 'Ahmed Al-Ghamdi',   role: 'CD Officer', enrolled: '2024-11-01', status: 'completed', score: 94, certId: `CERT-${progId}-001` },
    { id: 'P002', name: 'Nour Al-Rashid',    role: 'Commander',  enrolled: '2024-11-03', status: 'completed', score: 88, certId: `CERT-${progId}-002` },
    { id: 'P003', name: 'Sara Al-Zahrani',   role: 'BSO',        enrolled: '2024-11-10', status: 'in-progress', score: null, certId: null },
    { id: 'P004', name: 'Khalid Al-Otaibi',  role: 'CD Officer', enrolled: '2024-11-12', status: 'enrolled',   score: null, certId: null },
  ]
}

const UPCOMING_SESSIONS = [
  { date: '2025-02-10', time: '09:00', location: 'Riyadh Training Centre, Hall B', seats: 12 },
  { date: '2025-02-18', time: '13:00', location: 'Online — MDRE Simulator Platform', seats: 20 },
  { date: '2025-03-05', time: '09:00', location: 'Dammam Fire Academy', seats: 8 },
]

// ── Certificate Modal ─────────────────────────────────────────────────────────
function CertModal({ participant, program, onClose, t, addToast }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* Certificate header */}
        <div className="bg-gradient-to-br from-[#1B2F5B] to-[#0F1F3D] rounded-t-2xl p-6 text-white text-center">
          <div className="flex justify-center gap-4 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">MT</div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">CD</div>
          </div>
          <div className="text-[10px] tracking-widest text-white/60 mb-1">CERTIFICATE OF COMPLETION</div>
          <Award className="w-8 h-8 text-[#C5A028] mx-auto my-2" />
        </div>
        <div className="p-6 text-center space-y-3">
          <div className="text-lg font-bold text-gray-900">{participant.name}</div>
          <div className="text-sm text-gray-500">{t({ en: 'has successfully completed', ar: 'أتم بنجاح' })}</div>
          <div className="text-base font-semibold text-[#1B2F5B]">{t(program.name)}</div>
          <div className="text-xs text-gray-400">{t({ en: 'Issued by', ar: 'صادر عن' })}: Madani Tech × Civil Defense Authority</div>
          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs text-start">
            <div><div className="text-gray-400 mb-0.5">{t({ en: 'Score', ar: 'الدرجة' })}</div><div className="font-bold text-green-600">{participant.score}%</div></div>
            <div><div className="text-gray-400 mb-0.5">{t({ en: 'Cert ID', ar: 'رقم الشهادة' })}</div><div className="font-mono text-gray-800 text-[10px]">{participant.certId}</div></div>
            <div><div className="text-gray-400 mb-0.5">{t({ en: 'Issued', ar: 'تاريخ الإصدار' })}</div><div className="font-semibold">2024-12-15</div></div>
            <div><div className="text-gray-400 mb-0.5">{t({ en: 'Expires', ar: 'ينتهي في' })}</div><div className="font-semibold">2027-12-15</div></div>
          </div>
          {/* Fake QR code */}
          <div className="w-20 h-20 mx-auto border-4 border-[#1B2F5B] rounded-lg p-1.5 bg-white">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              {[0,1,2].map(r => [0,1,2].map(c => (
                (r + c) % 2 === 0
                  ? <rect key={`${r}${c}`} x={c*20+2} y={r*20+2} width="16" height="16" fill="#1B2F5B" rx="2" />
                  : null
              )))}
              <rect x="2" y="2"  width="26" height="26" fill="none" stroke="#991B1B" strokeWidth="2" rx="3" />
              <rect x="32" y="2" width="26" height="26" fill="none" stroke="#991B1B" strokeWidth="2" rx="3" />
              <rect x="2" y="32" width="26" height="26" fill="none" stroke="#991B1B" strokeWidth="2" rx="3" />
            </svg>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onClose(); addToast(t({ en: 'Certificate downloaded', ar: 'تم تنزيل الشهادة' }), 'success') }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B2F5B] text-white text-sm font-bold hover:bg-[#2A4480] transition-colors">
              <Download className="w-4 h-4" />{t({ en: 'Download PDF', ar: 'تنزيل PDF' })}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">
              {t({ en: 'Close', ar: 'إغلاق' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Booking Modal ──────────────────────────────────────────────────────────────
function BookingModal({ program, onClose, addToast, t }) {
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed && selected !== null) {
    const s = UPCOMING_SESSIONS[selected]
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <div className="font-bold text-gray-900 mb-1">{t({ en: 'Booking Confirmed!', ar: 'تأكيد الحجز!' })}</div>
          <div className="text-sm text-gray-500 mb-3">{s.date} · {s.time}</div>
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-start space-y-1">
            <div><strong>{t({ en: 'Location:', ar: 'الموقع:' })}</strong> {s.location}</div>
            <div><strong>{t({ en: 'What to bring:', ar: 'ما تحتاجه:' })}</strong> {t({ en: 'ID card, uniform, safety gear', ar: 'بطاقة هوية، زي رسمي، معدات سلامة' })}</div>
          </div>
          <button onClick={onClose} className="mt-4 px-6 py-2.5 rounded-xl bg-[#1B2F5B] text-white text-sm font-bold hover:bg-[#2A4480]">
            {t({ en: 'Done', ar: 'تم' })}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="font-bold text-gray-900">{t({ en: 'Book Appointment', ar: 'حجز موعد' })}</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="text-sm text-gray-500">{t({ en: 'Select a session:', ar: 'اختر جلسة:' })}</div>
          {UPCOMING_SESSIONS.map((s, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`w-full text-start p-3 rounded-xl border transition-all ${selected === i ? 'bg-blue-50 border-blue-300' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className="font-semibold text-gray-900 text-sm">{s.date} · {s.time}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.location}</div>
              <div className="text-xs text-green-600 mt-0.5">{s.seats} {t({ en: 'seats available', ar: 'مقعد متاح' })}</div>
            </button>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button onClick={() => { if (selected !== null) { setConfirmed(true); addToast(t({ en: 'Booking added to My Schedule', ar: 'أضيف الحجز لجدولي' }), 'success') } }}
            disabled={selected === null}
            className="w-full py-2.5 rounded-xl bg-[#1B2F5B] text-white text-sm font-bold hover:bg-[#2A4480] disabled:opacity-40 transition-colors">
            {t({ en: 'Confirm Booking', ar: 'تأكيد الحجز' })}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Program Detail Modal ────────────────────────────────────────────────────────
function ProgramDetail({ program, onClose, addToast, t, lang }) {
  const participants = buildParticipants(program.id)
  const [showBook, setShowBook]   = useState(false)
  const [showCert, setShowCert]   = useState(null) // participant

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="font-bold text-gray-900">{t(program.name)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${MODALITY[program.modality]?.cls ?? 'bg-gray-100 text-gray-700'}`}>
                {program.modality}
              </span>
              <span className="text-xs text-gray-400">{program.duration} · {t({ en: 'Cert valid', ar: 'صلاحية الشهادة' })}: {t(program.certValidity)}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{t(program.description ?? { en: 'Advanced fire safety training program.', ar: 'برنامج تدريبي متقدم في السلامة من الحرائق.' })}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              [t({ en: 'Enrolled', ar: 'مسجل' }), program.enrolled],
              [t({ en: 'Completed', ar: 'أكمل' }), program.completed],
              [t({ en: 'Pass Rate', ar: 'نسبة النجاح' }), `${Math.round((program.completed / Math.max(1, program.enrolled)) * 100)}%`],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">{k}</div>
                <div className="text-xl font-bold font-mono text-gray-900">{v}</div>
              </div>
            ))}
          </div>

          {/* Participants */}
          <div>
            <div className="font-semibold text-gray-800 text-sm mb-3">{t({ en: 'Enrolled Participants', ar: 'المشاركون المسجلون' })}</div>
            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.role} · {t({ en: 'Enrolled', ar: 'تاريخ التسجيل' })}: {p.enrolled}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    p.status === 'completed'    ? 'bg-green-100 text-green-700' :
                    p.status === 'in-progress'  ? 'bg-blue-100 text-blue-700' :
                                                  'bg-gray-100 text-gray-600'
                  }`}>{p.status}</span>
                  {p.status === 'completed' && p.certId && (
                    <button onClick={() => setShowCert(p)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1B2F5B] text-white text-[10px] font-bold hover:bg-[#2A4480]">
                      <Award className="w-3 h-3" />{t({ en: 'Certificate', ar: 'شهادة' })}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming sessions */}
          <div>
            <div className="font-semibold text-gray-800 text-sm mb-3">{t({ en: 'Upcoming Sessions', ar: 'الجلسات القادمة' })}</div>
            <div className="space-y-2">
              {UPCOMING_SESSIONS.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{s.date} · {s.time}</div>
                    <div className="text-xs text-gray-400 truncate">{s.location}</div>
                  </div>
                  <div className="text-xs text-green-600 font-semibold flex-shrink-0">{s.seats} {t({ en: 'seats', ar: 'مقعد' })}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex-shrink-0">
          <button onClick={() => setShowBook(true)}
            className="w-full py-3 rounded-xl bg-[#1B2F5B] text-white font-bold text-sm hover:bg-[#2A4480] flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />{t({ en: 'Book Appointment', ar: 'حجز موعد' })}
          </button>
        </div>
      </div>

      {showBook && <BookingModal program={program} onClose={() => setShowBook(false)} addToast={addToast} t={t} />}
      {showCert && <CertModal participant={showCert} program={program} onClose={() => setShowCert(null)} t={t} addToast={addToast} />}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Training({ t, lang, addToast }) {
  const isRTL = lang === 'ar'
  const [detailProg, setDetailProg] = useState(null)

  const totalEnrolled   = cdTrainingPrograms.reduce((s, p) => s + (p.enrolled ?? 0), 0)
  const totalCompleted  = cdTrainingPrograms.reduce((s, p) => s + (p.completed ?? 0), 0)

  const kpis = [
    { label: { en: 'Programs', ar: 'البرامج' },        value: cdTrainingPrograms.length, color: 'text-gray-900' },
    { label: { en: 'Enrolled', ar: 'المسجلون' },       value: totalEnrolled,              color: 'text-blue-600' },
    { label: { en: 'Certified', ar: 'المعتمدون' },     value: totalCompleted,             color: 'text-green-600' },
    { label: { en: 'Pass Rate', ar: 'نسبة النجاح' },   value: `${Math.round((totalCompleted/Math.max(1,totalEnrolled))*100)}%`, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-[#1A6B3A]" />
        {t({ en: 'Training & Simulation', ar: 'التدريب والمحاكاة' })}
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{t(k.label)}</div>
            <div className={`text-2xl font-bold font-mono ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Program cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cdTrainingPrograms.map(prog => {
          const pct = prog.enrolled ? Math.round((prog.completed / prog.enrolled) * 100) : 0
          const mod = MODALITY[prog.modality]
          return (
            <div key={prog.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setDetailProg(prog)}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-bold text-gray-900 text-sm leading-tight">{t(prog.name)}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{prog.duration} · Cert: {t(prog.certValidity)}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${mod?.cls ?? 'bg-gray-100 text-gray-700'}`}>
                  {prog.modality}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{pct}% {t({ en: 'completed', ar: 'مكتمل' })}</span>
                <span>{prog.completed} / {prog.enrolled}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1A6B3A] rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h2 className="font-bold text-gray-900">{t({ en: 'Team Leaderboard', ar: 'لوحة قيادة الفرق' })}</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {leaderboard.map((team, i) => (
            <div key={team.rank ?? i} className="px-5 py-3 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${RANK_STYLES[i] ?? 'bg-gray-100 text-gray-700'}`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{t(team.team)}</div>
                <div className="text-xs text-gray-400">{team.drills} {t({ en: 'drills', ar: 'تدريبات' })} · {t({ en: 'trend', ar: 'الاتجاه' })}: {team.improvement}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold font-mono text-gray-900 text-lg">{team.score}</div>
                <div className="text-[10px] text-gray-400">{t({ en: 'pts', ar: 'نقطة' })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program detail modal */}
      {detailProg && (
        <ProgramDetail
          program={detailProg}
          onClose={() => setDetailProg(null)}
          addToast={addToast}
          t={t} lang={lang}
        />
      )}
    </div>
  )
}
