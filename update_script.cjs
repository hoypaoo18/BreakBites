const fs = require("fs")

const fileContent = fs.readFileSync("src/App.tsx", "utf8")

const replacement = `const STORES = [
  { id: "1", name: "Aling Nena's Eatery", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "2", name: "Kuya Juan's Grill", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "3", name: "Silog Central", image: "https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2ee?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "4", name: "Mang Berto's", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "5", name: "Lola's Merienda", image: "https://images.unsplash.com/photo-1512152272829-408c2ce692d5?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "6", name: "Canteen Stall 6", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "7", name: "Sweet Cravings", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200&h=200" },
];

const FOOD_ITEMS: FoodItem[] = [
  // Store 1
  { id: "1-1", name: "Chicken Adobo", description: "Classic chicken braised in soy sauce and vinegar.", price: 8.50, rating: 4.8, reviews: 324, image: "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-2", name: "Pork Menudo", description: "Pork stew with liver, potatoes, and carrots.", price: 7.50, rating: 4.7, reviews: 150, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-3", name: "Bicol Express", description: "Spicy pork stew in coconut milk.", price: 8.00, rating: 4.9, reviews: 200, image: "https://images.unsplash.com/photo-1733197013172-95597433e89e?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1733197013172-95597433e89e?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-4", name: "Ginataang Kalabasa", description: "Squash and string beans in coconut milk.", price: 6.50, rating: 4.5, reviews: 120, image: "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-5", name: "Lechon Kawali", description: "Crispy deep-fried pork belly.", price: 10.00, rating: 4.9, reviews: 400, image: "https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  
  // Store 2
  { id: "2-1", name: "Pork Sinigang", description: "Sour tamarind soup with pork.", price: 9.00, rating: 4.9, reviews: 189, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "2" },
  { id: "2-2", name: "Chicken Inasal", description: "Grilled chicken marinated in vinegar and annatto.", price: 9.50, rating: 4.8, reviews: 320, image: "https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "2" },
  { id: "2-3", name: "Grilled Liempo", description: "Grilled pork belly with soy-mansi dip.", price: 10.50, rating: 4.7, reviews: 210, image: "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "2" },
  { id: "2-4", name: "Bulalo", description: "Beef marrow stew with corn and cabbage.", price: 12.00, rating: 4.9, reviews: 500, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "2" },
  { id: "2-5", name: "Pork BBQ Skewers", description: "Sweet and savory grilled pork on a stick.", price: 4.00, rating: 4.6, reviews: 150, image: "https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "2" },

  // Store 3
  { id: "3-1", name: "Beef Tapsilog", description: "Cured beef, garlic rice, and egg.", price: 9.50, rating: 4.9, reviews: 412, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: true, category: "Rice Meals", storeId: "3" },
  { id: "3-2", name: "Pork Tocilog", description: "Sweet cured pork, garlic rice, and egg.", price: 8.50, rating: 4.8, reviews: 300, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },
  { id: "3-3", name: "Longsilog", description: "Filipino sausage, garlic rice, and egg.", price: 8.00, rating: 4.7, reviews: 250, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },
  { id: "3-4", name: "Bangsilog", description: "Fried milkfish, garlic rice, and egg.", price: 9.00, rating: 4.6, reviews: 180, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },
  { id: "3-5", name: "Cornsilog", description: "Corned beef, garlic rice, and egg.", price: 7.50, rating: 4.5, reviews: 120, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },

  // Store 4
  { id: "4-1", name: "Pancit Canton", description: "Stir-fried egg noodles with vegetables.", price: 7.00, rating: 4.7, reviews: 256, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-2", name: "Pancit Palabok", description: "Rice noodles with shrimp sauce and egg.", price: 8.00, rating: 4.8, reviews: 310, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-3", name: "Lomi", description: "Thick egg noodles in hearty broth.", price: 6.50, rating: 4.6, reviews: 190, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-4", name: "Mami", description: "Chicken noodle soup.", price: 5.50, rating: 4.5, reviews: 140, image: "https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-5", name: "Pancit Bihon", description: "Stir-fried rice noodles.", price: 6.50, rating: 4.7, reviews: 220, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },

  // Store 5
  { id: "5-1", name: "Lumpiang Shanghai", description: "Crispy spring rolls with pork.", price: 5.50, rating: 4.9, reviews: 512, image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "5" },
  { id: "5-2", name: "Turon", description: "Fried banana spring rolls.", price: 3.50, rating: 4.8, reviews: 134, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "5" },
  { id: "5-3", name: "Banana Cue", description: "Caramelized fried bananas on a stick.", price: 3.00, rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "5" },
  { id: "5-4", name: "Arroz Caldo", description: "Filipino chicken rice porridge.", price: 6.00, rating: 4.9, reviews: 340, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "5" },
  { id: "5-5", name: "Kwek-Kwek", description: "Fried quail eggs in orange batter.", price: 4.00, rating: 4.8, reviews: 290, image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "5" },

  // Store 6
  { id: "6-1", name: "Buko Pandan Juice", description: "Refreshing coconut pandan drink.", price: 3.50, rating: 4.8, reviews: 200, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Drinks", storeId: "6" },
  { id: "6-2", name: "Sago't Gulaman", description: "Sweet pearl and jelly beverage.", price: 3.00, rating: 4.7, reviews: 180, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Drinks", storeId: "6" },
  { id: "6-3", name: "Mango Shake", description: "Fresh mango smoothie.", price: 4.50, rating: 4.9, reviews: 400, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Drinks", storeId: "6" },
  { id: "6-4", name: "Pork Siomai", description: "Steamed pork dumplings with chili.", price: 4.00, rating: 4.8, reviews: 350, image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "6" },
  { id: "6-5", name: "Cheese Sticks", description: "Crispy fried cheese with dip.", price: 3.50, rating: 4.6, reviews: 150, image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "6" },

  // Store 7
  { id: "7-1", name: "Halo-Halo", description: "Shaved ice sundae with ube and leche flan.", price: 6.50, rating: 4.9, reviews: 500, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
  { id: "7-2", name: "Leche Flan", description: "Caramel custard dessert.", price: 5.00, rating: 4.9, reviews: 320, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
  { id: "7-3", name: "Taho", description: "Silken tofu with syrup and sago.", price: 3.00, rating: 4.8, reviews: 210, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Drinks", storeId: "7" },
  { id: "7-4", name: "Puto Bumbong", description: "Purple rice cake steamed in bamboo.", price: 4.50, rating: 4.7, reviews: 180, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
  { id: "7-5", name: "Ube Halaya", description: "Sweet purple yam jam.", price: 5.50, rating: 4.8, reviews: 160, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
];`

const startMatch = "const STORES = ["
const endMatch = "];\n\nexport default function App()"

const startIndex = fileContent.indexOf(startMatch)
const endIndex = fileContent.indexOf(endMatch)

if (startIndex !== -1 && endIndex !== -1) {
  const newContent =
    fileContent.substring(0, startIndex) +
    replacement +
    "\n\n" +
    fileContent.substring(endMatch + 4)
  fs.writeFileSync("src/App.tsx", newContent, "utf8")
  console.log("Success")
} else {
  console.log("Failed to find replacement bounds.")
}
