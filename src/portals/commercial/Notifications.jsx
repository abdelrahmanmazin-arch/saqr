import { useState } from 'react'
import { daysUntil } from '../../data/seed'
import { Bell, CheckCircle2, AlertTriangle, Info, CheckSquare } from 'lucide-react'

const SURFACE = '#FFFFFF'
const ELEVATED = '#F7F5F2'
const BORDER = 'rgba(0,0,0,0.07)'
const TEXT_PRIMARY = '#18181B'
const TEXT_SECONDARY = '#52525B'

const TYPE_CONFIG = {
  critical: { color: '#EF4444', icon: AlertTriangle },
  warning:  { color: '#F97316', icon: AlertTriangle },
  success:  { color: '#22C55E', icon: CheckCircle2 },
  info:     { color: '#3B82F6', icon: Info },
}

const PRIORITY_COLOR = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#6B7280',
}

export default function Notifications({ t, lang, isRTL, buildings, notifications, setNotifications, tasks }) {
  const [activeTab, setActiveTab] = useState('notifications')

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  const taskGroups = {
    overdue: tasks.filter(t => t.status === 'overdue'),
    pending: tasks.filter(t => t.status === 'pending'),
    completed: tasks.filter(t => t.status === 'completed'),
  }

  return (
    <div className="p-6 space-y-4">
      {/* Tab Bar */}
      <div className="flex gap-1" style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
        {[
          { id: 'notifications', label: { en: `Notifications${unread > 0 ? ` (${unread})` : ''}`, ar: `الإشعارات${unread > 0 ? ` (${unread})` : ''}` } },
          { id: 'tasks', label: { en: 'Tasks', ar: 'المهام' } },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id)}
            style={{
              color: activeTab === tb.id ? '#1E3A5F' : TEXT_SECONDARY,
              borderBottom: `2px solid ${activeTab === tb.id ? '#1E3A5F' : 'transparent'}`,
              marginBottom: -1,
            }}
            className="px-4 py-2 text-sm font-medium transition-colors"
          >
            {t(tb.label)}
          </button>
        ))}
      </div>

      {activeTab === 'notifications' && (
        <>
          <div className="flex justify-end">
            {unread > 0 && (
              <button onClick={markAllRead} style={{ color: '#1E3A5F' }} className="text-xs hover:underline">
                {t({ en: 'Mark all read', ar: 'تحديد الكل كمقروء' })}
              </button>
            )}
          </div>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No notifications', ar: 'لا توجد إشعارات' })}</div>
            ) : (
              <div className="divide-y" style={{ borderColor: BORDER }}>
                {notifications.map(n => {
                  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info
                  const Icon = cfg.icon
                  const bld = buildings.find(b => b.id === n.buildingId)
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      style={{
                        background: n.read ? 'transparent' : '#EFF6FF',
                        borderLeft: `3px solid ${cfg.color}`,
                        cursor: n.read ? 'default' : 'pointer',
                      }}
                      className="px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={14} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div style={{ color: n.read ? TEXT_SECONDARY : TEXT_PRIMARY }} className="text-sm font-medium">{t(n.title)}</div>
                            {!n.read && (
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0, marginTop: 4 }} />
                            )}
                          </div>
                          <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1">{t(n.body)}</div>
                          <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-1.5 flex gap-2">
                            <span className="ltr-num">{n.date}</span>
                            {bld && <span>· {t(bld.name)}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-5">
          {[
            { key: 'overdue', label: { en: 'Overdue', ar: 'متأخرة' }, color: '#EF4444' },
            { key: 'pending', label: { en: 'Pending', ar: 'قيد الانتظار' }, color: '#F97316' },
            { key: 'completed', label: { en: 'Completed', ar: 'مكتملة' }, color: '#22C55E' },
          ].map(group => {
            const groupTasks = taskGroups[group.key]
            if (groupTasks.length === 0) return null
            return (
              <div key={group.key}>
                <div style={{ color: group.color }} className="text-xs font-semibold uppercase tracking-wider mb-2">
                  {t(group.label)} ({groupTasks.length})
                </div>
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
                  {groupTasks.map((task, i) => {
                    const bld = buildings.find(b => b.id === task.buildingId)
                    const days = daysUntil(task.dueDate)
                    return (
                      <div
                        key={task.id}
                        style={{ borderBottom: i < groupTasks.length - 1 ? `1px solid ${BORDER}` : 'none', borderLeft: `3px solid ${PRIORITY_COLOR[task.priority] || TEXT_SECONDARY}` }}
                        className="px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{t(task.title)}</div>
                            <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">
                              {bld ? t(bld.name) : task.buildingId} · {t(task.assignee)}
                            </div>
                          </div>
                          <div className="text-end shrink-0">
                            <div style={{ color: task.status === 'completed' ? '#22C55E' : task.status === 'overdue' || days < 0 ? '#EF4444' : TEXT_SECONDARY }} className="text-xs ltr-num">
                              {task.status === 'completed' ? t({ en: 'Done', ar: 'مكتمل' }) : task.status === 'overdue' || days < 0 ? t({ en: 'Overdue', ar: 'متأخر' }) : `${days}d`}
                            </div>
                            <div style={{ color: TEXT_SECONDARY }} className="text-xs ltr-num">{task.dueDate}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
