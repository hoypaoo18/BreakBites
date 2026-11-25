const fs = require("fs")
let fileContent = fs.readFileSync("src/App.tsx", "utf8")

const replacement = `const STORES = [
  { id: "1", name: "Aling Nena's Eatery", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "2", name: "Kuya Juan's Grill", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "3", name: "Silog Central", image: "https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2ee?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "4", name: "Mang Berto's", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "5", name: "Lola's Kusina", image: "https://images.unsplash.com/photo-1512152272829-408c2ce692d5?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "6", name: "Healthy Corner", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "7", name: "Morning Treats", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200&h=200" },
];

// Data
const FOOD_ITEMS: FoodItem[] = [
  // Store 1 (Lunch / Healthy)
  { id: "1-1", name: "Chicken Adobo", description: "Classic chicken braised in soy sauce and vinegar. (Lunch)", price: 8.50, rating: 4.8, reviews: 324, image: "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-2", name: "Pork Menudo", description: "Pork stew with liver, potatoes, and carrots. (Lunch)", price: 7.50, rating: 4.7, reviews: 150, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-3", name: "Pinakbet", description: "Healthy mixed vegetables sautéed in shrimp paste.", price: 6.50, rating: 4.9, reviews: 200, image: "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-4", name: "Ginataang Kalabasa", description: "Healthy squash and string beans in coconut milk.", price: 6.50, rating: 4.5, reviews: 120, image: "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "1" },
  { id: "1-5", name: "Tinolang Manok", description: "Healthy chicken soup with green papaya and ginger.", price: 8.00, rating: 4.9, reviews: 400, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "1" },
  
  // Store 2 (Lunch / Healthy)
  { id: "2-1", name: "Sinigang na Bangus", description: "Healthy milkfish in sour tamarind broth with vegetables.", price: 9.00, rating: 4.9, reviews: 189, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "2" },
  { id: "2-2", name: "Chicken Inasal", description: "Grilled chicken with a side of vegetables. (Lunch)", price: 9.50, rating: 4.8, reviews: 320, image: "https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "2" },
  { id: "2-3", name: "Grilled Tuna Belly", description: "Healthy grilled tuna served with soy-mansi dip.", price: 11.00, rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "2" },
  { id: "2-4", name: "Ensaladang Talong", description: "Healthy roasted eggplant salad with tomatoes and onions.", price: 5.00, rating: 4.7, reviews: 150, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "2" },
  { id: "2-5", name: "Bulalo", description: "Hearty beef marrow stew with corn and cabbage. (Lunch)", price: 12.00, rating: 4.9, reviews: 500, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "2" },

  // Store 3 (Morning Food)
  { id: "3-1", name: "Daing na Bangus", description: "Marinated milkfish with garlic rice and egg. (Healthy Morning)", price: 9.50, rating: 4.9, reviews: 412, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: true, category: "Rice Meals", storeId: "3" },
  { id: "3-2", name: "Tortang Talong", description: "Eggplant omelet with a side of rice. (Healthy Morning)", price: 6.50, rating: 4.8, reviews: 300, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },
  { id: "3-3", name: "Beef Tapsilog", description: "Cured beef, garlic rice, and egg. (Morning)", price: 9.50, rating: 4.7, reviews: 250, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },
  { id: "3-4", name: "Longsilog", description: "Filipino sausage, garlic rice, and egg. (Morning)", price: 8.00, rating: 4.6, reviews: 180, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },
  { id: "3-5", name: "Pork Tocilog", description: "Sweet cured pork, garlic rice, and egg. (Morning)", price: 8.50, rating: 4.5, reviews: 120, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "3" },

  // Store 4 (Lunch Noodles)
  { id: "4-1", name: "Pancit Bihon", description: "Healthy stir-fried rice noodles with plenty of vegetables.", price: 6.50, rating: 4.8, reviews: 310, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-2", name: "Sotanghon Soup", description: "Light and healthy glass noodle soup with chicken.", price: 6.00, rating: 4.9, reviews: 256, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-3", name: "Pancit Canton", description: "Stir-fried egg noodles with vegetables. (Lunch)", price: 7.00, rating: 4.6, reviews: 190, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-4", name: "Lomi", description: "Thick egg noodles in hearty broth. (Lunch)", price: 6.50, rating: 4.5, reviews: 140, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },
  { id: "4-5", name: "Mami", description: "Chicken noodle soup. (Lunch)", price: 5.50, rating: 4.7, reviews: 220, image: "https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Noodles", storeId: "4" },

  // Store 5 (Healthy Lunch & Morning)
  { id: "5-1", name: "Lumpiang Sariwa", description: "Healthy fresh spring rolls with vegetables and peanut sauce.", price: 5.50, rating: 4.9, reviews: 512, image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "5" },
  { id: "5-2", name: "Arroz Caldo", description: "Comforting chicken rice porridge. (Morning)", price: 6.00, rating: 4.9, reviews: 340, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "5" },
  { id: "5-3", name: "Ginisang Monggo", description: "Healthy mung bean stew with spinach. (Lunch)", price: 5.00, rating: 4.8, reviews: 290, image: "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "5" },
  { id: "5-4", name: "Chopsuey", description: "Stir-fried mixed vegetables with quail eggs. (Healthy Lunch)", price: 6.50, rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "5" },
  { id: "5-5", name: "Champorado", description: "Chocolate rice porridge. (Morning)", price: 4.50, rating: 4.8, reviews: 134, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "5" },

  // Store 6 (Healthy Corner)
  { id: "6-1", name: "Fresh Buko Juice", description: "100% natural, healthy young coconut water.", price: 3.50, rating: 4.9, reviews: 200, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Drinks", storeId: "6" },
  { id: "6-2", name: "Ginisang Sayote", description: "Healthy sautéed chayote with ground lean meat.", price: 5.00, rating: 4.7, reviews: 180, image: "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "6" },
  { id: "6-3", name: "Fresh Fruit Salad", description: "Healthy mix of seasonal fresh fruits.", price: 4.50, rating: 4.9, reviews: 400, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "6" },
  { id: "6-4", name: "Steamed Okra and Talong", description: "Light and healthy steamed vegetables with bagoong.", price: 4.00, rating: 4.6, reviews: 150, image: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Rice Meals", storeId: "6" },
  { id: "6-5", name: "Chicken Papaya Soup", description: "Nourishing, healthy chicken soup with green papaya.", price: 6.50, rating: 4.8, reviews: 350, image: "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Soups", storeId: "6" },

  // Store 7 (Morning Sweets)
  { id: "7-1", name: "Taho", description: "Classic morning silken tofu with syrup and sago.", price: 3.00, rating: 4.9, reviews: 500, image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Drinks", storeId: "7" },
  { id: "7-2", name: "Puto", description: "Traditional steamed rice cakes. (Morning)", price: 4.00, rating: 4.9, reviews: 320, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
  { id: "7-3", name: "Suman", description: "Sticky rice steamed in banana leaves. (Morning)", price: 3.50, rating: 4.8, reviews: 210, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
  { id: "7-4", name: "Kutsinta", description: "Sticky brown rice cakes with grated coconut. (Morning)", price: 4.00, rating: 4.7, reviews: 180, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
  { id: "7-5", name: "Bibingka", description: "Baked rice cake with salted egg and cheese. (Morning)", price: 5.50, rating: 4.8, reviews: 160, image: "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800"], soldOut: false, category: "Snacks", storeId: "7" },
];`

const startStr = "const STORES = ["
const endStr = "];\n\nexport default function App() {"

const startIndex = fileContent.indexOf(startStr)
const endIndex = fileContent.indexOf(endStr)

if (startIndex !== -1 && endIndex !== -1) {
  const newContent =
    fileContent.substring(0, startIndex) +
    replacement +
    "\n\n" +
    fileContent.substring(
      endIndex + endStr.length - "export default function App() {".length,
    )
  fs.writeFileSync("src/App.tsx", newContent, "utf8")
  console.log("Replaced successfully!")
} else {
  console.log("Could not find start/end.")
}
