import { useState, useEffect, useRef } from 'react'
import { daysUntil } from '../../data/seed'
import { scheduledTasks } from '../../data/commercialData'
import { Shield, AlertTriangle, CheckCircle2, Clock, Phone, Radio, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react'

const BG = '#F7F5F2'
const SURFACE = '#FFFFFF'
const ELEVATED = '#F7F5F2'
const BORDER = 'rgba(0,0,0,0.07)'
const GOLD = '#1E3A5F'
const TEXT_PRIMARY = '#18181B'
const TEXT_SECONDARY = '#52525B'

const MOCK_ALERT = {
  id: 'alert-bso-001',
  buildingId: 'bld-001',
  buildingName: { en: 'Al Faisaliah Complex — Level 22', ar: 'مجمع الفيصلية — الطابق 22' },
  type: { en: 'Smoke Detector Triggered', ar: 'تفعّل كاشف الدخان' },
  time: '02:14:33',
  severity: 'critical',
}

export default function BSOView({ t, lang, isRTL, buildings, bsoProfile, addToast, onRoleSwitch, onBack }) {
  const [onDuty, setOnDuty] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertCountdown, setAlertCountdown] = useState(60)
  const [alertResponse, setAlertResponse] = useState(null)
  const countdownRef = useRef(null)

  const myTasks = scheduledTasks.filter(t => bsoProfile.assignedBuildings.includes(t.buildingId))
  const overdueCount = myTasks.filter(t => t.status === 'overdue').length

  function toggleDuty() {
    const next = !onDuty
    setOnDuty(next)
    addToast(t(next ? { en: 'You are now ON DUTY', ar: 'أنت الآن في نوبة عمل' } : { en: 'You are now OFF DUTY', ar: 'انتهت نوبة عملك' }), next ? 'success' : 'info', 3000)
    if (next) {
      setTimeout(() => setShowAlert(true), 4000)
    }
  }

  useEffect(() => {
    if (!showAlert || alertResponse) {
      if (countdownRef.current) clearInterval(countdownRef.current)
      return
    }
    setAlertCountdown(60)
    countdownRef.current = setInterval(() => {
      setAlertCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          setAlertResponse('auto-escalated')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(countdownRef.current)
  }, [showAlert, alertResponse])

  function respondAlert(response) {
    clearInterval(countdownRef.current)
    setAlertResponse(response)
    addToast(t({
      'confirm': { en: 'Incident confirmed — CD notified', ar: 'تأكيد الحادثة — تم إخطار الدفاع المدني' },
      'false-alarm': { en: 'False alarm recorded', ar: 'تم تسجيل إنذار كاذب' },
      'request-support': { en: 'Support requested — CD dispatching', ar: 'طلب دعم — الدفاع المدني يتحرك' },
    }[response]), response === 'false-alarm' ? 'info' : 'critical', 5000)
  }

  function dismissAlert() {
    setShowAlert(false)
    setAlertResponse(null)
    setAlertCountdown(60)
  }

  const certStatusColor = { active: '#22C55E', expired: '#EF4444' }

  // 60-second full-screen alert takeover
  if (showAlert && !alertResponse) {
    const pct = (alertCountdown / 60) * 100
    const circumference = 2 * Math.PI * 40
    const dashOffset = circumference * (1 - pct / 100)
    return (
      <div style={{ background: '#1A0000', minHeight: '100vh', color: TEXT_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col items-center justify-center p-8">
        <div style={{ border: '2px solid #EF4444' }} className="rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div style={{ color: '#EF4444' }} className="text-xs font-bold uppercase tracking-widest">{t({ en: 'ACTIVE INCIDENT ALERT', ar: 'تنبيه حادثة نشطة' })}</div>
          <div>
            <div style={{ color: TEXT_PRIMARY }} className="text-2xl font-bold">{t(MOCK_ALERT.type)}</div>
            <div style={{ color: '#EF4444' }} className="text-sm mt-1">{t(MOCK_ALERT.buildingName)}</div>
            <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1 ltr-num">{MOCK_ALERT.time}</div>
          </div>
          {/* SVG Countdown Ring */}
          <div className="flex justify-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2D3748" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={alertCountdown > 20 ? '#EF4444' : '#F97316'}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'stroke-dashoffset 1s linear' }}
              />
              <text x="50" y="56" textAnchor="middle" fill={TEXT_PRIMARY} fontSize="20" fontWeight="bold">{alertCountdown}</text>
            </svg>
          </div>
          <div style={{ color: TEXT_SECONDARY }} className="text-xs">{t({ en: 'Response required within 60 seconds or auto-escalated to CD', ar: 'مطلوب الرد خلال 60 ثانية وإلا سيُحال تلقائياً للدفاع المدني' })}</div>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => respondAlert('confirm')} style={{ background: '#EF4444', color: 'white' }} className="w-full py-3 rounded-xl font-bold text-sm">
              {t({ en: 'CONFIRM INCIDENT — Alert CD', ar: 'تأكيد الحادثة — إخطار الدفاع المدني' })}
            </button>
            <button onClick={() => respondAlert('request-support')} style={{ background: '#F97316', color: 'white' }} className="w-full py-2.5 rounded-xl font-semibold text-sm">
              {t({ en: 'REQUEST SUPPORT', ar: 'طلب دعم' })}
            </button>
            <button onClick={() => respondAlert('false-alarm')} style={{ border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }} className="w-full py-2.5 rounded-xl text-sm">
              {t({ en: 'False Alarm — Log & Dismiss', ar: 'إنذار كاذب — تسجيل وإغلاق' })}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Post-response screen
  if (showAlert && alertResponse) {
    const responseConfig = {
      'confirm': { label: { en: 'Incident Confirmed', ar: 'تم تأكيد الحادثة' }, color: '#EF4444' },
      'false-alarm': { label: { en: 'False Alarm Logged', ar: 'تم تسجيل إنذار كاذب' }, color: '#22C55E' },
      'request-support': { label: { en: 'Support Requested', ar: 'تم طلب الدعم' }, color: '#F97316' },
      'auto-escalated': { label: { en: 'Auto-Escalated to CD', ar: 'تم الإحالة التلقائية للدفاع المدني' }, color: '#EF4444' },
    }[alertResponse]
    return (
      <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col items-center justify-center p-8">
        <div style={{ background: SURFACE, border: `2px solid ${responseConfig.color}` }} className="rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div style={{ color: responseConfig.color }} className="text-lg font-bold">{t(responseConfig.label)}</div>
          <div style={{ color: TEXT_SECONDARY }} className="text-sm">{t({ en: 'Incident logged. CD has been notified.', ar: 'تم تسجيل الحادثة. تم إخطار الدفاع المدني.' })}</div>
          <button onClick={dismissAlert} style={{ background: GOLD, color: 'white' }} className="px-6 py-2.5 rounded-xl font-bold text-sm">
            {t({ en: 'Return to Dashboard', ar: 'العودة للوحة التحكم' })}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* BSO Top Bar */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }} className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ color: TEXT_SECONDARY }} className="text-xs flex items-center gap-1">
            {isRTL ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            {t({ en: 'Back', ar: 'رجوع' })}
          </button>
          <div style={{ width: 1, height: 16, background: BORDER }} />
          <Shield size={14} style={{ color: GOLD }} />
          <span style={{ color: TEXT_PRIMARY }} className="font-semibold text-sm">{t({ en: 'BSO Dashboard', ar: 'لوحة مسؤول السلامة' })}</span>
        </div>
        <button onClick={onRoleSwitch} style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }} className="text-xs px-3 py-1.5 rounded-lg">
          {t({ en: 'Switch to Owner', ar: 'التبديل للمالك' })}
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* BSO Profile + Duty Toggle */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div style={{ color: TEXT_PRIMARY }} className="font-bold">{t(bsoProfile.name)}</div>
              <div style={{ color: TEXT_SECONDARY }} className="text-xs ltr-num">{bsoProfile.badgeNo}</div>
            </div>
            <button
              onClick={toggleDuty}
              style={{
                background: onDuty ? '#22C55E' : ELEVATED,
                border: `2px solid ${onDuty ? '#22C55E' : BORDER}`,
                color: onDuty ? '#0A0E1A' : TEXT_SECONDARY,
              }}
              className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
            >
              {onDuty ? t({ en: 'ON DUTY', ar: 'في الخدمة' }) : t({ en: 'OFF DUTY', ar: 'خارج الخدمة' })}
            </button>
          </div>
          {onDuty && overdueCount > 0 && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '3px solid #EF4444' }} className="mt-3 rounded-lg px-3 py-2">
              <div style={{ color: '#EF4444' }} className="text-xs font-semibold">
                {t({ en: `${overdueCount} overdue task${overdueCount > 1 ? 's' : ''} require attention`, ar: `${overdueCount} مهمة متأخرة تحتاج اهتماماً` })}
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider">{t({ en: 'Certifications', ar: 'الشهادات والاعتمادات' })}</div>
          </div>
          {bsoProfile.certifications.map((cert, i) => {
            const days = daysUntil(cert.expiry)
            const isExpired = cert.status === 'expired' || days < 0
            const isExpiring = !isExpired && days < 90
            return (
              <div
                key={cert.id}
                style={{ borderBottom: i < bsoProfile.certifications.length - 1 ? `1px solid ${BORDER}` : 'none', borderLeft: `3px solid ${isExpired ? '#EF4444' : isExpiring ? '#EAB308' : '#22C55E'}` }}
                className="px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{t(cert.name)}</div>
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">{t(cert.issuer)}</div>
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs ltr-num mt-0.5">{cert.issued} → {cert.expiry}</div>
                  </div>
                  <span style={{ color: isExpired ? '#EF4444' : isExpiring ? '#EAB308' : '#22C55E' }} className="text-xs font-semibold shrink-0">
                    {isExpired ? t({ en: 'Expired', ar: 'منتهي' }) : isExpiring ? t({ en: `${days}d`, ar: `${days}ي` }) : t({ en: 'Valid', ar: 'ساري' })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Inspection Task Queue */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold uppercase tracking-wider">{t({ en: 'Task Queue', ar: 'قائمة المهام' })}</div>
          </div>
          {myTasks.length === 0 ? (
            <div className="p-4" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No tasks assigned', ar: 'لا توجد مهام مسندة' })}</div>
          ) : (
            <div className="divide-y" style={{ borderColor: BORDER }}>
              {myTasks.map(task => {
                const days = daysUntil(task.dueDate)
                const isOverdue = task.status === 'overdue' || days < 0
                const isDone = task.status === 'completed'
                const bld = buildings.find(b => b.id === task.buildingId)
                return (
                  <div key={task.id} style={{ borderLeft: `3px solid ${isDone ? '#22C55E' : isOverdue ? '#EF4444' : task.priority === 'critical' || task.priority === 'high' ? '#F97316' : TEXT_SECONDARY}` }} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div style={{ color: TEXT_PRIMARY }} className="text-sm">{t(task.title)}</div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs">{bld ? t(bld.name) : ''}</div>
                      </div>
                      <div style={{ color: isDone ? '#22C55E' : isOverdue ? '#EF4444' : TEXT_SECONDARY }} className="text-xs ltr-num">
                        {isDone ? t({ en: 'Done', ar: 'مكتمل' }) : isOverdue ? t({ en: 'Overdue', ar: 'متأخر' }) : `${days}d`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Simulate Incident Alert */}
        {onDuty && !showAlert && (
          <button
            onClick={() => setShowAlert(true)}
            style={{ border: '1px solid #EF4444', color: '#EF4444' }}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            <AlertTriangle size={14} />
            {t({ en: 'Simulate Incident Alert (60s)', ar: 'محاكاة تنبيه حادثة (60 ث)' })}
          </button>
        )}
      </div>
    </div>
  )
}
