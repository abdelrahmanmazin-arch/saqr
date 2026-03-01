import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'
import {
  ShieldCheck, Building2, Siren, BarChart3, ChevronLeft, ChevronRight,
  Zap, Globe, Shield, TrendingUp, CheckCircle2, AlertTriangle, Lock, Cpu
} from 'lucide-react'

export default function Landing() {
  const { setPortal, t, lang, buildings, incidents, insuranceFlag } = useApp()
  const isRTL = lang === 'ar'
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight

  const stats = [
    { value: '9', label: t(ui.buildingsMonitored) },
    { value: 'SAR 3.92B', label: t(ui.insuredValue) },
    { value: '7', label: t(ui.activeCDUnits) },
    { value: '2', label: t(ui.citiesCovered) },
  ]

  const portals = [
    {
      id: 'commercial',
      icon: Building2,
      color: 'from-[#1B4F72] to-[#2A6496]',
      accentLight: 'bg-[#EBF5FB]',
      accentText: 'text-[#1B4F72]',
      accentBorder: 'border-[#1B4F72]',
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
      color: 'from-[#991B1B] to-[#B91C1C]',
      accentLight: 'bg-[#FEF2F2]',
      accentText: 'text-[#991B1B]',
      accentBorder: 'border-[#991B1B]',
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
      color: 'from-[#0F1F3D] to-[#1B3460]',
      accentLight: 'bg-[#EFF6FF]',
      accentText: 'text-[#0F1F3D]',
      accentBorder: 'border-[#0F1F3D]',
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
  ]

  const madaniCard = {
    id: 'madani',
    icon: Cpu,
    color: 'from-[#374151] to-[#1F2937]',
    accentText: 'text-[#374151]',
    accentBorder: 'border-[#374151]',
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
  }

  const badges = [
    { icon: ShieldCheck, label: t(ui.sbc201) },
    { icon: ShieldCheck, label: t(ui.sbc801) },
    { icon: Shield, label: t(ui.vision2030) },
    { icon: Globe, label: t(ui.sdaia) },
  ]

  const howItWorks = [
    { icon: Zap, title: { en: 'Real-time Data Ingestion', ar: 'استيعاب البيانات الفوري' }, desc: { en: 'IoT sensors, government APIs (Wathq, Balady, Salamah), and BMS feeds flow continuously into the platform.', ar: 'مستشعرات إنترنت الأشياء وواجهات الحكومة وأنظمة إدارة المباني تُغذّي المنصة بشكل مستمر.' } },
    { icon: TrendingUp, title: { en: 'Dynamic Risk Scoring', ar: 'تقييم المخاطر الديناميكي' }, desc: { en: 'The MDRE recalculates every building\'s risk score in real-time using 5 AI algorithm layers.', ar: 'يُعيد MDRE حساب درجة مخاطر كل مبنى لحظياً باستخدام 5 طبقات خوارزمية ذكاء اصطناعي.' } },
    { icon: AlertTriangle, title: { en: 'Automated Enforcement', ar: 'التطبيق الآلي' }, desc: { en: 'Critical thresholds trigger instant owner alerts, CD dispatch, SLA countdowns, and insurance profile updates.', ar: 'العتبات الحرجة تُفعّل تنبيهات فورية للمالك وإرسال الدفاع المدني وعدادات SLA وتحديث ملفات التأمين.' } },
    { icon: CheckCircle2, title: { en: 'Resolution & Re-scoring', ar: 'الحل وإعادة التقييم' }, desc: { en: 'Once verified digitally by an inspector, the risk score normalizes instantly across all three portals.', ar: 'بمجرد التحقق الرقمي من المفتش، تعود درجة المخاطر إلى طبيعتها فوراً عبر جميع البوابات الثلاث.' } },
  ]

  return (
    <div className="bg-white min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2F5B] via-[#1B3A6B] to-[#0F1F3D] text-white">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 1px 1px,white 1px,transparent 0)',backgroundSize:'32px 32px'}} />
        {/* Gold accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A028] via-[#E8C84A] to-[#C5A028]" />

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Vision 2030 badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A028]/20 border border-[#C5A028]/40 text-[#C5A028] text-sm font-medium">
              <Shield className="w-4 h-4" />
              {t({ en: 'Saudi Vision 2030 — National Safety Transformation', ar: 'رؤية السعودية 2030 — تحول السلامة الوطنية' })}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight mb-4">
            <span className="text-[#C5A028]">{t(ui.platformName)}</span>
          </h1>
          <p className="text-center text-2xl sm:text-3xl font-semibold text-white/90 mb-6">
            {t(ui.tagline)}
          </p>
          <p className="text-center text-white/70 max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed">
            {t(ui.subTagline)}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setPortal('commercial')}
              className="px-6 py-3 rounded-xl bg-[#C5A028] text-white font-semibold hover:bg-[#B8911F] transition-colors shadow-lg text-sm"
            >
              {t({ en: 'Explore Platform', ar: 'استكشف المنصة' })}
            </button>
            <button
              onClick={() => document.getElementById('portals-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors text-sm"
            >
              {t({ en: 'View Portals', ar: 'عرض البوابات' })}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <section className="bg-[#1B2F5B] border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#C5A028] ltr-num">{s.value}</div>
                <div className="text-white/60 text-xs sm:text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Portal Cards ─────────────────────────────────────────── */}
      <section id="portals-section" className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {t({ en: 'Three Portals. One Data Spine.', ar: 'ثلاث بوابات. عمود بيانات واحد.' })}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              {t({ en: 'All portals operate on the same MDRE data layer — ensuring a Single Source of Truth across all stakeholders.', ar: 'جميع البوابات تعمل على طبقة بيانات MDRE نفسها — لضمان مصدر بيانات موحد لجميع الأطراف.' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...portals, madaniCard].map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Card header */}
                  <div className={`bg-gradient-to-br ${p.color} p-6 text-white relative`}>
                    {p.locked && (
                      <div className="absolute top-3 end-3 flex items-center gap-1 px-2 py-0.5 bg-black/30 rounded-full text-[10px] font-semibold text-white/80">
                        <Lock className="w-2.5 h-2.5" />
                        {t({ en: 'Internal Use Only', ar: 'داخلي فقط' })}
                      </div>
                    )}
                    {p.flag && (
                      <div className="absolute top-3 end-3 flex items-center gap-1 px-2 py-0.5 bg-amber-400/90 rounded-full text-[10px] font-bold text-white animate-pulse">
                        {t(p.flagLabel)}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-base">{p.title}</div>
                        <div className="text-white/70 text-xs">{p.desc}</div>
                      </div>
                    </div>
                    <div className="text-[#FFD700] font-semibold text-sm">{t(p.tagline)}</div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <ul className="space-y-2 flex-1">
                      {p.caps.map((cap, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          {p.locked
                            ? <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            : <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.accentText}`} />
                          }
                          {t(cap)}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setPortal(p.id)}
                      className={`mt-5 w-full py-2.5 rounded-xl border-2 ${p.accentBorder} ${p.accentText} font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 ${
                        p.locked ? 'opacity-70' : ''
                      }`}
                    >
                      {p.locked ? <Lock className="w-4 h-4" /> : null}
                      {p.locked ? t({ en: 'Coming Soon', ar: 'قريباً' }) : t(ui.enterPortal)}
                      {!p.locked && <ArrowIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {t({ en: 'How the MDRE Works', ar: 'كيف يعمل MDRE' })}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
              {t({ en: 'The Madani Tech Dynamic Risk Engine — continuous, intelligent, automated.', ar: 'محرك المخاطر الديناميكي من مدني تك — مستمر، ذكي، آلي.' })}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="relative text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#1B2F5B] text-white flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="absolute top-5 start-1/2 w-full h-px bg-gray-200 -z-0 hidden lg:block" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t(item.title)}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{t(item.desc)}</p>
                  <div className="absolute -top-1 -start-1 w-6 h-6 rounded-full bg-[#C5A028] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Risk Bands Visual ────────────────────────────────────── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-8">
            {t({ en: 'MDRE Risk Score Bands', ar: 'نطاقات درجة المخاطر في MDRE' })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { range: '0–49', label: { en: 'LOW', ar: 'منخفض' }, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', dot: 'bg-green-500', action: { en: 'Routine monitoring', ar: 'مراقبة روتينية' } },
              { range: '50–69', label: { en: 'MEDIUM', ar: 'متوسط' }, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500', action: { en: 'Owner notified', ar: 'إشعار المالك' } },
              { range: '70–84', label: { en: 'HIGH', ar: 'مرتفع' }, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', dot: 'bg-red-500', action: { en: '24-hour SLA', ar: 'SLA 24 ساعة' } },
              { range: '85–100', label: { en: 'CRITICAL', ar: 'حرج' }, bg: 'bg-red-950', border: 'border-red-900', text: 'text-white', dot: 'bg-red-400', action: { en: '4-hour SLA', ar: 'SLA 4 ساعات' } },
            ].map((b) => (
              <div key={b.range} className={`${b.bg} ${b.border} border rounded-xl p-4 text-center`}>
                <div className={`inline-flex items-center gap-1.5 mb-2`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${b.dot}`} />
                  <span className={`font-bold text-sm ${b.text}`}>{t(b.label)}</span>
                </div>
                <div className={`text-xl font-mono font-bold ${b.text} mb-1`}>{b.range}</div>
                <div className={`text-xs ${b.text} opacity-80`}>{t(b.action)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Compliance Badges ────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {badges.map((b, i) => {
              const Icon = b.icon
              return (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium bg-gray-50">
                  <Icon className="w-4 h-4 text-[#1B2F5B]" />
                  {b.label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-[#0F1F3D] text-white/60 py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[#C5A028] font-semibold mb-1">{t(ui.madaniTech)}</div>
          <div className="text-xs">
            {t({ en: 'A proposed Public-Private Partnership entity under feasibility study — Kingdom of Saudi Arabia', ar: 'كيان شراكة بين القطاعين العام والخاص مقترح قيد دراسة الجدوى — المملكة العربية السعودية' })}
          </div>
          <div className="text-xs mt-2 text-white/30">
            {t({ en: '© 2025 Madani Tech. All rights reserved.', ar: '© 2025 مدني تك. جميع الحقوق محفوظة.' })}
          </div>
        </div>
      </footer>
    </div>
  )
}
