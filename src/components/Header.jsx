import { useApp } from '../context/AppContext'
import { ui } from '../data/i18n'
import { ShieldAlert, Globe, ArrowLeft } from 'lucide-react'

const portalColors = {
  commercial: 'bg-[#1B4F72]',
  cd:         'bg-[#991B1B]',
  insurance:  'bg-[#0F1F3D]',
  landing:    'bg-[#1B2F5B]',
}

export default function Header({ onNavClick, activeSection }) {
  const { lang, setLang, portal, setPortal, t } = useApp()
  const isLanding = portal === 'landing'
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const bgColor = portalColors[portal] ?? 'bg-[#1B2F5B]'

  return (
    <header className={`${bgColor} text-white sticky top-0 z-50 shadow-md`} dir={dir}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!isLanding && (
              <button
                onClick={() => setPortal('landing')}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors mr-1"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPortal('landing')}>
              <div className="w-8 h-8 bg-[#C5A028] rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[#C5A028] font-bold text-base leading-tight">
                  {t(ui.platformName)}
                </div>
                <div className="text-white/60 text-[10px] leading-tight">
                  {t(ui.madaniTech)}
                </div>
              </div>
            </div>
          </div>

          {/* Portal name (non-landing) */}
          {!isLanding && (
            <div className="hidden sm:block text-white/80 text-sm font-medium">
              {portal === 'commercial' && t(ui.commercialPortal)}
              {portal === 'cd'         && t(ui.cdPortal)}
              {portal === 'insurance'  && t(ui.insurancePortal)}
            </div>
          )}

          {/* Nav sections (non-landing) */}
          {!isLanding && onNavClick && (
            <nav className="hidden lg:flex items-center gap-1">
              {getNavItems(portal).map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t(item.label)}
                </button>
              ))}
            </nav>
          )}

          {/* Lang toggle */}
          <button
            onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>
      </div>
    </header>
  )
}

function getNavItems(portal) {
  if (portal === 'commercial') return [
    { id: 'dashboard', label: ui.dashboard },
    { id: 'buildings', label: ui.buildings },
    { id: 'alerts', label: ui.alerts },
    { id: 'marketplace', label: ui.marketplace },
    { id: 'reports', label: ui.reports },
  ]
  if (portal === 'cd') return [
    { id: 'operations', label: ui.operations },
    { id: 'inspection', label: ui.inspection },
    { id: 'surveillance', label: ui.surveillance },
    { id: 'licensing', label: ui.licensing },
    { id: 'policy', label: ui.policyEngine },
    { id: 'training', label: ui.training },
    { id: 'awareness', label: ui.awareness },
  ]
  if (portal === 'insurance') return [
    { id: 'portfolio', label: ui.portfolio },
    { id: 'pricing', label: ui.pricing },
    { id: 'loss', label: ui.lossData },
  ]
  return []
}
