import { useApp } from '../context/AppContext'
import { Lock, ChevronLeft, ChevronRight, Shield } from 'lucide-react'

export default function MadaniPortal() {
  const { lang, setLang, setPortal, t } = useApp()
  const isRTL = lang === 'ar'
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-40 bg-[#1B2F5B] text-white shadow flex items-center gap-3 px-4 h-14">
        <button onClick={() => setPortal('landing')}
          className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium transition-colors">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {t({ en: 'Home', ar: 'الرئيسية' })}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Shield className="w-4 h-4 text-white/60" />
          <span className="font-bold text-sm">{t({ en: 'Madani Tech Operations', ar: 'عمليات مدني تك' })}</span>
        </div>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="px-2.5 py-1 bg-white/10 rounded text-xs font-bold hover:bg-white/20 transition-colors">
          {lang === 'ar' ? 'EN' : 'عر'}
        </button>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold mb-4">
            {t({ en: 'Internal Use Only', ar: 'للاستخدام الداخلي فقط' })}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {t({ en: 'Coming Soon', ar: 'قريباً' })}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {t({
              en: 'The Madani Tech Operator Portal is under development. This internal dashboard will provide platform-wide monitoring, AI model management, and system configuration for Madani Tech engineers.',
              ar: 'بوابة مشغّل مدني تك قيد التطوير. ستوفر هذه اللوحة الداخلية مراقبة شاملة للمنظومة وإدارة نماذج الذكاء الاصطناعي وتهيئة النظام لمهندسي مدني تك.'
            })}
          </p>
          <button onClick={() => setPortal('landing')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2F5B] text-white rounded-lg text-sm font-medium hover:bg-[#2A4480] transition-colors">
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {t({ en: 'Back to Home', ar: 'العودة للرئيسية' })}
          </button>
        </div>
      </div>
    </div>
  )
}
