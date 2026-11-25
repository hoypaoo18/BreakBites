export type FoodItem = {
  id: string
  name: string
  description: string
  storeId: string
  price: number
  category: string
  soldOut: boolean
}

export type FoodStore = {
  id: string
  name: string
  description: string
  icon: string
}
export type Fulfillment = {
  storeId: string
  storeName: string
  status: Status
  total: number
}
export type CartLine = {
  id: string
  quantity: number
}

export type Status = "queued" | "preparing" | "ready" | "completed" | "cancelled"

export type Order = {
  id: string
  name: string
  type: "takeout" | "dine-in"
  notes: string

  items: {
    id: string
    name: string
    price: number
    quantity: number
    storeId?: string
    storeName?: string
  }[]

  total: number
  amountDue?: number
  fulfillments?: Fulfillment[]
  status: Status
  payment: string
  createdAt: string
  updatedAt: string
}

export function orderStores(order: Order): Fulfillment[] {
  return order.fulfillments || [{ storeId: 'legacy-counter', storeName: 'Cafeteria counter (earlier order)', status: order.status, total: order.total }]
}
export const money = (value: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    value,
  )

export const statusLabel: Record<Status, string> = {
  queued: "Awaiting confirmation",
  preparing: "Preparing",
  ready: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response

  try {
    response = await fetch("/api" + path, {
      ...options,
      signal: options.signal ?? AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/json", ...options.headers },
    })
  } catch {
    throw new Error("Cannot connect to the cafeteria. Please try again.")
  }

  let result

  try {
    result = await response.json()
  } catch {
    throw new Error(
      "The ordering service is unavailable. Please try again shortly.",
    )
  }

  if (!response.ok)
    throw new Error(result.error || "Something went wrong. Please try again.")

  return result
}
