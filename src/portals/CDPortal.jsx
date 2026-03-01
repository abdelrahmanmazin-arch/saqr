import { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  Radio, ClipboardList, Video, FileCheck, Settings2, BookOpen, Megaphone,
  Bell, ChevronLeft, ChevronRight, ChevronDown, Shield, Menu, X
} from 'lucide-react'
import OperationsCenter   from './cd/OperationsCenter'
import DigitalInspection  from './cd/DigitalInspection'
import Surveillance       from './cd/Surveillance'
import DigitalLicensing   from './cd/DigitalLicensing'
import PolicyEngine       from './cd/PolicyEngine'
import Training           from './cd/Training'
import AwarenessPlatform  from './cd/AwarenessPlatform'

const MODULES = [
  { id: 'operations',  icon: Radio,        label: { en: 'Operations Center',  ar: 'مركز العمليات'       }, accent: '#991B1B' },
  { id: 'inspection',  icon: ClipboardList, label: { en: 'Digital Inspection', ar: 'الفحص الرقمي'         }, accent: '#1A6B3A' },
  { id: 'surveillance',icon: Video,         label: { en: 'Surveillance',        ar: 'المراقبة'             }, accent: '#6D28D9' },
  { id: 'licensing',   icon: FileCheck,     label: { en: 'Digital Licensing',   ar: 'التراخيص الرقمية'    }, accent: '#0891B2' },
  { id: 'policy',      icon: Settings2,     label: { en: 'Policy Engine',       ar: 'محرك السياسات'       }, accent: '#0891B2' },
  { id: 'training',    icon: BookOpen,      label: { en: 'Training & Sim',      ar: 'التدريب والمحاكاة'   }, accent: '#1A6B3A' },
  { id: 'awareness',   icon: Megaphone,     label: { en: 'Awareness Platform',  ar: 'منصة التوعية'        }, accent: '#D97706' },
]

const ROLES = [
  { id: 'tier1', label: { en: 'Tier 1 — National Command', ar: 'الطبقة 1 — القيادة الوطنية' } },
  { id: 'tier2', label: { en: 'Tier 2 — Regional Hub',    ar: 'الطبقة 2 — المركز الإقليمي'  } },
  { id: 'tier3', label: { en: 'Tier 3 — Station Officer', ar: 'الطبقة 3 — ضابط المحطة'     } },
]

// Notification count per module (demo values)
const NOTIF = { operations: 3, inspection: 2, licensing: 1, surveillance: 0, policy: 0, training: 0, awareness: 0 }

export default function CDPortal() {
  const { lang, setLang, setPortal, t } = useApp()
  const [module,   setModule]   = useState('operations')
  const [role,     setRole]     = useState('tier1')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  const isRTL = lang === 'ar'
  const totalNotif = Object.values(NOTIF).reduce((a, b) => a + b, 0)
  const activeRole = ROLES.find(r => r.id === role)

  const selectModule = (id) => {
    setModule(id)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ─── Top Bar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#991B1B] text-white shadow-lg flex items-center gap-3 px-4 h-14">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="toggle sidebar"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Back to landing */}
        <button
          onClick={() => setPortal('landing')}
          className="hidden lg:flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium transition-colors"
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {t({ en: 'Home', ar: 'الرئيسية' })}
        </button>

        {/* Portal title */}
        <div className="flex items-center gap-2 flex-1">
          <Shield className="w-5 h-5 text-white/80 flex-shrink-0" />
          <span className="font-bold text-sm sm:text-base truncate">
            {t({ en: 'Civil Defense Portal', ar: 'بوابة الدفاع المدني' })}
          </span>
        </div>

        {/* Role selector */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen(v => !v)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors"
          >
            <span className="truncate max-w-[160px]">{t(activeRole.label)}</span>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
          {roleOpen && (
            <div className="absolute top-full mt-2 end-0 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); setRoleOpen(false) }}
                  className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${
                    r.id === role ? 'bg-red-50 text-[#991B1B] font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(r.label)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
          {totalNotif > 0 && (
            <span className="absolute top-0.5 end-0.5 w-4 h-4 bg-amber-400 rounded-full text-[9px] font-bold text-gray-900 flex items-center justify-center">
              {totalNotif}
            </span>
          )}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="px-2.5 py-1.5 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
        >
          {lang === 'ar' ? 'EN' : 'عر'}
        </button>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* ─── Sidebar (desktop) ─────────────────────────────────────────────── */}
        <aside className={`hidden lg:flex flex-col bg-white border-e border-gray-100 shadow-sm transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-56'
        }`}>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(v => !v)}
            className={`flex items-center justify-center h-10 mt-2 mb-1 mx-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors text-xs gap-1.5 ${
              collapsed ? '' : ''
            }`}
          >
            {collapsed
              ? (isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
              : (isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
            }
            {!collapsed && <span>{t({ en: 'Collapse', ar: 'طي' })}</span>}
          </button>

          <nav className="flex-1 px-2 space-y-0.5 pb-4">
            {MODULES.map(({ id, icon: Icon, label }) => {
              const active = module === id
              const n = NOTIF[id] ?? 0
              return (
                <button
                  key={id}
                  onClick={() => setModule(id)}
                  title={collapsed ? t(label) : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#991B1B] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-start truncate">{t(label)}</span>
                  )}
                  {!collapsed && n > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                    }`}>{n}</span>
                  )}
                  {collapsed && n > 0 && (
                    <span className="absolute top-1 end-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Role badge at bottom */}
          {!collapsed && (
            <div className="px-3 pb-4">
              <div className="px-3 py-2 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-400 mb-0.5">{t({ en: 'Active Role', ar: 'الدور النشط' })}</div>
                <div className="text-xs font-semibold text-gray-700 truncate">{t(activeRole.label)}</div>
              </div>
            </div>
          )}
        </aside>

        {/* ─── Mobile Sidebar Overlay ─────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="relative w-64 bg-white shadow-xl flex flex-col z-40">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <Shield className="w-4 h-4 text-[#991B1B]" />
                <span className="font-bold text-sm text-gray-900">{t({ en: 'Civil Defense', ar: 'الدفاع المدني' })}</span>
              </div>
              <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
                {MODULES.map(({ id, icon: Icon, label }) => {
                  const active = module === id
                  const n = NOTIF[id] ?? 0
                  return (
                    <button
                      key={id}
                      onClick={() => selectModule(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active ? 'bg-[#991B1B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-start">{t(label)}</span>
                      {n > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                        }`}>{n}</span>
                      )}
                    </button>
                  )
                })}
              </nav>
              {/* Role selector inside mobile sidebar */}
              <div className="px-3 pb-4 pt-2 border-t border-gray-100">
                <div className="text-[10px] text-gray-400 mb-1 px-1">{t({ en: 'Switch Role', ar: 'تبديل الدور' })}</div>
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setMobileOpen(false) }}
                    className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-colors ${
                      r.id === role ? 'bg-red-50 text-[#991B1B] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t(r.label)}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* ─── Main Content ───────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
            {module === 'operations'   && <OperationsCenter   t={t} lang={lang} role={role} />}
            {module === 'inspection'   && <DigitalInspection  t={t} lang={lang} role={role} />}
            {module === 'surveillance' && <Surveillance        t={t} lang={lang} role={role} />}
            {module === 'licensing'    && <DigitalLicensing   t={t} lang={lang} role={role} />}
            {module === 'policy'       && <PolicyEngine       t={t} lang={lang} role={role} />}
            {module === 'training'     && <Training           t={t} lang={lang} role={role} />}
            {module === 'awareness'    && <AwarenessPlatform  t={t} lang={lang} role={role} />}
          </div>
        </main>
      </div>
    </div>
  )
}
