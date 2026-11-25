import { test } from "node:test"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve, sep } from "node:path"
import { randomUUID } from "node:crypto"
import { once } from "node:events"

test("customer and staff ordering workflow", async (t) => {
  const tempRoot = resolve(tmpdir()),
    dataDir = mkdtempSync(resolve(tempRoot, "lian-api-test-"))
  let processHandle, base
  const password = randomUUID()
  async function start() {
    processHandle = spawn(process.execPath, ["server/index.mjs"], {
      env: {
        ...process.env,
        DATA_DIR: dataDir,
        API_PORT: "0",
        STAFF_PASSWORD: password,
      },
      stdio: ["ignore", "pipe", "pipe"],
    })
    base = await new Promise((resolveBase, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Server startup timed out")),
        10000,
      )
      processHandle.stdout.on("data", (chunk) => {
        const match = chunk.toString().match(/ready on port (\d+)/)
        if (match) {
          clearTimeout(timeout)
          resolveBase(`http://127.0.0.1:${match[1]}`)
        }
      })
      processHandle.once("error", (err) => {
        clearTimeout(timeout)
        reject(err)
      })
      processHandle.once("exit", (code) => {
        clearTimeout(timeout)
        reject(new Error(`Server exited ${code}`))
      })
    })
  }
  async function stop() {
    if (processHandle && processHandle.exitCode === null) {
      const exited = once(processHandle, "exit")
      processHandle.kill()
      await exited
    }
  }
  t.after(async () => {
    await stop()
    if (
      !resolve(dataDir).startsWith(tempRoot + sep) ||
      !dataDir.includes("lian-api-test-")
    )
      throw new Error("Unsafe cleanup path")
    rmSync(dataDir, { recursive: true, force: true })
  })
  await start()
  async function request(path, method = "GET", body, token) {
    const response = await fetch(base + "/api" + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
    return { status: response.status, value: await response.json() }
  }
  const payload = {
    requestId: randomUUID(),
    name: "Workflow Check",
    type: "takeout",
    notes: "No utensils",
    items: [{ id: "adobo", quantity: 2, price: 1 }],
    expectedTotal: 170,
  }
  let receipt, staffToken
  await t.test(
    "menu is explicit sample data; staff data is protected",
    async () => {
      const menu = await request("/menu")
      assert.equal(menu.status, 200)
      assert.equal(menu.value.sample, true)
      assert.equal(menu.value.items.length, 36)
      assert.equal(menu.value.stores.length, 9)
      for (const store of menu.value.stores) {
        assert.equal(menu.value.items.filter(item => item.storeId === store.id).length, 4)
      }
      assert.equal((await request("/staff/orders")).status, 401)
      assert.equal(
        (await request("/staff/login", "POST", { password: "wrong" })).status,
        401,
      )
      const login = await request("/staff/login", "POST", { password })
      assert.equal(login.status, 200)
      staffToken = login.value.token
    },
  )
  await t.test(
    "empty, malformed, duplicate, excessive and sold-out items are rejected",
    async () => {
      for (const items of [
        [],
        [null],
        [{ id: "missing", quantity: 1 }],
        [{ id: "adobo", quantity: 0 }],
        [{ id: "adobo", quantity: 1.5 }],
        [{ id: "adobo", quantity: 21 }],
        [{ id: "bibingka", quantity: 1 }],
        [
          { id: "adobo", quantity: 1 },
          { id: "adobo", quantity: 1 },
        ],
      ]) {
        assert.equal(
          (await request("/orders", "POST", { ...payload, items })).status,
          400,
        )
      }
      assert.equal(
        (await request("/orders", "POST", { ...payload, name: " " })).status,
        400,
      )
      assert.equal(
        (await request("/orders", "POST", { ...payload, expectedTotal: 1 }))
          .status,
        409,
      )
      assert.equal((await request("/orders", "POST", null)).status, 400)
    },
  )
  await t.test(
    "server calculates totals, saves snapshot and deduplicates retries",
    async () => {
      const result = await request("/orders", "POST", payload)
      assert.equal(result.status, 201)
      receipt = result.value
      assert.equal(receipt.order.total, 170)
      assert.equal(receipt.order.items[0].price, 85)
      assert.equal(receipt.order.status, "queued")
      const duplicate = await request("/orders", "POST", payload)
      assert.equal(duplicate.status, 200)
      assert.equal(duplicate.value.order.id, receipt.order.id)
      assert.equal((await request("/orders/" + receipt.order.id)).status, 404)
      assert.equal(
        (
          await request(
            "/orders/" + receipt.order.id,
            "GET",
            undefined,
            "wrong",
          )
        ).status,
        404,
      )
      assert.equal(
        (
          await request(
            "/orders/" + receipt.order.id,
            "GET",
            undefined,
            receipt.token,
          )
        ).status,
        200,
      )
      const orders = await request(
        "/staff/orders",
        "GET",
        undefined,
        staffToken,
      )
      assert.equal(orders.value.orders.length, 1)
      assert.equal(orders.value.orders[0].token, undefined)
    },
  )
  await t.test(
    "staff menu edits persist and cannot change an existing order total",
    async () => {
      assert.equal(
        (
          await request("/staff/menu/adobo", "PATCH", {
            price: 90,
            soldOut: false,
          })
        ).status,
        401,
      )
      for (const price of [-1, 0, 90.001, 10001])
        assert.equal(
          (
            await request(
              "/staff/menu/adobo",
              "PATCH",
              { price, soldOut: false },
              staffToken,
            )
          ).status,
          400,
        )
      assert.equal(
        (
          await request(
            "/staff/menu/adobo",
            "PATCH",
            { price: 90, soldOut: false },
            staffToken,
          )
        ).status,
        200,
      )
      assert.equal(
        (
          await request("/orders", "POST", {
            ...payload,
            requestId: randomUUID(),
          })
        ).status,
        409,
      )
      assert.equal(
        (
          await request(
            "/orders/" + receipt.order.id,
            "GET",
            undefined,
            receipt.token,
          )
        ).value.order.total,
        170,
      )
      assert.equal(
        (
          await request(
            "/staff/menu/adobo",
            "PATCH",
            { price: 90, soldOut: true },
            staffToken,
          )
        ).status,
        200,
      )
      assert.equal(
        (
          await request("/orders", "POST", {
            ...payload,
            requestId: randomUUID(),
            expectedTotal: 180,
          })
        ).status,
        400,
      )
    },
  )
  await t.test(
    "staff drives status transitions; unauthorized and skipped transitions fail",
    async () => {
      const path = "/staff/orders/" + receipt.order.id
      assert.equal(
        (await request(path, "PATCH", { status: "preparing" })).status,
        401,
      )
      assert.equal(
        (await request(path, "PATCH", { status: "ready" }, staffToken)).status,
        400,
      )
      for (const status of ["preparing", "ready", "completed"]) {
        assert.equal(
          (await request(path, "PATCH", { status }, staffToken)).status,
          200,
        )
        assert.equal(
          (
            await request(
              "/orders/" + receipt.order.id,
              "GET",
              undefined,
              receipt.token,
            )
          ).value.order.status,
          status,
        )
      }
      assert.equal(
        (await request(path, "PATCH", { status: "queued" }, staffToken)).status,
        400,
      )
    },
  )
  await t.test('mixed-store orders keep separate prices, identities and readiness', async () => {
    const result = await request('/orders','POST',{
      ...payload, requestId: randomUUID(), expectedTotal: 135,
      items: [{id:'tapsilog',quantity:1,storeId:'drinks'}, {id:'water',quantity:2}],
    })
    assert.equal(result.status,201)
    const mixed = result.value
    assert.equal(mixed.order.fulfillments.length,2)
    assert.equal(mixed.order.items[0].storeId,'silog')
    assert.equal(mixed.order.items[0].storeName,'Silog Station')
    assert.equal(mixed.order.items[1].storeId,'drinks')
    assert.equal(mixed.order.total,135)
    assert.equal(mixed.order.amountDue,135)
    const path='/staff/orders/'+mixed.order.id
    assert.equal((await request(path,'PATCH',{status:'preparing'},staffToken)).status,400)
    assert.equal((await request(path,'PATCH',{storeId:'kitchen',status:'preparing'},staffToken)).status,400)
    for(const status of ['preparing','ready']) {
      assert.equal((await request(path,'PATCH',{storeId:'silog',status},staffToken)).status,200)
      const current=(await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order
      assert.equal(current.status,'queued')
      assert.equal(current.fulfillments.find(part=>part.storeId==='drinks').status,'queued')
    }
    await request(path,'PATCH',{storeId:'drinks',status:'preparing'},staffToken)
    assert.equal((await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order.status,'preparing')
    await request(path,'PATCH',{storeId:'drinks',status:'ready'},staffToken)
    assert.equal((await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order.status,'ready')
    await request(path,'PATCH',{storeId:'silog',status:'completed'},staffToken)
    assert.equal((await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order.status,'ready')
    await request(path,'PATCH',{storeId:'drinks',status:'completed'},staffToken)
    assert.equal((await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order.status,'completed')
  })
  await t.test('cancelling one store preserves the other order and adjusts the payable total',async()=>{
    const result=await request('/orders','POST',{...payload,requestId:randomUUID(),expectedTotal:115,items:[{id:'tapsilog',quantity:1},{id:'water',quantity:1}]})
    const mixed=result.value
    const path='/staff/orders/'+mixed.order.id
    await request(path,'PATCH',{storeId:'drinks',status:'cancelled'},staffToken)
    let current=(await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order
    assert.equal(current.status,'queued')
    assert.equal(current.total,115)
    assert.equal(current.amountDue,95)
    assert.equal(current.fulfillments.find(part=>part.storeId==='silog').status,'queued')
    await request(path,'PATCH',{storeId:'silog',status:'cancelled'},staffToken)
    current=(await request('/orders/'+mixed.order.id,'GET',undefined,mixed.token)).value.order
    assert.equal(current.status,'cancelled')
    assert.equal(current.amountDue,0)
    assert.equal((await request(path,'PATCH',{storeId:'drinks',status:'preparing'},staffToken)).status,400)
  })
  await t.test(
    "logout revokes access and restart preserves orders and menu",
    async () => {
      assert.equal(
        (await request("/staff/logout", "POST", {}, staffToken)).status,
        200,
      )
      assert.equal(
        (await request("/staff/orders", "GET", undefined, staffToken)).status,
        401,
      )
      await stop()
      await start()
      const order = await request(
        "/orders/" + receipt.order.id,
        "GET",
        undefined,
        receipt.token,
      )
      assert.equal(order.value.order.status, "completed")
      assert.equal(order.value.order.total, 170)
      const menu = await request("/menu")
      const adobo = menu.value.items.find((item) => item.id === "adobo")
      assert.equal(adobo.price, 90)
      assert.equal(adobo.soldOut, true)
      assert.equal(
        (await request("/orders", "POST", payload)).value.order.id,
        receipt.order.id,
      )
    },
  )
})
