import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'
import {
  ShieldCheck, Building2, Siren, BarChart3, ChevronLeft, ChevronRight,
  Zap, Globe, Shield, TrendingUp, CheckCircle2, AlertTriangle, Lock, Cpu, ArrowRight, ArrowLeft
} from 'lucide-react'

const PAGE_BG = '#F7F5F2'
const SURFACE = '#FFFFFF'
const BORDER = 'rgba(0,0,0,0.07)'
const TEXT_1 = '#18181B'
const TEXT_2 = '#52525B'
const TEXT_3 = '#A1A1AA'

export default function Landing() {
  const { setPortal, t, lang, insuranceFlag } = useApp()
  const isRTL = lang === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const stats = [
    { value: '9', label: { en: 'Buildings Monitored', ar: 'مبنى مُراقَب' } },
    { value: 'SAR 3.92B', label: { en: 'Insured Value', ar: 'قيمة مؤمَّنة' } },
    { value: '7', label: { en: 'Active CD Units', ar: 'وحدة دفاع مدني' } },
    { value: '2', label: { en: 'Cities Covered', ar: 'مدينة مشمولة' } },
  ]

  const portals = [
    {
      id: 'commercial',
      icon: Building2,
      accent: '#1E3A5F',
      accentBg: '#EBF5FB',
      title: t(ui.commercialPortal),
      desc: t(ui.commercialDesc),
      tagline: { en: 'Monitor. Comply. Act.', ar: 'راقب. امتثل. تصرف.' },
      caps: [
        { en: 'Live risk scoring per building', ar: 'تقييم مخاطر فوري لكل مبنى' },
        { en: 'Real-time sensor monitoring', ar: 'مراقبة المستشعرات في الوقت الفعلي' },
        { en: 'License & compliance tracking', ar: 'تتبع التراخيص والامتثال' },
        { en: 'Marketplace for safety products', ar: 'سوق منتجات السلامة' },
      ],
    },
    {
      id: 'cd',
      icon: Siren,
      accent: '#991B1B',
      accentBg: '#FEF2F2',
      title: t(ui.cdPortal),
      desc: t(ui.cdDesc),
      tagline: { en: 'Predict. Dispatch. Enforce.', ar: 'تنبأ. أرسل. طبّق.' },
      caps: [
        { en: 'AI-assisted inspections', ar: 'فحوصات مدعومة بالذكاء الاصطناعي' },
        { en: 'Live operations command center', ar: 'مركز قيادة العمليات الفورية' },
        { en: 'Drone surveillance integration', ar: 'تكامل مراقبة الطائرات المسيرة' },
        { en: 'Policy engine & digital licensing', ar: 'محرك السياسات والترخيص الرقمي' },
      ],
    },
    {
      id: 'insurance',
      icon: BarChart3,
      accent: '#0F1F3D',
      accentBg: '#EFF6FF',
      title: t(ui.insurancePortal),
      desc: t(ui.insuranceDesc),
      tagline: { en: 'Price Accurately. Manage Risk.', ar: 'سعّر بدقة. أدر المخاطر.' },
      flag: insuranceFlag,
      flagLabel: { en: 'Policy Review Triggered', ar: 'مراجعة بوليصة مُفعَّلة' },
      caps: [
        { en: 'Dynamic risk-based pricing', ar: 'تسعير ديناميكي مبني على المخاطر' },
        { en: 'Verified MDRE risk scores', ar: 'درجات مخاطر MDRE المعتمدة' },
        { en: 'AI-powered loss analysis', ar: 'تحليل خسائر بالذكاء الاصطناعي' },
        { en: 'Portfolio benchmark analytics', ar: 'تحليلات معايير المحفظة' },
      ],
    },
    {
      id: 'madani',
      icon: Cpu,
      accent: '#374151',
      accentBg: '#F3F4F6',
      title: t({ en: 'Madani Tech Operations', ar: 'عمليات مدني تك' }),
      desc: t({ en: 'Internal operator console', ar: 'لوحة تحكم المشغّل الداخلية' }),
      tagline: { en: 'Platform-Wide Control.', ar: 'تحكم شامل بالمنصة.' },
      locked: true,
      caps: [
        { en: 'AI model management & tuning', ar: 'إدارة نماذج الذكاء الاصطناعي وضبطها' },
        { en: 'Platform-wide monitoring', ar: 'مراقبة شاملة للمنصة' },
        { en: 'System configuration & APIs', ar: 'تهيئة النظام وواجهات API' },
        { en: 'Multi-tenant role management', ar: 'إدارة الأدوار متعددة المستأجرين' },
      ],
    },
  ]

  const badges = [
    { icon: ShieldCheck, label: t(ui.sbc201) },
    { icon: ShieldCheck, label: t(ui.sbc801) },
    { icon: Shield, label: t(ui.vision2030) },
    { icon: Globe, label: t(ui.sdaia) },
  ]

  const howItWorks = [
    { icon: Zap, step: '01', title: { en: 'Real-time Data Ingestion', ar: 'استيعاب البيانات الفوري' }, desc: { en: 'IoT sensors, government APIs (Wathq, Balady, Salamah), and BMS feeds flow continuously into the platform.', ar: 'مستشعرات إنترنت الأشياء وواجهات الحكومة وأنظمة إدارة المباني تُغذّي المنصة بشكل مستمر.' } },
    { icon: TrendingUp, step: '02', title: { en: 'Dynamic Risk Scoring', ar: 'تقييم المخاطر الديناميكي' }, desc: { en: 'The MDRE recalculates every building\'s risk score in real-time using 5 AI algorithm layers.', ar: 'يُعيد MDRE حساب درجة مخاطر كل مبنى لحظياً باستخدام 5 طبقات خوارزمية ذكاء اصطناعي.' } },
    { icon: AlertTriangle, step: '03', title: { en: 'Automated Enforcement', ar: 'التطبيق الآلي' }, desc: { en: 'Critical thresholds trigger instant owner alerts, CD dispatch, SLA countdowns, and insurance profile updates.', ar: 'العتبات الحرجة تُفعّل تنبيهات فورية للمالك وإرسال الدفاع المدني وعدادات SLA وتحديث ملفات التأمين.' } },
    { icon: CheckCircle2, step: '04', title: { en: 'Resolution & Re-scoring', ar: 'الحل وإعادة التقييم' }, desc: { en: 'Once verified digitally by an inspector, the risk score normalizes instantly across all three portals.', ar: 'بمجرد التحقق الرقمي من المفتش، تعود درجة المخاطر إلى طبيعتها فوراً عبر جميع البوابات الثلاث.' } },
  ]

  const riskBands = [
    { range: '0–49', label: { en: 'LOW', ar: 'منخفض' }, color: '#22C55E', action: { en: 'Routine monitoring', ar: 'مراقبة روتينية' } },
    { range: '50–69', label: { en: 'MEDIUM', ar: 'متوسط' }, color: '#EAB308', action: { en: 'Owner notified', ar: 'إشعار المالك' } },
    { range: '70–84', label: { en: 'HIGH', ar: 'مرتفع' }, color: '#F97316', action: { en: '24-hour SLA', ar: 'SLA 24 ساعة' } },
    { range: '85–100', label: { en: 'CRITICAL', ar: 'حرج' }, color: '#EF4444', action: { en: '4-hour SLA', ar: 'SLA 4 ساعات' } },
  ]

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section style={{ background: '#0F1C35', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Top rule — authority stripe */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #1E3A5F 0%, #991B1B 33%, #0F1F3D 66%, #1E3A5F 100%)' }} />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Vision badge */}
          <div className="flex justify-center mb-8">
            <span style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-medium">
              <Shield size={11} />
              {t({ en: 'Saudi Vision 2030 — National Safety Transformation', ar: 'رؤية السعودية 2030 — تحول السلامة الوطنية' })}
            </span>
          </div>

          <h1 className="text-center font-bold text-balance leading-none mb-3" style={{ color: '#FFFFFF', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}>
            {t(ui.platformName)}
          </h1>
          <p className="text-center font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(1rem, 2.5vw, 1.375rem)' }}>
            {t(ui.tagline)}
          </p>
          <p className="text-center max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {t(ui.subTagline)}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setPortal('commercial')}
              style={{ background: '#1E3A5F', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)' }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
            >
              {t({ en: 'Explore Platform', ar: 'استكشف المنصة' })}
              <ArrowIcon size={14} />
            </button>
            <button
              onClick={() => document.getElementById('portals-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}
              className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors hover:border-white/30"
            >
              {t({ en: 'View Portals', ar: 'عرض البوابات' })}
            </button>
          </div>
        </div>

        {/* Stats row — inset into hero bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-bold ltr-num" style={{ color: '#FFFFFF', fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}>{s.value}</div>
                  <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{t(s.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Portal Cards ─────────────────────────────────────────── */}
      <section id="portals-section" className="py-16 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="section-label mb-2">{t({ en: 'Platform Portals', ar: 'بوابات المنصة' })}</div>
          <h2 className="font-bold" style={{ color: TEXT_1, fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', letterSpacing: '-0.01em' }}>
            {t({ en: 'Three Portals. One Data Spine.', ar: 'ثلاث بوابات. عمود بيانات واحد.' })}
          </h2>
          <p className="text-sm mt-2 max-w-lg" style={{ color: TEXT_2 }}>
            {t({ en: 'All portals operate on the same MDRE data layer — a single source of truth across all stakeholders.', ar: 'جميع البوابات تعمل على طبقة بيانات MDRE نفسها — مصدر بيانات موحد لجميع الأطراف.' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {portals.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.id}
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderTop: `3px solid ${p.accent}` }}
                className="rounded-xl overflow-hidden flex flex-col"
              >
                {/* Card head */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div style={{ background: p.accentBg, borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} style={{ color: p.accent }} />
                    </div>
                    {p.locked && (
                      <span style={{ background: '#F3F4F6', color: TEXT_3, fontSize: 10 }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                        <Lock size={9} />
                        {t({ en: 'Internal', ar: 'داخلي' })}
                      </span>
                    )}
                    {p.flag && (
                      <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10 }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                        {t(p.flagLabel)}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm mb-0.5" style={{ color: TEXT_1 }}>{p.title}</div>
                  <div className="text-xs mb-3" style={{ color: TEXT_3 }}>{p.desc}</div>
                  <div className="text-xs font-semibold" style={{ color: p.accent }}>{t(p.tagline)}</div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: BORDER, margin: '0 20px' }} />

                {/* Capabilities */}
                <div className="p-5 pt-4 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1 mb-5">
                    {p.caps.map((cap, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs" style={{ color: TEXT_2 }}>
                        {p.locked
                          ? <Lock size={11} style={{ marginTop: 1, flexShrink: 0, color: TEXT_3 }} />
                          : <CheckCircle2 size={11} style={{ marginTop: 1, flexShrink: 0, color: p.accent }} />
                        }
                        {t(cap)}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setPortal(p.id)}
                    style={{ border: `1px solid ${p.accent}`, color: p.accent, opacity: p.locked ? 0.5 : 1 }}
                    className="w-full py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70 flex items-center justify-center gap-1.5"
                  >
                    {p.locked ? <Lock size={11} /> : null}
                    {p.locked ? t({ en: 'Coming Soon', ar: 'قريباً' }) : t(ui.enterPortal)}
                    {!p.locked && <ArrowIcon size={11} />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <div className="section-label mb-2">{t({ en: 'How It Works', ar: 'آلية العمل' })}</div>
            <h2 className="font-bold" style={{ color: TEXT_1, fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', letterSpacing: '-0.01em' }}>
              {t({ en: 'The MDRE Engine', ar: 'محرك MDRE' })}
            </h2>
            <p className="text-sm mt-1" style={{ color: TEXT_2 }}>
              {t({ en: 'Continuous, intelligent, automated risk computation.', ar: 'حوسبة مخاطر مستمرة، ذكية، آلية.' })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: BORDER }}>
            {howItWorks.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} style={{ background: SURFACE }} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BORDER}` }}>
                      <Icon size={16} style={{ color: '#1E3A5F' }} />
                    </div>
                    <span className="font-mono font-bold text-xs" style={{ color: TEXT_3 }}>{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: TEXT_1 }}>{t(item.title)}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: TEXT_2 }}>{t(item.desc)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Risk Bands ───────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="section-label mb-6 text-center">{t({ en: 'MDRE Risk Score Bands', ar: 'نطاقات درجة المخاطر في MDRE' })}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {riskBands.map((b) => (
              <div key={b.range} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderTop: `3px solid ${b.color}` }} className="rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color }} />
                  <span className="font-bold text-xs uppercase tracking-wider" style={{ color: TEXT_1 }}>{t(b.label)}</span>
                </div>
                <div className="font-mono font-bold text-xl ltr-num mb-1" style={{ color: b.color }}>{b.range}</div>
                <div className="text-xs" style={{ color: TEXT_3 }}>{t(b.action)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Compliance Badges ────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="section-label text-center mb-5">{t({ en: 'Compliance & Standards', ar: 'الامتثال والمعايير' })}</div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {badges.map((b, i) => {
              const Icon = b.icon
              return (
                <div key={i} style={{ background: '#F7F5F2', border: `1px solid ${BORDER}`, color: TEXT_2 }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium">
                  <Icon size={14} style={{ color: '#1E3A5F' }} />
                  {b.label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, background: '#0F1C35' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{t(ui.madaniTech)}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {t({ en: 'A proposed Public-Private Partnership entity under feasibility study — Kingdom of Saudi Arabia', ar: 'كيان شراكة بين القطاعين العام والخاص مقترح قيد دراسة الجدوى — المملكة العربية السعودية' })}
          </div>
          <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.15)' }}>
            {t({ en: '© 2025 Madani Tech. All rights reserved.', ar: '© 2025 مدني تك. جميع الحقوق محفوظة.' })}
          </div>
        </div>
      </footer>
    </div>
  )
}
