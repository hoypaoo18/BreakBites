import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Heart,
  LoaderCircle,
  Minus,
  Plus,
  ReceiptText,
  Search,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react"
import {
  api,
  money,
  statusLabel,
  type FoodStore,
  type CartLine,
  type FoodItem,
  type Order,
} from "./menu"
import Staff from "./Staff"
import OrderStores from './OrderStores'

type Receipt = {
  order: Order
  token: string
}
const symbols: Record<string, string> = {
  "Rice Meals": "🍛",
  Noodles: "🍜",
  Soups: "🥣",
  Snacks: "🍘",
  Drinks: "🥤",
  Extras: "🍚",
  Sandwiches: "🥪",
  Bakery: "🥐",
}
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback
  } catch {
    return fallback
  }
}
function initialCart(): CartLine[] {
  const value = read<unknown>("lian.cart.v2", [])
  if (!Array.isArray(value)) return []
  const ids = new Set<string>()
  return value.filter((line): line is CartLine => {
    if (
      !line ||
      typeof line.id !== "string" ||
      ids.has(line.id) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 20
    )
      return false
    ids.add(line.id)
    return true
  })
}
function initialReceipts(): Receipt[] {
  const value = read<unknown>("lian.receipts.v2", [])
  return Array.isArray(value)
    ? value.filter(
        (entry) =>
          entry?.order?.id &&
          typeof entry.token === "string" &&
          Array.isArray(entry.order.items),
      )
    : []
}
function initialDraft() {
  const value = read<Record<string, unknown> | null>("lian.checkout.v2", null)
  return {
    name: typeof value?.name === "string" ? value.name.slice(0, 80) : "",
    notes: typeof value?.notes === "string" ? value.notes.slice(0, 300) : "",
    type: value?.type === "dine-in" ? "dine-in" as const : "takeout" as const,
    requestId:
      typeof value?.requestId === "string" &&
      /^[a-zA-Z0-9-]{16,80}$/.test(value.requestId)
        ? value.requestId
        : crypto.randomUUID(),
  }
}
export default function ModernApp() {
  const [draft] = useState(initialDraft)
  const [page, setPage] =
    useState<"menu" | "cart" | "checkout" | "orders" | "staff">("menu")
  const [menu, setMenu] = useState<FoodItem[]>([])
  const [stores, setStores] = useState<FoodStore[]>([])
  const [selectedStore, setSelectedStore] = useState('all')
  const [loading, setLoading] = useState(true)
  const [menuError, setMenuError] = useState("")
  const [cart, setCart] = useState<CartLine[]>(initialCart)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const value = read<unknown>("lian.favorites.v2", [])
    return Array.isArray(value)
      ? value.filter((id) => typeof id === "string")
      : []
  })
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [savedOnly, setSavedOnly] = useState(false)
  const [sort, setSort] = useState("default")
  const [detail, setDetail] = useState<FoodItem | null>(null)
  const [name, setName] = useState(draft.name)
  const [type, setType] = useState<"takeout" | "dine-in">(draft.type)
  const [notes, setNotes] = useState(draft.notes)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [storageError, setStorageError] = useState("")
  const requestId = useRef(draft.requestId)
  const submitting = useRef(false)
  const detailRef = useRef<HTMLDialogElement>(null)

  async function loadMenu() {
    setMenuError("")
    try {
      const result = await api<{ items: FoodItem[], stores: FoodStore[] }>("/menu")
      setMenu(result.items)
      setStores(result.stores)
    } catch (err) {
      setMenuError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    void loadMenu()
    const timer = setInterval(() => void loadMenu(), 15000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("lian.receipts.v2", JSON.stringify(receipts))
      localStorage.setItem("lian.cart.v2", JSON.stringify(cart))
      localStorage.setItem("lian.favorites.v2", JSON.stringify(favorites))
      localStorage.setItem(
        "lian.checkout.v2",
        JSON.stringify({ name, type, notes, requestId: requestId.current }),
      )
      setStorageError("")
    } catch {
      setStorageError(
        "Your browser could not save your cart or order history. Keep this page open.",
      )
    }
  }, [cart, favorites, receipts, name, type, notes])
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(""), 2800)
    return () => clearTimeout(timer)
  }, [message])
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setError("")
  }, [page])
  useEffect(() => {
    if (detail) detailRef.current?.showModal()
    else if (detailRef.current?.open) detailRef.current.close()
  }, [detail])
  useEffect(() => {
    if (page !== "orders") return
    let active = true
    async function update() {
      const updated = await Promise.allSettled(
        receipts.map(async (receipt) => {
          const result = await api<{ order: Order }>(
            `/orders/${receipt.order.id}`,
            { headers: { Authorization: `Bearer ${receipt.token}` } },
          )
          return { ...receipt, order: result.order }
        }),
      )
      if (!active) return
      const failed = updated.find((result) => result.status === "rejected")
      setError(failed?.status === "rejected" ? failed.reason.message : "")
      setReceipts((current) =>
        current.map((receipt) => {
          const result = updated.find(
            (entry) =>
              entry.status === "fulfilled" &&
              entry.value.order.id === receipt.order.id,
          )
          return result?.status === "fulfilled" ? result.value : receipt
        }),
      )
    }
    void update()
    const timer = setInterval(() => void update(), 5000)
    return () => {
      active = false
      clearInterval(timer)
    }
    // Refresh this snapshot while the order screen is open.
  }, [page, receipts.length])

  const categories = ["All", ...new Set(menu.filter(item => selectedStore === 'all' || item.storeId === selectedStore).map((item) => item.category))]
  const storeName = (storeId?: string) => stores.find(store => store.id === storeId)?.name || 'Cafeteria counter'
  const currentStore = stores.find(store => store.id === selectedStore)
  function chooseStore(id: string) { setSelectedStore(id); setCategory('All'); setQuery(''); setSavedOnly(false) }
  const filtered = useMemo(() => {
    const result = menu.filter(
      (item) =>
        (selectedStore === 'all' || item.storeId === selectedStore) &&
        (category === "All" || item.category === category) &&
        (!savedOnly || favorites.includes(item.id)) &&
        `${item.name} ${item.description} ${item.category} ${storeName(item.storeId)}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    if (sort === "low") result.sort((a, b) => a.price - b.price)
    if (sort === "high") result.sort((a, b) => b.price - a.price)
    return result
  }, [menu, stores, selectedStore, category, savedOnly, favorites, query, sort])
  const lines = cart.map((line) => ({
    ...line,
    item: menu.find((item) => item.id === line.id),
  }))
  const total =
    lines.reduce(
      (sum, line) =>
        sum + Math.round((line.item?.price || 0) * 100) * line.quantity,
      0,
    ) / 100
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)
  const cartGroups = [...new Set(lines.map(line => line.item?.storeId || 'unknown'))].map(id => ({
    id, name: storeName(id),
    total: lines.filter(line => (line.item?.storeId || 'unknown') === id).reduce((sum,line) => sum + Math.round((line.item?.price || 0) * 100) * line.quantity,0) / 100,
  }))
  const invalid = lines.some((line) => !line.item || line.item.soldOut)
  function quantity(id: string, delta: number) {
    if (submitting.current) return
    const item = menu.find((item) => item.id === id)
    if (delta > 0 && (!item || item.soldOut)) return
    setCart((current) => {
      const line = current.find((line) => line.id === id)
      if (!line) return delta > 0 ? [...current, { id, quantity: 1 }] : current
      return current
        .map((line) =>
          line.id === id
            ? { ...line, quantity: Math.min(20, line.quantity + delta) }
            : line,
        )
        .filter((line) => line.quantity > 0)
    })
    requestId.current = crypto.randomUUID()
    if (delta > 0) setMessage(`${item?.name} added to cart`)
  }
  function favorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    )
  }
  async function placeOrder(event: React.FormEvent) {
    event.preventDefault()
    if (submitting.current || !cart.length || invalid || menuError) return
    submitting.current = true
    setBusy(true)
    setError("")
    try {
      const receipt = await api<Receipt>("/orders", {
        method: "POST",
        body: JSON.stringify({
          name,
          type,
          notes,
          items: cart,
          expectedTotal: total,
          requestId: requestId.current,
        }),
      })
      setReceipts((current) => [
        receipt,
        ...current.filter((entry) => entry.order.id !== receipt.order.id),
      ])
      setCart([])
      setNotes("")
      requestId.current = crypto.randomUUID()
      setPage("orders")
      setMessage("Order sent. Waiting for staff confirmation.")
    } catch (err) {
      setError((err as Error).message)
      void loadMenu()
    } finally {
      submitting.current = false
      setBusy(false)
    }
  }
  const steps = ["queued", "preparing", "ready", "completed"]
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="container header-content">
          <button
            className="brand"
            onClick={() => setPage("menu")}
            aria-label="Lian Cafeteria home"
          >
            <span className="brand-icon">
              <UtensilsCrossed size={23} />
            </span>
            <span>
              Lian Cafeteria<small>BSU Nasugbu Campus</small>
            </span>
          </button>
          <nav aria-label="Main navigation">
            <button
              className={page === "menu" ? "nav-link active" : "nav-link"}
              onClick={() => setPage("menu")}
            >
              Menu
            </button>
            <button
              className={page === "orders" ? "nav-link active" : "nav-link"}
              onClick={() => setPage("orders")}
            >
              My orders
            </button>
            <button
              className="cart-button"
              onClick={() => setPage("cart")}
              aria-label={`View cart, ${count} items`}
            >
              <ShoppingBag size={18} />
              <span className="cart-label">Cart</span>
              <span className="count">{count}</span>
            </button>
          </nav>
        </div>
      </header>
      <div className="container">
        <p className="sample-notice">
          9 sample food stalls · Store names, menus, and prices need cafeteria verification.
        </p>
      </div>
      {message && (
        <div className="toast" role="status">
          <Check size={17} />
          {message}
        </div>
      )}
      <main id="main" className="container main-content">
        {storageError && (
          <p className="error" role="alert">
            {storageError}
          </p>
        )}
        {menuError && (
          <div className="error" role="alert">
            {menuError}{" "}
            <button
              onClick={() => {
                setLoading(true)
                void loadMenu()
              }}
            >
              Retry
            </button>
          </div>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {page === "menu" && (
          <>
            <section className="hero">
              <div>
                <span className="eyebrow">YOUR CAMPUS FOOD STOP</span>
                <h1>
                  Good food.
                  <br />
                  <span>Simple ordering.</span>
                </h1>
                <p>
                  Choose from 9 food stalls. Mix meals, snacks, and drinks in one cart, then collect from each stall.
                </p>
                <a className="primary" href="#menu">
                  Browse menu <ArrowRight size={17} />
                </a>
              </div>
              <div className="hero-art" aria-hidden="true">
                <span>🍛</span>
                <div className="art-caption">
                  <UtensilsCrossed size={16} /> Made for your lunch break
                </div>
              </div>
            </section>
            <section className="stores-section" aria-labelledby="stores-title">
              <div className="section-heading"><div><h2 id="stores-title">Choose your food stall</h2><p>Browse each store’s menu or explore all 9 together.</p></div><button className="secondary" aria-pressed={selectedStore === 'all'} onClick={() => chooseStore('all')}>All stores</button></div>
              <div className="store-grid">{stores.map(store => {
                const items = menu.filter(item => item.storeId === store.id)
                const available = items.filter(item => !item.soldOut)
                return <button key={store.id} className={`store-choice ${selectedStore === store.id ? 'selected' : ''}`} aria-pressed={selectedStore === store.id} onClick={() => chooseStore(store.id)}><span className="store-icon" aria-hidden="true">{store.icon}</span><span className="store-choice-info"><strong>{store.name}</strong><span>{store.description}</span><small>{available.length} available items{available.length > 0 ? ` · From ${money(Math.min(...available.map(item => item.price)))}` : ''}</small></span>{selectedStore === store.id && <Check size={17}/>}</button>
              })}</div>
            </section>
            <section id="menu" className="menu-section">
              <div className="section-heading">
                <div>
                  <h2>{currentStore?.name || 'All stores’ menus'}</h2>
                  <p>{currentStore?.description || 'Compare the menus and add items from different stalls to your cart.'}</p>
                </div>
                <span className="muted">{filtered.length} items</span>
              </div>
              <div className="menu-tools">
                <label className="search">
                  <Search size={19} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search food or drinks…"
                    aria-label="Search menu"
                  />
                  {query && (
                    <button
                      className="icon-button"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <X size={17} />
                    </button>
                  )}
                </label>
                <label className="sort">
                  <span className="sr-only">Sort menu</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="default">Menu order</option>
                    <option value="low">Price: low to high</option>
                    <option value="high">Price: high to low</option>
                  </select>
                </label>
                <button
                  className={`saved-filter ${savedOnly ? "selected" : ""}`}
                  aria-pressed={savedOnly}
                  onClick={() => setSavedOnly(!savedOnly)}
                >
                  <Heart size={16} /> Saved
                </button>
              </div>
              <div className="categories" aria-label="Food categories">
                {categories.map((value) => (
                  <button
                    key={value}
                    aria-pressed={category === value}
                    className={category === value ? "selected" : ""}
                    onClick={() => setCategory(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {loading && !menu.length ? (
                <div className="empty">
                  <LoaderCircle className="spin" />
                  <h3>Loading the menu</h3>
                </div>
              ) : !filtered.length ? (
                <div className="empty">
                  <Search size={32} />
                  <h3>No items found</h3>
                  <p>Try another search or category.</p>
                  <button
                    className="secondary"
                    onClick={() => {
                      setQuery("")
                      setCategory("All")
                      setSavedOnly(false)
                      setSelectedStore('all')
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="food-grid">
                  {filtered.map((item) => (
                    <article
                      key={item.id}
                      className={`food-card ${
                        item.soldOut ? "unavailable" : ""
                      }`}
                    >
                      <div
                        className={`food-art tone-${item.category.replace(/ /g, "-").toLowerCase()}`}
                      >
                        <button
                          className="food-open"
                          aria-label={`View ${item.name}`}
                          onClick={() => setDetail(item)}
                        >
                          <span aria-hidden="true">
                            {symbols[item.category] || "🍽️"}
                          </span>
                        </button>
                        <button
                          className={`favorite icon-button ${
                            favorites.includes(item.id) ? "is-favorite" : ""
                          }`}
                          aria-label={`${
                            favorites.includes(item.id) ? "Unsave" : "Save"
                          } ${item.name}`}
                          aria-pressed={favorites.includes(item.id)}
                          onClick={() => favorite(item.id)}
                        >
                          <Heart
                            size={18}
                            fill={
                              favorites.includes(item.id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        {item.soldOut && (
                          <span className="sold-out">Sold out</span>
                        )}
                      </div>
                      <div className="food-body">
                        <button className="food-store-name" onClick={() => chooseStore(item.storeId)}>{storeName(item.storeId)}</button>
                        <span className="food-category">{item.category}</span>
                        <button
                          className="food-name"
                          onClick={() => setDetail(item)}
                        >
                          {item.name}
                        </button>
                        <p>{item.description}</p>
                        <div className="food-bottom">
                          <strong>{money(item.price)}</strong>
                          <button
                            className="add-button"
                            disabled={
                              item.soldOut ||
                              (cart.find((line) => line.id === item.id)
                                ?.quantity || 0) >= 20 ||
                              !!menuError
                            }
                            aria-label={`Add ${item.name} to cart`}
                            onClick={() => quantity(item.id, 1)}
                          >
                            <Plus size={16} /> Add
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
        {(page === "cart" || page === "checkout") && (
          <>
            <button
              className="back-link"
              onClick={() => setPage(page === "checkout" ? "cart" : "menu")}
            >
              <ArrowLeft size={17} />
              {page === "checkout" ? "Back to cart" : "Back to menu"}
            </button>
            <div className="section-heading">
              <div>
                <h1>{page === "cart" ? "Your cart" : "Checkout"}</h1>
                <p>
                  {page === "cart"
                    ? `${count} items from ${cartGroups.length} ${cartGroups.length === 1 ? 'store' : 'stores'}`
                    : "A few details and you’re ready to go."}
                </p>
              </div>
            </div>
            {!cart.length ? (
              <div className="empty panel">
                <ShoppingBag size={40} />
                <h2>Your cart is empty</h2>
                <p>Add something delicious from the menu.</p>
                <button className="primary" onClick={() => setPage("menu")}>
                  Browse menu <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div className="checkout-layout">
                <div>
                  {page === "cart" ? (
                    <section className="panel cart-lines">
                      <div className="cart-store-totals"><h2>Ordering from {cartGroups.length} {cartGroups.length === 1 ? 'store' : 'stores'}</h2>{cartGroups.map(group => <div key={group.id}><span>{group.name}</span><strong>{money(group.total)}</strong></div>)}</div>
                      {lines.map((line) => (
                        <div className="cart-line" key={line.id}>
                          <span className="cart-art" aria-hidden="true">
                            {symbols[line.item?.category || ""] || "🍽️"}
                          </span>
                          <div className="cart-item-info">
                            <h3>
                              {line.item?.name || "Item no longer available"}
                            </h3>
                            <p className="cart-store-name">{storeName(line.item?.storeId)}</p>
                            <p>
                              {line.item
                                ? money(line.item.price) + " each"
                                : "Remove this item to continue"}
                            </p>
                            {line.item?.soldOut && (
                              <span className="text-error">
                                Sold out · Remove to continue
                              </span>
                            )}
                            <div className="quantity">
                              <button
                                aria-label={`Decrease ${line.item?.name || "item"} quantity`}
                                onClick={() => quantity(line.id, -1)}
                              >
                                <Minus size={14} />
                              </button>
                              <span aria-live="polite">{line.quantity}</span>
                              <button
                                disabled={
                                  line.quantity >= 20 ||
                                  !line.item ||
                                  line.item.soldOut
                                }
                                aria-label={`Increase ${line.item?.name || "item"} quantity`}
                                onClick={() => quantity(line.id, 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="cart-line-end">
                            <strong>
                              {money((line.item?.price || 0) * line.quantity)}
                            </strong>
                            <button
                              className="icon-button"
                              aria-label={`Remove ${line.item?.name || "item"} from cart`}
                              onClick={() => {
                                setCart((current) =>
                                  current.filter(
                                    (entry) => entry.id !== line.id,
                                  ),
                                )
                                requestId.current = crypto.randomUUID()
                              }}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        className="back-link"
                        onClick={() => setPage("menu")}
                      >
                        <Plus size={16} />
                        Add more items
                      </button>
                    </section>
                  ) : (
                    <form
                      id="checkout-form"
                      onSubmit={placeOrder}
                      className="panel checkout-form"
                    >
                      <h2>Order details</h2>
                      <label>
                        Your name
                        <input
                          autoComplete="name"
                          value={name}
                          disabled={busy}
                          minLength={2}
                          maxLength={80}
                          required
                          placeholder="Name for your order"
                          onChange={(event) => {
                            setName(event.target.value)
                            requestId.current = crypto.randomUUID()
                          }}
                        />
                      </label>
                      <fieldset disabled={busy}>
                        <legend>Order type</legend>
                        <div className="order-types">
                          {(["takeout", "dine-in"] as const).map((value) => (
                            <label
                              className={type === value ? "chosen" : ""}
                              key={value}
                            >
                              <input
                                type="radio"
                                name="order-type"
                                value={value}
                                checked={type === value}
                                onChange={() => {
                                  setType(value)
                                  requestId.current = crypto.randomUUID()
                                }}
                              />
                              <span>
                                <strong>
                                  {value === "takeout" ? "Takeout" : "Dine in"}
                                </strong>
                                <small>
                                  {value === "takeout"
                                    ? "Pick up and go"
                                    : "Enjoy at the cafeteria"}
                                </small>
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <label>
                        Notes <span className="muted">(optional)</span>
                        <textarea
                          value={notes}
                          disabled={busy}
                          maxLength={300}
                          placeholder="Any requests? Staff will confirm what is possible."
                          onChange={(event) => {
                            setNotes(event.target.value)
                            requestId.current = crypto.randomUUID()
                          }}
                        />
                      </label>
                      <div className="info-note">
                        <Clock3 size={19} />
                        <p>
                          Estimated preparation: 3–5 minutes after staff
                          confirms. Actual time depends on the queue.
                        </p>
                      </div>
                    </form>
                  )}
                </div>
                <aside className="panel summary">
                  <h2>Order summary</h2>
                  {page === "checkout" && (
                    <div className="mini-lines">
                      {lines.map((line) => (
                        <div key={line.id}>
                          <span>
                            {line.quantity} ×{" "}
                            {line.item?.name || "Unavailable item"}
                            <small className="summary-store-name">{storeName(line.item?.storeId)}</small>
                          </span>
                          <strong>
                            {money((line.item?.price || 0) * line.quantity)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="store-subtotals">{cartGroups.map(group => <div key={group.id}><span>{group.name}</span><strong>{money(group.total)}</strong></div>)}</div>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{money(total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Service fee</span>
                    <span>{money(0)}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <strong>{money(total)}</strong>
                  </div>
                  <p className="payment-note">
                    Pay and collect at each store · No online payment
                  </p>
                  {invalid && (
                    <p className="text-error">
                      Remove unavailable items to continue.
                    </p>
                  )}
                  {page === "cart" ? (
                    <button
                      className="primary full"
                      disabled={invalid || loading || !!menuError}
                      onClick={() => setPage("checkout")}
                    >
                      Continue to checkout <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button
                      className="primary full"
                      type="submit"
                      form="checkout-form"
                      disabled={busy || invalid || !!menuError}
                    >
                      {busy ? (
                        <>
                          <LoaderCircle size={17} className="spin" /> Sending
                          order…
                        </>
                      ) : (
                        <>
                          Place order <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  )}
                  <p className="summary-foot">
                    Check the sample prices before ordering.
                  </p>
                </aside>
              </div>
            )}
          </>
        )}
        {page === "orders" && (
          <>
            <div className="section-heading">
              <div>
                <h1>My orders</h1>
                <p>Updates come directly from cafeteria staff.</p>
              </div>
              <ReceiptText size={28} />
            </div>
            {!receipts.length ? (
              <div className="empty panel">
                <ReceiptText size={40} />
                <h2>No orders yet</h2>
                <p>Your order details will appear here after checkout.</p>
                <button className="primary" onClick={() => setPage("menu")}>
                  Browse menu
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {receipts.map(({ order }) => (
                  <article className="panel order-card" key={order.id}>
                    <div className="order-heading">
                      <div>
                        <span className="eyebrow">{order.id}</span>
                        <h2>{order.name}</h2>
                        <p>
                          {new Date(order.createdAt).toLocaleString("en-PH")} ·{" "}
                          {order.type === "takeout" ? "Takeout" : "Dine in"}
                        </p>
                      </div>
                      <span className={`status status-${order.status}`}>
                        {statusLabel[order.status]}
                      </span>
                    </div>
                    {(!order.fulfillments || order.fulfillments.length === 1) && order.status !== "cancelled" && (
                      <ol className="order-progress">
                        {steps.map((step, index) => (
                          <li
                            className={
                              steps.indexOf(order.status) >= index ? "done" : ""
                            }
                            key={step}
                          >
                            <span>
                              {steps.indexOf(order.status) >= index ? (
                                <Check size={13} />
                              ) : (
                                index + 1
                              )}
                            </span>
                            {["Sent", "Preparing", "Ready", "Collected"][index]}
                          </li>
                        ))}
                      </ol>
                    )}
                    <p className="order-guidance">
                      {order.status === "queued"
                        ? "Your order has been sent. Please wait for staff to confirm it."
                        : order.status === "ready"
                          ? "Your order is ready. Check each store below for pickup and payment."
                          : order.status === "cancelled"
                            ? "Staff cancelled this order. Please ask at the counter for details."
                            : order.status === "completed"
                              ? "Your available items have been collected. Check any cancelled store items below."
                              : "Stores prepare their items separately. Check the status at each stall below."}
                    </p>
                    <OrderStores order={order}/>
                    {order.notes && (
                      <p className="muted">Note: {order.notes}</p>
                    )}
                    <div className="summary-total">
                      <span>{(order.amountDue ?? order.total) !== order.total ? `Original total ${money(order.total)} · Active items` : 'Total across stores'}</span>
                      <strong>{money(order.amountDue ?? order.total)}</strong>
                    </div>
                    <button
                      className="secondary"
                      onClick={() => window.print()}
                    >
                      Print order summary
                    </button>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        {page === "staff" && <Staff menu={menu} stores={stores} onMenuChange={loadMenu} />}
      </main>
      <footer className="container footer">
        <span>
          Lian Cafeteria <span className="footer-campus">· BSU Nasugbu</span>
        </span>
        <button onClick={() => setPage(page === "staff" ? "menu" : "staff")}>
          {page === "staff" ? "Customer menu" : "Staff sign in"}
        </button>
      </footer>
      {page === "menu" && count > 0 && (
        <button className="mobile-cart" onClick={() => setPage("cart")}>
          <ShoppingBag size={18} />
          <span>View cart · {count} items</span>
          <strong>{money(total)}</strong>
        </button>
      )}
      <dialog
        ref={detailRef}
        onCancel={() => setDetail(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setDetail(null)
        }}
        className="food-dialog"
      >
        {detail && (
          <>
            <button
              className="dialog-close icon-button"
              aria-label="Close item details"
              onClick={() => setDetail(null)}
            >
              <X size={20} />
            </button>
            <div className="detail-art" aria-hidden="true">
              {symbols[detail.category]}
            </div>
            <span className="eyebrow">{detail.category}</span>
            <h2>{detail.name}</h2>
            <p className="food-store-name">{storeName(detail.storeId)}</p>
            <p>{detail.description}</p>
            <p className="muted">
              For allergy or dietary questions, please ask staff before
              ordering.
            </p>
            <div className="food-bottom">
              <strong>
                {money(
                  menu.find((item) => item.id === detail.id)?.price ||
                    detail.price,
                )}
              </strong>
              <button
                className="primary"
                disabled={
                  menu.find((item) => item.id === detail.id)?.soldOut ||
                  !!menuError ||
                  (cart.find((line) => line.id === detail.id)?.quantity || 0) >=
                    20
                }
                onClick={() => {
                  quantity(detail.id, 1)
                  setDetail(null)
                }}
              >
                {menu.find((item) => item.id === detail.id)?.soldOut
                  ? "Sold out"
                  : "Add to cart"}
                <Plus size={17} />
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  )
}
