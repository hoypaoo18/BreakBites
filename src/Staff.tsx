import { useEffect, useState } from "react"
import { ChefHat, LoaderCircle, LogOut, RefreshCw } from "lucide-react"
import {
  api,
  money,
  statusLabel,
  orderStores,
  type FoodStore,
  type FoodItem,
  type Order,
  type Status,
} from "./menu"
import OrderStores from './OrderStores'

export default function Staff({
  menu,
  stores,
  onMenuChange,
}: {
  menu: FoodItem[]
  stores: FoodStore[]
  onMenuChange: () => Promise<void>
}) {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem("lian.staff") || ""
    } catch {
      return ""
    }
  })
  const [password, setPassword] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState("orders")
  const [filter, setFilter] = useState("active")
  const [storeFilter, setStoreFilter] = useState('all')
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")
  const [updated, setUpdated] = useState("")
  const auth = { Authorization: `Bearer ${token}` }
  async function refresh() {
    try {
      const result = await api<{ orders: Order[] }>("/staff/orders", {
        headers: auth,
      })
      setOrders(result.orders)
      setUpdated(new Date().toLocaleTimeString("en-PH"))
      setError("")
    } catch (err) {
      setError((err as Error).message)
    }
  }
  useEffect(() => {
    if (!token) return
    let active = true
    async function poll() {
      try {
        const result = await api<{ orders: Order[] }>("/staff/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (active) {
          setOrders(result.orders)
          setUpdated(new Date().toLocaleTimeString("en-PH"))
        }
      } catch (err) {
        if (active) setError((err as Error).message)
      }
    }
    void poll()
    const timer = setInterval(() => void poll(), 5000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [token])
  async function login(event: React.FormEvent) {
    event.preventDefault()
    setBusy("login")
    setError("")
    try {
      const result = await api<{ token: string }>("/staff/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      })
      setToken(result.token)
      setPassword("")
      try {
        sessionStorage.setItem("lian.staff", result.token)
      } catch {}
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy("")
    }
  }
  async function changeStatus(order: Order, storeId: string, status: Status) {
    if (busy) return
    setBusy(order.id)
    setError("")
    try {
      await api(`/staff/orders/${order.id}`, {
        method: "PATCH",
        headers: auth,
        body: JSON.stringify({ status, storeId }),
      })
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy("")
    }
  }
  async function updateItem(item: FoodItem, price: number, soldOut: boolean) {
    if (busy) return
    setBusy(item.id)
    setError("")
    try {
      await api(`/staff/menu/${item.id}`, {
        method: "PATCH",
        headers: auth,
        body: JSON.stringify({ price, soldOut }),
      })
      await onMenuChange()
      return true
    } catch (err) {
      setError((err as Error).message)
      return false
    } finally {
      setBusy("")
    }
  }
  if (!token)
    return (
      <div className="staff-login panel">
        <ChefHat size={36} />
        <h1>Staff sign in</h1>
        <p>Manage the menu and incoming orders.</p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={login}>
          <label>
            Staff password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button disabled={!!busy} className="primary full">
            {busy ? <LoaderCircle className="spin" size={17} /> : "Sign in"}
          </button>
        </form>
      </div>
    )
  const visible = orders.filter(order => orderStores(order).some(part =>
    (storeFilter === 'all' || part.storeId === storeFilter) &&
    (filter === 'all' || (filter === 'active' ? !['completed','cancelled'].includes(part.status) : part.status === filter))
  ))
  const legacyStore = orders.some(order => orderStores(order).some(part => part.storeId === 'legacy-counter'))
  return (
    <>
      <div className="section-heading">
        <div>
          <h1>Staff counter</h1>
          <p>Central staff counter · Manage each stall’s orders and menu.</p>
        </div>
        <button
          className="secondary"
          onClick={async () => {
            try {
              await api("/staff/logout", { method: "POST", headers: auth })
            } catch {}
            setToken("")
            try {
              sessionStorage.removeItem("lian.staff")
            } catch {}
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <label className="staff-store-selector">Food stall <select value={storeFilter} onChange={event => setStoreFilter(event.target.value)}><option value="all">All 9 stores</option>{stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}{legacyStore && <option value="legacy-counter">Earlier counter orders</option>}</select></label>
      <div className="categories">
        <button
          className={tab === "orders" ? "selected" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={tab === "menu" ? "selected" : ""}
          onClick={() => setTab("menu")}
        >
          Menu & prices
        </button>
      </div>
      {tab === "orders" ? (
        <>
          <div className="staff-toolbar">
            <label>
              Show{" "}
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="active">Active orders</option>
                <option value="all">All orders</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <button className="secondary" onClick={refresh}>
              <RefreshCw size={15} />
              Refresh
            </button>
            <span className="muted">
              {updated ? `Updated ${updated}` : "Loading orders…"}
            </span>
          </div>
          {!visible.length ? (
            <div className="empty panel">
              <ReceiptIcon />
              <h2>No orders in this view</h2>
              <p>Incoming orders will appear here automatically.</p>
            </div>
          ) : (
            <div className="orders-list">
              {visible.map((order) => (
                <article className="panel order-card" key={order.id}>
                  <div className="order-heading">
                    <div>
                      <span className="eyebrow">{order.id}</span>
                      <h2>
                        {order.name} ·{" "}
                        {order.type === "takeout" ? "Takeout" : "Dine in"}
                      </h2>
                      <p>{new Date(order.createdAt).toLocaleString("en-PH")}</p>
                    </div>
                    <span className={`status status-${order.status}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <OrderStores order={order} storeFilter={storeFilter} busy={!!busy} onStatus={(storeId,status) => void changeStatus(order,storeId,status)}/>
                  {order.notes && (
                    <p className="staff-notes">Customer note: {order.notes}</p>
                  )}
                  <div className="summary-total">
                    <span>{storeFilter === 'all' ? 'Active order total across stores' : 'Active amount at selected store'}</span>
                    <strong>{money(storeFilter === 'all' ? (order.amountDue ?? order.total) : orderStores(order).filter(part => part.storeId === storeFilter && part.status !== 'cancelled').reduce((sum,part) => sum + part.total,0))}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <section className="panel staff-menu">
          <h2>Menu & prices</h2>
          <p className="muted">
            These are starter prices. Update them to match the cafeteria’s
            actual menu.
          </p>
          {menu.filter(item => storeFilter === 'all' || item.storeId === storeFilter).map((item) => (
            <MenuEditor
              key={`${item.id}-${item.price}-${item.soldOut}`}
              item={item}
              storeName={stores.find(store => store.id === item.storeId)?.name || 'Cafeteria counter'}
              disabled={!!busy}
              onSave={updateItem}
            />
          ))}
        </section>
      )}
    </>
  )
}
function ReceiptIcon() {
  return <ChefHat size={36} />
}
function MenuEditor({
  item,
  storeName,
  disabled,
  onSave,
}: {
  item: FoodItem
  storeName: string
  disabled: boolean
  onSave: (
    item: FoodItem,
    price: number,
    soldOut: boolean,
  ) => Promise<boolean | undefined>
}) {
  const [price, setPrice] = useState(String(item.price))
  const [soldOut, setSoldOut] = useState(item.soldOut)
  const [saved, setSaved] = useState(false)
  return (
    <form
      className="menu-editor"
      onSubmit={async (event) => {
        event.preventDefault()
        setSaved((await onSave(item, Number(price), soldOut)) === true)
      }}
    >
      <strong>{item.name}<small className="summary-store-name">{storeName}</small></strong>
      <label>
        Price (₱)
        <input
          type="number"
          min="0.01"
          max="10000"
          step="0.01"
          required
          disabled={disabled}
          value={price}
          onChange={(event) => {
            setPrice(event.target.value)
            setSaved(false)
          }}
        />
      </label>
      <label className="check-label">
        <input
          type="checkbox"
          disabled={disabled}
          checked={soldOut}
          onChange={(event) => {
            setSoldOut(event.target.checked)
            setSaved(false)
          }}
        />
        Sold out
      </label>
      <button className="secondary" disabled={disabled}>
        {saved ? "Saved" : "Save"}
      </button>
    </form>
  )
}
