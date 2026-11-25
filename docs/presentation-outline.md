# Lian Cafeteria Ordering System

Updated presentation content for the nine-store system. Store names, menus and prices below are sample data. This document does not update the earlier Canva deck.

## Slide 1: Lian Cafeteria Ordering System

BSU Nasugbu Campus

System overview and live demonstration

## Slide 2: System Overview

Students browse menus from nine food stalls in one cafeteria application. They choose what to eat and can combine items from different stores in one cart. A central staff counter manages incoming orders and menu availability.

Scope: a working local prototype with sample store names and prices.

## Slide 3: Nine Food Stores

| Sample store | Menu focus |
| --- | --- |
| Home-style Kitchen | Rice meals and vegetables |
| Silog Station | Breakfast rice meals |
| Noodle House | Lomi, pancit and mami |
| Soup Corner | Soups and rice porridge |
| Merienda Stall | Filipino snacks |
| Fresh Drinks | Juice, iced tea and water |
| Campus Grill | Grilled rice meals |
| Sandwich Stop | Sandwiches and burgers |
| Baked Treats | Bread and cakes |

Each sample store has four items, for a total of 36. The cafeteria must verify the names and actual menus.

## Slide 4: Features and Technology

Store selection, menu search, category filters, price sorting and favorites help students decide what to order. Cart contents remain when switching stores or refreshing the page.

The frontend uses React, TypeScript, Vite and Tailwind CSS. A Node.js API saves menu and order records in a local JSON file. The server calculates prices and assigns items to the correct stores.

## Slide 5: Live Demonstration Setup

Open http://localhost:8443 and confirm both servers are running. Prepare the customer menu and the staff screen. Check availability at the sample stores. Keep the staff password private.

## Slide 6: Student Orders from Different Stores

1. Choose Home-style Kitchen and add Chicken Adobo.
2. Switch to Fresh Drinks and add Buko Juice.
3. Open the cart and check both store names and subtotals.
4. Enter a name, choose Takeout or Dine in and add an optional note.
5. Place the order and view the separate store statuses.

Sample calculation: ₱85 for Chicken Adobo plus ₱25 for Buko Juice equals ₱110. There is no service fee. Pay at each store before collecting its items.

## Slide 7: Staff Manages Each Store

Staff sign in through the footer and choose a food stall in the filter. Each stall’s part of an order moves through Awaiting confirmation, Preparing, Ready for pickup and Completed.

A drink can be ready while a meal is still preparing. Staff can cancel only one store’s items without cancelling the rest. The payable total excludes cancelled items. The original total remains in order history.

This prototype has a central staff login. It does not yet provide separate accounts for individual stall owners.

## Slide 8: Validation and Limits

Backend checks cover mixed-store orders, server-assigned store identity, separate readiness, partial cancellation, totals and safe migration of existing data. TypeScript compilation and the production build also require successful checks.

Current limits: menus and prices need verification, payments occur at the stalls, and the system runs locally. Browser visual verification is a separate check. The 3–5 minute preparation estimate begins after confirmation and depends on the queue at each store.

## Slide 9: Conclusion

Students can choose food from nine different stores while using one cart and checkout. Store subtotals and separate status updates tell them where to pay and collect their items.

Next steps: verify the cafeteria’s actual stores, test the system with students and staff, and prepare hosting before public use.

## Slide 10: Project References and Checklist

Project files: README.md, src/ModernApp.tsx, src/Staff.tsx, src/OrderStores.tsx, src/menu.ts, server/index.mjs, server/catalog.mjs, server/stores.json, server/menu.json and server workflow tests.

Before presenting, rehearse an order containing items from two stores. Mark one store ready and show that the second store keeps its own status. Demonstrate the staff store filter and counter payment instructions.
