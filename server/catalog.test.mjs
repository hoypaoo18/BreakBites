import {test} from 'node:test'
import assert from 'node:assert/strict'
import {migrateCatalog,starterMenu} from './catalog.mjs'

test('store migration preserves edited prices and historical orders and runs once',()=>{
  const old={menu:[{...starterMenu.find(item=>item.id==='adobo'),price:92,soldOut:true}],orders:[{
    id:'earlier-order',status:'completed',total:184,token:'existing-customer-key',
    items:[{id:'adobo',name:'Chicken Adobo',price:92,quantity:2}],
  }]}
  delete old.menu[0].storeId
  assert.equal(migrateCatalog(old),true)
  assert.equal(old.stores.length,9)
  assert.equal(old.menu.length,36)
  assert.equal(old.menu[0].price,92)
  assert.equal(old.menu[0].soldOut,true)
  assert.equal(old.orders[0].token,'existing-customer-key')
  assert.equal(old.orders[0].total,184)
  assert.equal(old.orders[0].fulfillments[0].storeId,'legacy-counter')
  assert.equal(old.orders[0].fulfillments[0].status,'completed')
  assert.equal(old.orders[0].items[0].price,92)
  const snapshot=JSON.stringify(old)
  assert.equal(migrateCatalog(old),false)
  assert.equal(JSON.stringify(old),snapshot)
})
