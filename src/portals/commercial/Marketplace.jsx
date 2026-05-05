import { useState } from 'react'
import { formatSAR } from '../../data/seed'
import { products } from '../../data/seed'
import { ShoppingCart, Package, Check, Truck, Clock, X } from 'lucide-react'

const SURFACE = '#FFFFFF'
const ELEVATED = '#F3F4F6'
const BORDER = '#E5E7EB'
const GOLD = '#1B4F72'
const TEXT_PRIMARY = '#111827'
const TEXT_SECONDARY = '#6B7280'

const ORDER_STATUS = {
  delivered: { label: { en: 'Delivered', ar: 'تم التسليم' }, color: '#22C55E', icon: Check },
  'in-transit': { label: { en: 'In Transit', ar: 'في الطريق' }, color: '#3B82F6', icon: Truck },
  processing: { label: { en: 'Processing', ar: 'جارٍ المعالجة' }, color: '#EAB308', icon: Clock },
}

export default function Marketplace({ t, lang, isRTL, buildings, orders, addToast }) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('catalog')

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id)
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...product, qty: 1 }]
    })
    addToast(t({ en: `${t(product.name)} added to cart`, ar: `تمت إضافة ${t(product.name)} إلى السلة` }), 'success', 3000)
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(c => c.id !== id))
  }

  function checkout() {
    if (cart.length === 0) return
    addToast(t({ en: 'Order placed successfully', ar: 'تم تقديم الطلب بنجاح' }), 'success', 4000)
    setCart([])
    setCartOpen(false)
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="p-6 space-y-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[
            { id: 'catalog', label: { en: 'Catalog', ar: 'الكتالوج' } },
            { id: 'orders', label: { en: 'My Orders', ar: 'طلباتي' } },
          ].map(tb => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              style={{
                color: activeTab === tb.id ? GOLD : TEXT_SECONDARY,
                borderBottom: `2px solid ${activeTab === tb.id ? GOLD : 'transparent'}`,
              }}
              className="px-4 py-2 text-sm font-medium transition-colors"
            >
              {t(tb.label)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCartOpen(true)}
          style={{ border: `1px solid ${BORDER}`, color: cartCount > 0 ? GOLD : TEXT_SECONDARY }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm relative"
        >
          <ShoppingCart size={14} />
          {t({ en: 'Cart', ar: 'السلة' })}
          {cartCount > 0 && (
            <span style={{ background: '#EF4444', color: 'white' }} className="rounded-full text-xs px-1.5 py-0.5 min-w-[20px] text-center ltr-num">{cartCount}</span>
          )}
        </button>
      </div>

      {/* Catalog */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div style={{ color: TEXT_PRIMARY }} className="font-semibold text-sm">{t(product.name)}</div>
                  <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">{t(product.category)}</div>
                </div>
                {product.badge && (
                  <span style={{ border: `1px solid ${GOLD}`, color: GOLD }} className="text-xs px-2 py-0.5 rounded">{product.badge}</span>
                )}
              </div>
              <ul className="space-y-1 mb-3">
                {(product.features || []).slice(0, 3).map((f, i) => (
                  <li key={i} style={{ color: TEXT_SECONDARY }} className="text-xs flex items-start gap-1.5">
                    <span style={{ color: GOLD, marginTop: 2 }}>·</span>
                    {t(f)}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <div style={{ color: TEXT_SECONDARY }} className="text-xs">{t(product.pricing || { en: 'Contact for pricing', ar: 'تواصل للأسعار' })}</div>
                {product.installed ? (
                  <span style={{ color: '#22C55E' }} className="text-xs flex items-center gap-1"><Check size={12} /> {t({ en: 'Installed', ar: 'مثبّت' })}</span>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    style={{ background: GOLD, color: '#0A0E1A' }}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  >
                    {t({ en: 'Add to Cart', ar: 'أضف للسلة' })}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center" style={{ color: TEXT_SECONDARY }}>{t({ en: 'No orders yet', ar: 'لا توجد طلبات بعد' })}</div>
          ) : (
            <div className="divide-y" style={{ borderColor: BORDER }}>
              {orders.map(order => {
                const st = ORDER_STATUS[order.status] || ORDER_STATUS.processing
                const Icon = st.icon
                const bld = buildings.find(b => b.id === order.buildingId)
                return (
                  <div key={order.id} style={{ borderLeft: `3px solid ${st.color}` }} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{t(order.product)}</div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5">
                          {t({ en: `Qty: ${order.qty}`, ar: `الكمية: ${order.qty}` })} · {t(order.vendor)} · {bld ? t(bld.name) : ''}
                        </div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs mt-0.5 ltr-num">{order.trackingNo}</div>
                      </div>
                      <div className="text-end shrink-0">
                        <div style={{ color: st.color }} className="text-xs flex items-center gap-1 justify-end">
                          <Icon size={12} />
                          {t(st.label)}
                        </div>
                        <div style={{ color: TEXT_SECONDARY }} className="text-xs ltr-num mt-0.5">{order.orderDate}</div>
                        <div style={{ color: TEXT_PRIMARY }} className="text-sm font-semibold mt-1 ltr-num">
                          SAR {(order.qty * order.unitPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div style={{ background: SURFACE, borderLeft: `1px solid ${BORDER}`, width: 340, zIndex: 1 }} className="relative flex flex-col h-full">
            <div style={{ borderBottom: `1px solid ${BORDER}` }} className="p-4 flex items-center justify-between">
              <span style={{ color: TEXT_PRIMARY }} className="font-semibold">{t({ en: 'Cart', ar: 'سلة الشراء' })}</span>
              <button onClick={() => setCartOpen(false)} style={{ color: TEXT_SECONDARY }}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div style={{ color: TEXT_SECONDARY }} className="text-sm text-center mt-8">{t({ en: 'Cart is empty', ar: 'السلة فارغة' })}</div>
              ) : cart.map(item => (
                <div key={item.id} style={{ background: ELEVATED, border: `1px solid ${BORDER}` }} className="rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div style={{ color: TEXT_PRIMARY }} className="text-sm">{t(item.name)}</div>
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs ltr-num">×{item.qty}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: '#EF4444' }}><X size={14} /></button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: `1px solid ${BORDER}` }} className="p-4">
                <button
                  onClick={checkout}
                  style={{ background: GOLD, color: '#0A0E1A' }}
                  className="w-full py-2.5 rounded-lg text-sm font-bold"
                >
                  {t({ en: 'Place Order', ar: 'تقديم الطلب' })}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
