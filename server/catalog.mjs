import { readFileSync } from 'node:fs'
export const starterStores = JSON.parse(readFileSync(new URL('./stores.json', import.meta.url), 'utf8'))
export const starterMenu = JSON.parse(readFileSync(new URL('./menu.json', import.meta.url), 'utf8'))
export function groupItems(items, status = 'queued') {
  const groups = new Map()
  for (const item of items) {
    const storeId = item.storeId || 'legacy-counter'
    if (!groups.has(storeId)) groups.set(storeId, { storeId, storeName: item.storeName || 'Cafeteria counter (earlier order)', status, total: 0 })
    groups.get(storeId).total += Math.round(item.price * 100) * item.quantity
  }
  return [...groups.values()].map(group => ({ ...group, total: group.total / 100 }))
}
export function aggregateStatus(fulfillments) {
  const active = fulfillments.filter(part => part.status !== 'cancelled')
  if (!active.length) return 'cancelled'
  if (active.every(part => part.status === 'completed')) return 'completed'
  if (active.every(part => ['ready', 'completed'].includes(part.status))) return 'ready'
  if (active.some(part => part.status === 'queued')) return 'queued'
  return 'preparing'
}
export function amountDue(fulfillments) {
  return fulfillments.filter(part => part.status !== 'cancelled').reduce((sum, part) => sum + Math.round(part.total * 100), 0) / 100
}
export function migrateCatalog(db) {
  if ((db.schemaVersion || 1) >= 2) return false
  db.stores = starterStores.map(store => ({ ...store }))
  for (const seed of starterMenu) {
    const existing = db.menu.find(item => item.id === seed.id)
    if (existing) {
      existing.storeId = seed.storeId
    } else db.menu.push({ ...seed })
  }
  for (const order of db.orders) {
    // Earlier orders belong to the earlier central counter, not newly added stalls.
    for (const item of order.items) {
      item.storeId ||= 'legacy-counter'
      item.storeName ||= 'Cafeteria counter (earlier order)'
    }
    order.fulfillments ||= groupItems(order.items, order.status)
    order.amountDue ??= amountDue(order.fulfillments)
  }
  db.schemaVersion = 2
  return true
}
