import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import {
  Radio, ClipboardList, Video, FileCheck, Settings2, BookOpen, Megaphone,
  Bell, ChevronLeft, ChevronRight, ChevronDown, Shield, Menu, X
} from 'lucide-react'
import { ToastStack } from '../components/Toast'
import OperationsCenter   from './cd/OperationsCenter'
import DigitalInspection  from './cd/DigitalInspection'
import Surveillance       from './cd/Surveillance'
import DigitalLicensing   from './cd/DigitalLicensing'
import PolicyEngine       from './cd/PolicyEngine'
import Training           from './cd/Training'
import AwarenessPlatform  from './cd/AwarenessPlatform'
import NationalView       from './cd/NationalView'
import StationView        from './cd/StationView'

const MODULES = [
  { id: 'operations',   icon: Radio,         label: { en: 'Operations Center',  ar: 'مركز العمليات'     } },
  { id: 'inspection',   icon: ClipboardList, label: { en: 'Digital Inspection', ar: 'الفحص الرقمي'       } },
  { id: 'surveillance', icon: Video,          label: { en: 'Surveillance',       ar: 'المراقبة'           } },
  { id: 'licensing',    icon: FileCheck,      label: { en: 'Digital Licensing',  ar: 'التراخيص الرقمية'  } },
  { id: 'policy',       icon: Settings2,      label: { en: 'Policy Engine',      ar: 'محرك السياسات'     } },
  { id: 'training',     icon: BookOpen,       label: { en: 'Training & Sim',     ar: 'التدريب والمحاكاة' } },
  { id: 'awareness',    icon: Megaphone,      label: { en: 'Awareness Platform', ar: 'منصة التوعية'      } },
]

const TIERS = [
  { id: 1, label: { en: 'Tier 1 — National Command',   ar: 'الطبقة 1 — القيادة الوطنية'  } },
  { id: 2, label: { en: 'Tier 2 — Regional Operations', ar: 'الطبقة 2 — العمليات الإقليمية' } },
  { id: 3, label: { en: 'Tier 3 — Field Officer',      ar: 'الطبقة 3 — الضابط الميداني'  } },
]

const NOTIF = { operations: 3, inspection: 2, licensing: 1 }

export default function CDPortal() {
  const { lang, setLang, setPortal, t } = useApp()
  const [module,     setModule]     = useState('operations')
  const [tier,       setTier]       = useState(2)
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tierOpen,   setTierOpen]   = useState(false)
  const [toasts,     setToasts]     = useState([])

  const isRTL   = lang === 'ar'
  const totalNotif = Object.values(NOTIF).reduce((a, b) => a + b, 0)
  const activeTier = TIERS.find(t => t.id === tier)

  const addToast = useCallback((msg, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const moduleProps = { t, lang, addToast }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ─── Top Bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#991B1B] text-white shadow-lg flex items-center gap-2 px-3 sm:px-4 h-14">
        <button className="lg:hidden p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button onClick={() => setPortal('landing')}
          className="hidden lg:flex items-center gap-1 text-white/70 hover:text-white text-xs font-medium transition-colors">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {t({ en: 'Home', ar: 'الرئيسية' })}
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Shield className="w-5 h-5 text-white/80 flex-shrink-0" />
          <span className="font-bold text-sm sm:text-base truncate">
            {t({ en: 'Civil Defense Portal', ar: 'بوابة الدفاع المدني' })}
          </span>
        </div>

        {/* Tier selector */}
        <div className="relative">
          <button onClick={() => setTierOpen(v => !v)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded text-xs font-medium hover:bg-white/20 transition-colors">
            <span className="truncate max-w-[170px]">{t(activeTier.label)}</span>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
          {tierOpen && (
            <div className="absolute top-full mt-1 end-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
              {TIERS.map(tier_ => (
                <button key={tier_.id} onClick={() => { setTier(tier_.id); setTierOpen(false) }}
                  className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${
                    tier_.id === tier ? 'bg-red-50 text-[#991B1B] font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  {t(tier_.label)}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="relative p-2 rounded hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
          {totalNotif > 0 && (
            <span className="absolute top-0.5 end-0.5 w-4 h-4 bg-amber-400 rounded-full text-[9px] font-bold text-gray-900 flex items-center justify-center">
              {totalNotif}
            </span>
          )}
        </button>

        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="px-2.5 py-1.5 bg-white/10 rounded text-xs font-bold hover:bg-white/20 transition-colors">
          {lang === 'ar' ? 'EN' : 'عر'}
        </button>
      </header>

      {/* Tier 1 — National View */}
      {tier === 1 && (
        <NationalView t={t} lang={lang} addToast={addToast} />
      )}

      {/* Tier 3 — Station/Field View */}
      {tier === 3 && (
        <StationView t={t} lang={lang} addToast={addToast} />
      )}

      {/* Tier 2 — Regional Operations (full 7-module portal) */}
      {tier === 2 && (
        <div className="flex flex-1 min-h-0">
          {/* Desktop sidebar */}
          <aside className={`hidden lg:flex flex-col bg-white border-e border-gray-100 shadow-sm transition-all duration-200 ${
            collapsed ? 'w-16' : 'w-56'
          }`}>
            <button onClick={() => setCollapsed(v => !v)}
              className="flex items-center justify-center h-10 mt-2 mb-1 mx-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors text-xs gap-1.5">
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
                  <button key={id} onClick={() => setModule(id)}
                    title={collapsed ? t(label) : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? 'bg-[#991B1B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${collapsed ? 'justify-center' : ''}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="flex-1 text-start truncate">{t(label)}</span>}
                    {!collapsed && n > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                      }`}>{n}</span>
                    )}
                  </button>
                )
              })}
            </nav>
            {!collapsed && (
              <div className="px-3 pb-4">
                <div className="px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 mb-0.5">{t({ en: 'Active Tier', ar: 'الطبقة النشطة' })}</div>
                  <div className="text-xs font-semibold text-gray-700 truncate">{t(activeTier.label)}</div>
                </div>
              </div>
            )}
          </aside>

          {/* Mobile sidebar overlay */}
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
                      <button key={id} onClick={() => { setModule(id); setMobileOpen(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          active ? 'bg-[#991B1B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                        }`}>
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
                <div className="px-3 pb-4 pt-2 border-t border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1 px-1">{t({ en: 'Switch Tier', ar: 'تبديل الطبقة' })}</div>
                  {TIERS.map(tier_ => (
                    <button key={tier_.id} onClick={() => { setTier(tier_.id); setMobileOpen(false) }}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-colors ${
                        tier_.id === tier ? 'bg-red-50 text-[#991B1B] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      {t(tier_.label)}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
              {module === 'operations'   && <OperationsCenter   {...moduleProps} />}
              {module === 'inspection'   && <DigitalInspection  {...moduleProps} />}
              {module === 'surveillance' && <Surveillance        {...moduleProps} />}
              {module === 'licensing'    && <DigitalLicensing   {...moduleProps} />}
              {module === 'policy'       && <PolicyEngine       {...moduleProps} />}
              {module === 'training'     && <Training           {...moduleProps} />}
              {module === 'awareness'    && <AwarenessPlatform  {...moduleProps} />}
            </div>
          </main>
        </div>
      )}

      {/* Toast stack */}
      <ToastStack toasts={toasts} onClose={removeToast} />
    </div>
  )
}
