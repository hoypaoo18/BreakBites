import { money, orderStores, statusLabel, type Order, type Status } from './menu'
const next: Partial<Record<Status, {
  status: Status
  label: string
}>> = {
  queued: { status: 'preparing', label: 'Confirm & prepare' },
  preparing: { status: 'ready', label: 'Mark ready' },
  ready: { status: 'completed', label: 'Mark collected' },
}
export default function OrderStores({order, storeFilter = 'all', busy = false, onStatus}: {
  order: Order
  storeFilter?: string
  busy?: boolean
  onStatus?: (storeId: string, status: Status) => void
}) {
  return <div className="store-order-sections">{orderStores(order).filter(part => storeFilter === 'all' || part.storeId === storeFilter).map(part => <section className="store-order-section" key={part.storeId}>
    <div className="store-order-heading"><h3>{part.storeName}</h3><span className={`status status-${part.status}`}>{statusLabel[part.status]}</span></div>
    <div className="receipt-lines">{order.items.filter(item => (item.storeId || 'legacy-counter') === part.storeId).map(item => <div key={item.id}><span>{item.quantity} × {item.name}</span><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
    <div className="store-order-total"><span>{part.status === 'cancelled' ? 'Cancelled · Nothing due' : part.status === 'completed' ? 'Collected order amount' : 'Pay at this store'}</span><strong>{money(part.status === 'cancelled' ? 0 : part.total)}</strong></div>
    {!onStatus && part.status === 'ready' && <p className="store-pickup-note">Ready at {part.storeName}. Show order {order.id} and pay at this stall before collecting.</p>}
    {onStatus && <div className="staff-actions">{next[part.status] && <button className="primary" disabled={busy} onClick={() => onStatus(part.storeId, next[part.status]!.status)}>{next[part.status]!.label}</button>}{['queued','preparing'].includes(part.status) && <button className="danger-button" disabled={busy} onClick={() => { if(window.confirm(`Cancel only the ${part.storeName} items in order ${order.id}?`)) onStatus(part.storeId,'cancelled') }}>Cancel this store order</button>}</div>}
  </section>)}</div>
}
