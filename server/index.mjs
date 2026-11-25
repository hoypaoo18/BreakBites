import http from "node:http"
import {
  readFileSync,
  writeFileSync,
  renameSync,
  existsSync,
  mkdirSync,
  statSync,
  copyFileSync,
} from "node:fs"
import { dirname, resolve, extname, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { starterMenu, migrateCatalog, groupItems, aggregateStatus, amountDue } from './catalog.mjs'
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const dataDir = resolve(process.env.DATA_DIR || resolve(root, "data"))
mkdirSync(dataDir, { recursive: true })
const file = resolve(dataDir, "cafeteria.json")
const passwordFile = resolve(dataDir, "staff-password.txt")
if (!process.env.STAFF_PASSWORD && !existsSync(passwordFile))
  writeFileSync(passwordFile, randomBytes(18).toString("base64url"), {
    mode: 0o600,
  })
const password =
  process.env.STAFF_PASSWORD || readFileSync(passwordFile, "utf8").trim()
const salt = randomBytes(16)
const passwordHash = scryptSync(password, salt, 64)
const sessions = new Map()
const attempts = new Map()
let db = existsSync(file)
  ? JSON.parse(readFileSync(file, "utf8"))
  : {
      menu: starterMenu.map(item => ({ ...item })),
      orders: [],
    }
function save() {
  writeFileSync(file + ".tmp", JSON.stringify(db, null, 2))
  renameSync(file + ".tmp", file)
}
function commit(change) {
  const previous = structuredClone(db)
  try {
    change()
    save()
  } catch (err) {
    db = previous
    throw err
  }
}
if (existsSync(file) && (db.schemaVersion || 1) < 2 && !existsSync(file + '.before-stores-v2.json'))
  copyFileSync(file, file + '.before-stores-v2.json')
migrateCatalog(db)
save()
function send(res, status, value) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  })
  res.end(JSON.stringify(value))
}
function error(message, status = 400) {
  throw Object.assign(new Error(message), { status })
}
async function body(req) {
  if (!req.headers['content-type']?.startsWith('application/json'))
    error('Use a JSON request.', 415)
  let content = ""
  for await (const chunk of req) {
    content += chunk
    if (content.length > 20000) error("Request too large.", 413)
  }
  try {
    const value = JSON.parse(content)
    if (!value || typeof value !== "object" || Array.isArray(value))
      error("Invalid request.")
    return value
  } catch {
    error("Invalid request.")
  }
}
function staff(req) {
  const token = req.headers.authorization?.replace(/^Bearer /, "")
  if (!token || (sessions.get(token) || 0) < Date.now())
    error("Please sign in again.", 401)
}
function publicOrder(order) {
  const { token, requestId, ...result } = order
  return result
}
const transitions = {
  queued: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
}
const server = http.createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://localhost").pathname
    if (req.method === "GET" && path === "/api/menu")
      return send(res, 200, { items: db.menu, stores: db.stores, sample: true })
    if (req.method === "POST" && path === "/api/staff/login") {
      const key = req.socket.remoteAddress,
        attempt = attempts.get(key)
      if (attempt && attempt.until > Date.now() && attempt.count >= 10)
        error("Too many attempts. Try again in 10 minutes.", 429)
      const input = await body(req)
      if (typeof input.password !== "string" || input.password.length > 200)
        error("Invalid password.", 401)
      if (
        !timingSafeEqual(scryptSync(input.password, salt, 64), passwordHash)
      ) {
        attempts.set(key, {
          count: attempt?.until > Date.now() ? attempt.count + 1 : 1,
          until: Date.now() + 600000,
        })
        error("Incorrect password.", 401)
      }
      attempts.delete(key)
      const token = randomBytes(32).toString("hex")
      sessions.set(token, Date.now() + 28800000)
      return send(res, 200, { token })
    }
    if (req.method === "POST" && path === "/api/staff/logout") {
      sessions.delete(req.headers.authorization?.replace(/^Bearer /, ""))
      return send(res, 200, { ok: true })
    }
    if (req.method === "POST" && path === "/api/orders") {
      const input = await body(req)
      if (
        typeof input.requestId !== "string" ||
        !/^[a-zA-Z0-9-]{16,80}$/.test(input.requestId)
      )
        error("Invalid order reference.")
      const previous = db.orders.find(
        (order) => order.requestId === input.requestId,
      )
      if (previous)
        return send(res, 200, {
          order: publicOrder(previous),
          token: previous.token,
        })
      const name = typeof input.name === "string" ? input.name.trim() : ""
      if (name.length < 2 || name.length > 80)
        error("Enter your name (2–80 characters).")
      if (!["takeout", "dine-in"].includes(input.type))
        error("Choose an order type.")
      if (typeof input.notes !== "string" || input.notes.length > 300)
        error("Notes must be 300 characters or fewer.")
      if (
        !Array.isArray(input.items) ||
        !input.items.length ||
        input.items.length > 30
      )
        error("Add items to your order.")
      const ids = new Set()
      const items = input.items.map((entry) => {
        if (!entry || typeof entry !== "object") error("Invalid item.")
        const item = db.menu.find((item) => item.id === entry.id)
        if (!item || item.soldOut)
          error(
            `${item?.name || "Item"} is unavailable. Please update your cart.`,
          )
        if (
          ids.has(entry.id) ||
          !Number.isInteger(entry.quantity) ||
          entry.quantity < 1 ||
          entry.quantity > 20
        )
          error("Invalid quantity. Maximum 20 per item.")
        ids.add(entry.id)
        const store = db.stores.find(store => store.id === item.storeId)
        if (!store) error('This item has no active store. Please contact staff.')
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: entry.quantity,
          storeId: store.id,
          storeName: store.name,
        }
      })
      const order = {
        id: "LC-" + randomBytes(6).toString("hex").toUpperCase(),
        token: randomBytes(32).toString("hex"),
        requestId: input.requestId,
        name,
        type: input.type,
        notes: input.notes.trim(),
        items,
        fulfillments: groupItems(items),
        total:
          items.reduce(
            (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
            0,
          ) / 100,
        status: "queued",
        payment: "Pay at counter",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      order.amountDue = amountDue(order.fulfillments)
      if (input.expectedTotal !== order.total)
        error(
          "Menu prices changed. Review the updated total and submit again.",
          409,
        )
      commit(() => db.orders.unshift(order))
      return send(res, 201, { order: publicOrder(order), token: order.token })
    }
    if (req.method === "GET" && /^\/api\/orders\/[^/]+$/.test(path)) {
      const order = db.orders.find(
        (order) => order.id === path.split("/").at(-1),
      )
      if (!order || req.headers.authorization !== `Bearer ${order.token}`)
        error("Order not found.", 404)
      return send(res, 200, { order: publicOrder(order) })
    }
    if (path.startsWith("/api/staff/")) {
      staff(req)
      if (req.method === "GET" && path === "/api/staff/orders")
        return send(res, 200, { orders: db.orders.map(publicOrder) })
      if (
        req.method === "PATCH" &&
        /^\/api\/staff\/orders\/[^/]+$/.test(path)
      ) {
        const input = await body(req),
          order = db.orders.find((order) => order.id === path.split("/").at(-1))
        if (!order) error("Order not found.", 404)
        const fulfillment = order.fulfillments.find(part => part.storeId === input.storeId)
          || (!input.storeId && order.fulfillments.length === 1 ? order.fulfillments[0] : null)
        if (!fulfillment) error('Choose the store to update.')
        if (!transitions[fulfillment.status].includes(input.status))
          error("That status change is not allowed.")
        commit(() => {
          fulfillment.status = input.status
          order.status = aggregateStatus(order.fulfillments)
          order.amountDue = amountDue(order.fulfillments)
          order.updatedAt = new Date().toISOString()
        })
        return send(res, 200, { order: publicOrder(order) })
      }
      if (req.method === "PATCH" && /^\/api\/staff\/menu\/[^/]+$/.test(path)) {
        const input = await body(req),
          item = db.menu.find((item) => item.id === path.split("/").at(-1))
        if (!item) error("Item not found.", 404)
        if (
          typeof input.soldOut !== "boolean" ||
          !Number.isFinite(input.price) ||
          input.price <= 0 ||
          input.price > 10000 ||
          Math.abs(input.price * 100 - Math.round(input.price * 100)) > 0.000001
        )
          error("Enter a valid peso price and availability.")
        commit(() => {
          item.soldOut = input.soldOut
          item.price = input.price
        })
        return send(res, 200, { item })
      }
    }
    if (path.startsWith("/api/")) error("Endpoint not found.", 404)
    if (!["GET", "HEAD"].includes(req.method)) error("Method not allowed.", 405)
    const dist = resolve(root, "dist")
    let target = resolve(dist, "." + decodeURIComponent(path))
    if (!target.startsWith(dist + sep) && target !== dist)
      error("Not found.", 404)
    if (!existsSync(target) || statSync(target).isDirectory())
      target = resolve(dist, "index.html")
    if (!existsSync(target))
      return send(res, 503, { error: "Build the app or run npm run dev." })
    const mime = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".png": "image/png",
    }
    res.writeHead(200, {
      "Content-Type": mime[extname(target)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    })
    res.end(req.method === "HEAD" ? undefined : readFileSync(target))
  } catch (err) {
    if (!err.status) console.error(err.message)
    send(res, err.status || 500, {
      error: err.status
        ? err.message
        : "Could not save your changes. Please try again.",
    })
  }
})
server.listen(
  Number(process.env.API_PORT || 3001),
  process.env.API_HOST || "127.0.0.1",
  () => {
    console.log(`Cafeteria server ready on port ${server.address().port}.`)
    console.log(
      process.env.STAFF_PASSWORD
        ? "Staff password configured from environment."
        : "Staff password is in data/staff-password.txt. Keep this file private.",
    )
  },
)
