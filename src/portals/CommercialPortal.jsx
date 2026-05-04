import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { buildings as allBuildings } from '../data/seed'
import {
  owners, bsoProfile,
  commercialNotifications, scheduledTasks, maintenanceReports,
  commercialViolations, autoReports, marketplaceOrders,
} from '../data/commercialData'
import OwnerDashboard from './commercial/OwnerDashboard'
import BuildingDetail from './commercial/BuildingDetail'
import Notifications from './commercial/Notifications'
import Marketplace from './commercial/Marketplace'
import Reports from './commercial/Reports'
import BSOView from './commercial/BSOView'
import {
  LayoutDashboard, Building2, Bell, ShoppingBag, FileText,
  Globe, ChevronLeft, ChevronRight,
} from 'lucide-react'

const BG = '#0A0E1A'
const SURFACE = '#111827'
const ELEVATED = '#1F2937'
const BORDER = '#2D3748'
const GOLD = '#C9A84C'
const TEXT_PRIMARY = '#F9FAFB'
const TEXT_SECONDARY = '#9CA3AF'

const NAV_ITEMS = [
  { id: 'dashboard',       icon: LayoutDashboard, label: { en: 'Dashboard', ar: 'لوحة التحكم' } },
  { id: 'building-detail', icon: Building2,       label: { en: 'Buildings', ar: 'المباني' } },
  { id: 'notifications',   icon: Bell,            label: { en: 'Notifications', ar: 'الإشعارات' } },
  { id: 'marketplace',     icon: ShoppingBag,     label: { en: 'Marketplace', ar: 'المتجر' } },
  { id: 'reports',         icon: FileText,        label: { en: 'Reports', ar: 'التقارير' } },
]

export default function CommercialPortal() {
  const { lang, setLang, t, setPortal } = useApp()
  const isRTL = lang === 'ar'

  const [role, setRole] = useState('owner')
  const [section, setSection] = useState('dashboard')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [activeOwnerIdx, setActiveOwnerIdx] = useState(0)
  const [notifications, setNotifications] = useState(commercialNotifications)
  const [toasts, setToasts] = useState([])

  const activeOwner = owners[activeOwnerIdx]
  const ownerBuildings = allBuildings.filter(b => activeOwner.buildingIds.includes(b.id))
  const unreadCount = notifications.filter(n => !n.read).length

  function addToast(msg, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), duration)
  }

  function navTo(id) {
    setSection(id)
    if (id !== 'building-detail') setSelectedBuilding(null)
  }

  const moduleProps = { t, lang, isRTL, addToast, buildings: ownerBuildings, allBuildings }

  if (role === 'bso') {
    return (
      <BSOView
        {...moduleProps}
        bsoProfile={bsoProfile}
        onRoleSwitch={() => setRole('owner')}
        onBack={() => setPortal('landing')}
      />
    )
  }

  const toastBorderColor = { critical: '#EF4444', warning: '#F97316', success: '#22C55E', info: '#3B82F6' }

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, height: 56 }} className="flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => setPortal('landing')} style={{ color: TEXT_SECONDARY }} className="text-sm hover:text-[#F9FAFB] flex items-center gap-1 transition-colors">
            {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {t({ en: 'Home', ar: 'الرئيسية' })}
          </button>
          <div style={{ width: 1, height: 20, background: BORDER }} />
          <span style={{ color: GOLD }} className="font-bold tracking-wide">
            SAQR <span style={{ color: TEXT_SECONDARY }} className="font-normal text-sm">{t({ en: 'Commercial', ar: 'التجاري' })}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Owner switcher */}
          <div style={{ background: ELEVATED, border: `1px solid ${BORDER}` }} className="flex rounded-lg overflow-hidden text-xs">
            {owners.map((o, i) => (
              <button key={o.id} onClick={() => { setActiveOwnerIdx(i); setSelectedBuilding(null); setSection('dashboard') }}
                style={{ background: activeOwnerIdx === i ? GOLD : 'transparent', color: activeOwnerIdx === i ? '#0A0E1A' : TEXT_SECONDARY, padding: '5px 10px' }}
                className="font-medium transition-colors">{o.avatarInitials}</button>
            ))}
          </div>
          {/* Role switcher */}
          <div style={{ background: ELEVATED, border: `1px solid ${BORDER}` }} className="flex rounded-lg overflow-hidden text-xs">
            {[{ id: 'owner', label: { en: 'Owner', ar: 'المالك' } }, { id: 'bso', label: { en: 'BSO', ar: 'BSO' } }].map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                style={{ background: role === r.id ? GOLD : 'transparent', color: role === r.id ? '#0A0E1A' : TEXT_SECONDARY, padding: '5px 12px' }}
                className="font-medium transition-colors">{t(r.label)}</button>
            ))}
          </div>
          {/* Language */}
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:text-[#F9FAFB] transition-colors">
            <Globe size={12} />{lang === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <aside style={{ background: SURFACE, borderInlineEnd: `1px solid ${BORDER}`, width: 220 }} className="flex flex-col py-4 shrink-0 overflow-y-auto">
          <div className="px-4 pb-4 mb-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT_SECONDARY }} className="text-xs mb-1">{t({ en: 'Viewing as', ar: 'العرض بصفة' })}</div>
            <div style={{ color: TEXT_PRIMARY }} className="font-semibold text-sm">{t(activeOwner.name)}</div>
            <div style={{ color: TEXT_SECONDARY }} className="text-xs leading-snug">{t(activeOwner.company)}</div>
            <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{ownerBuildings.length} {t({ en: 'buildings', ar: 'مبانٍ' })}</div>
          </div>
          <nav className="flex-1 px-2 space-y-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const isActive = section === item.id
              const badge = item.id === 'notifications' ? unreadCount : 0
              return (
                <button key={item.id} onClick={() => navTo(item.id)}
                  style={{ background: isActive ? ELEVATED : 'transparent', color: isActive ? GOLD : TEXT_SECONDARY, borderInlineStart: `3px solid ${isActive ? GOLD : 'transparent'}` }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors">
                  <Icon size={16} />
                  <span className="flex-1 text-start">{t(item.label)}</span>
                  {badge > 0 && <span style={{ background: '#EF4444', color: 'white' }} className="text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center ltr-num">{badge}</span>}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {section === 'dashboard' && (
            <OwnerDashboard {...moduleProps} owner={activeOwner} onSelectBuilding={b => { setSelectedBuilding(b); setSection('building-detail') }} addToast={addToast} />
          )}
          {section === 'building-detail' && (
            <BuildingDetail {...moduleProps} building={selectedBuilding} onSelectBuilding={setSelectedBuilding} />
          )}
          {section === 'notifications' && (
            <Notifications {...moduleProps} notifications={notifications} setNotifications={setNotifications} tasks={scheduledTasks} />
          )}
          {section === 'marketplace' && <Marketplace {...moduleProps} orders={marketplaceOrders} />}
          {section === 'reports' && <Reports {...moduleProps} reports={autoReports} />}
        </main>
      </div>

      {/* Toast Stack */}
      <div className="fixed bottom-4 end-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} style={{ background: ELEVATED, borderLeft: `4px solid ${toastBorderColor[toast.type] || '#3B82F6'}`, color: TEXT_PRIMARY, maxWidth: 340, pointerEvents: 'auto' }} className="px-4 py-3 rounded-lg shadow-2xl text-sm">
            {toast.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
