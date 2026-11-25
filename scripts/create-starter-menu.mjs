import {writeFileSync} from 'node:fs'
const groups = [
  ['kitchen', [
    ['adobo','Chicken Adobo',85,'Rice Meals','Chicken simmered in soy sauce and vinegar, served with rice.'],
    ['menudo','Pork Menudo',80,'Rice Meals','Pork, potatoes and carrots in tomato sauce, served with rice.'],
    ['pinakbet','Pinakbet with Rice',60,'Rice Meals','Mixed vegetables with shrimp paste, served with rice.'],
    ['rice','Extra Rice',15,'Extras','One serving of steamed rice.'],
  ]],
  ['silog', [
    ['tapsilog','Beef Tapsilog',95,'Rice Meals','Beef tapa, garlic rice and a fried egg.'],
    ['longsilog','Longsilog',75,'Rice Meals','Longganisa, garlic rice and a fried egg.'],
    ['tocilog','Tocilog',80,'Rice Meals','Sweet pork tocino, garlic rice and a fried egg.'],
    ['hotsilog','Hotsilog',65,'Rice Meals','Hotdog, garlic rice and a fried egg.'],
  ]],
  ['noodles', [
    ['lomi','Lomi',65,'Noodles','Thick egg noodles in a savory broth with egg and vegetables.'],
    ['bihon','Pancit Bihon',55,'Noodles','Rice noodles with vegetables and chicken.'],
    ['canton','Pancit Canton',60,'Noodles','Stir-fried egg noodles with vegetables and chicken.'],
    ['mami','Chicken Mami',55,'Noodles','Chicken noodle soup with vegetables.'],
  ]],
  ['soups', [
    ['tinola','Chicken Tinola',75,'Soups','Chicken soup with green papaya and ginger. Rice sold separately.'],
    ['sinigang','Pork Sinigang',85,'Soups','Pork and vegetables in tamarind broth. Rice sold separately.'],
    ['arroz-caldo','Arroz Caldo',45,'Soups','Chicken rice porridge with ginger.'],
    ['monggo','Ginisang Monggo',45,'Soups','Mung bean stew with leafy vegetables. Rice sold separately.'],
  ]],
  ['merienda', [
    ['puto','Puto (3 pieces)',25,'Snacks','Three steamed rice cakes for a light snack.'],
    ['bibingka','Bibingka',35,'Snacks','A serving of soft rice cake with coconut.'],
    ['suman','Suman (2 pieces)',30,'Snacks','Two sticky rice rolls wrapped in banana leaves.'],
    ['kutsinta','Kutsinta (3 pieces)',25,'Snacks','Three rice cakes served with grated coconut.'],
  ]],
  ['drinks', [
    ['buko','Buko Juice',25,'Drinks','A cup of young coconut juice.'],
    ['water','Bottled Water (500 ml)',20,'Drinks','One 500 ml bottle of drinking water.'],
    ['iced-tea','Iced Tea',25,'Drinks','A cup of chilled iced tea.'],
    ['calamansi','Calamansi Juice',25,'Drinks','A cup of chilled calamansi juice.'],
  ]],
  ['grill', [
    ['inasal','Chicken Inasal',100,'Rice Meals','Grilled chicken served with steamed rice.'],
    ['pork-bbq','Pork Barbecue Meal',80,'Rice Meals','Two pork barbecue skewers served with rice.'],
    ['liempo','Grilled Liempo',110,'Rice Meals','Grilled pork belly served with rice and dipping sauce.'],
    ['chicken-bbq','Chicken Barbecue Meal',95,'Rice Meals','Chicken barbecue served with rice.'],
  ]],
  ['sandwiches', [
    ['egg-sandwich','Egg Sandwich',35,'Sandwiches','Egg filling between two slices of bread.'],
    ['tuna-sandwich','Tuna Sandwich',45,'Sandwiches','Tuna filling between two slices of bread.'],
    ['ham-cheese','Ham and Cheese Sandwich',50,'Sandwiches','Ham and cheese between two slices of bread.'],
    ['burger','Classic Burger',55,'Sandwiches','A burger patty with lettuce and sauce in a bun.'],
  ]],
  ['bakery', [
    ['pandesal','Pandesal (3 pieces)',15,'Bakery','Three soft bread rolls.'],
    ['ensaymada','Ensaymada',30,'Bakery','One soft sweet bun with butter, sugar and cheese.'],
    ['banana-bread','Banana Bread',30,'Bakery','One slice of banana bread.'],
    ['mamon','Mamon',25,'Bakery','One soft sponge cake.'],
  ]],
]
const menu = groups.flatMap(([storeId, items]) => items.map(([id,name,price,category,description]) => ({id,storeId,name,price,category,description,soldOut:id==='bibingka'})))
writeFileSync('server/menu.json',JSON.stringify(menu,null,2)+'\n')
console.log(`Prepared ${menu.length} sample menu items in ${groups.length} stores.`)
