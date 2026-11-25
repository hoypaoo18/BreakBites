import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  Plus,
  Minus,
  Check,
  ScanLine,
  X,
  Bell,
  Loader2,
  ArrowRight,
  Search,
  MapPin,
  Clock3,
  Sparkles,
  UtensilsCrossed,
  Store,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
} from "lucide-react"

// Types
type ViewState = "loading" | "home" | "details" | "cart" | "checkout" | "payment" | "tracking"

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  rating: number
  reviews: number
  image: string
  images: string[]
  soldOut: boolean
  category: string
  storeId: string
}

export const STORES = [
  {
    id: "1",
    name: "Aling Nena's Eatery",
    image:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "2",
    name: "Kuya Juan's Grill",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "3",
    name: "Silog Central",
    image:
      "https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2ee?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "4",
    name: "Mang Berto's",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "5",
    name: "Lola's Kusina",
    image:
      "https://images.unsplash.com/photo-1512152272829-408c2ce692d5?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "6",
    name: "Healthy Corner",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "7",
    name: "Morning Treats",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=200&h=200",
  },
]

export const FOOD_ITEMS: FoodItem[] = [
  // Store 1 (Lunch / Healthy)
  {
    id: "1-1",
    name: "Chicken Adobo",
    description: "Classic chicken braised in soy sauce and vinegar. (Lunch)",
    price: 8.5,
    rating: 4.8,
    reviews: 324,
    image:
      "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "1",
  },
  {
    id: "1-2",
    name: "Pork Menudo",
    description: "Pork stew with liver, potatoes, and carrots. (Lunch)",
    price: 7.5,
    rating: 4.7,
    reviews: 150,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "1",
  },
  {
    id: "1-3",
    name: "Pinakbet",
    description: "Healthy mixed vegetables sautéed in shrimp paste.",
    price: 6.5,
    rating: 4.9,
    reviews: 200,
    image:
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "1",
  },
  {
    id: "1-4",
    name: "Ginataang Kalabasa",
    description: "Healthy squash and string beans in coconut milk.",
    price: 6.5,
    rating: 4.5,
    reviews: 120,
    image:
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "1",
  },
  {
    id: "1-5",
    name: "Tinolang Manok",
    description: "Healthy chicken soup with green papaya and ginger.",
    price: 8.0,
    rating: 4.9,
    reviews: 400,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Soups",
    storeId: "1",
  },

  // Store 2 (Lunch / Healthy)
  {
    id: "2-1",
    name: "Sinigang na Bangus",
    description: "Healthy milkfish in sour tamarind broth with vegetables.",
    price: 9.0,
    rating: 4.9,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Soups",
    storeId: "2",
  },
  {
    id: "2-2",
    name: "Chicken Inasal",
    description: "Grilled chicken with a side of vegetables. (Lunch)",
    price: 9.5,
    rating: 4.8,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1537495988501-f9cd94a78f3e?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "2",
  },
  {
    id: "2-3",
    name: "Grilled Tuna Belly",
    description: "Healthy grilled tuna served with soy-mansi dip.",
    price: 11.0,
    rating: 4.9,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1625477811233-044633d10dd1?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "2",
  },
  {
    id: "2-4",
    name: "Ensaladang Talong",
    description: "Healthy roasted eggplant salad with tomatoes and onions.",
    price: 5.0,
    rating: 4.7,
    reviews: 150,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "2",
  },
  {
    id: "2-5",
    name: "Bulalo",
    description: "Hearty beef marrow stew with corn and cabbage. (Lunch)",
    price: 12.0,
    rating: 4.9,
    reviews: 500,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Soups",
    storeId: "2",
  },

  // Store 3 (Morning Food)
  {
    id: "3-1",
    name: "Daing na Bangus",
    description:
      "Marinated milkfish with garlic rice and egg. (Healthy Morning)",
    price: 9.5,
    rating: 4.9,
    reviews: 412,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: true,
    category: "Rice Meals",
    storeId: "3",
  },
  {
    id: "3-2",
    name: "Tortang Talong",
    description: "Eggplant omelet with a side of rice. (Healthy Morning)",
    price: 6.5,
    rating: 4.8,
    reviews: 300,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "3",
  },
  {
    id: "3-3",
    name: "Beef Tapsilog",
    description: "Cured beef, garlic rice, and egg. (Morning)",
    price: 9.5,
    rating: 4.7,
    reviews: 250,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "3",
  },
  {
    id: "3-4",
    name: "Longsilog",
    description: "Filipino sausage, garlic rice, and egg. (Morning)",
    price: 8.0,
    rating: 4.6,
    reviews: 180,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "3",
  },
  {
    id: "3-5",
    name: "Pork Tocilog",
    description: "Sweet cured pork, garlic rice, and egg. (Morning)",
    price: 8.5,
    rating: 4.5,
    reviews: 120,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "3",
  },

  // Store 4 (Lunch Noodles)
  {
    id: "4-1",
    name: "Pancit Bihon",
    description: "Healthy stir-fried rice noodles with plenty of vegetables.",
    price: 6.5,
    rating: 4.8,
    reviews: 310,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Noodles",
    storeId: "4",
  },
  {
    id: "4-2",
    name: "Sotanghon Soup",
    description: "Light and healthy glass noodle soup with chicken.",
    price: 6.0,
    rating: 4.9,
    reviews: 256,
    image:
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Noodles",
    storeId: "4",
  },
  {
    id: "4-3",
    name: "Pancit Canton",
    description: "Stir-fried egg noodles with vegetables. (Lunch)",
    price: 7.0,
    rating: 4.6,
    reviews: 190,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Noodles",
    storeId: "4",
  },
  {
    id: "4-4",
    name: "Lomi",
    description: "Thick egg noodles in hearty broth. (Lunch)",
    price: 6.5,
    rating: 4.5,
    reviews: 140,
    image:
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Noodles",
    storeId: "4",
  },
  {
    id: "4-5",
    name: "Mami",
    description: "Chicken noodle soup. (Lunch)",
    price: 5.5,
    rating: 4.7,
    reviews: 220,
    image:
      "https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Noodles",
    storeId: "4",
  },

  // Store 5 (Healthy Lunch & Morning)
  {
    id: "5-1",
    name: "Lumpiang Sariwa",
    description: "Healthy fresh spring rolls with vegetables and peanut sauce.",
    price: 5.5,
    rating: 4.9,
    reviews: 512,
    image:
      "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "5",
  },
  {
    id: "5-2",
    name: "Arroz Caldo",
    description: "Comforting chicken rice porridge. (Morning)",
    price: 6.0,
    rating: 4.9,
    reviews: 340,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Soups",
    storeId: "5",
  },
  {
    id: "5-3",
    name: "Ginisang Monggo",
    description: "Healthy mung bean stew with spinach. (Lunch)",
    price: 5.0,
    rating: 4.8,
    reviews: 290,
    image:
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Soups",
    storeId: "5",
  },
  {
    id: "5-4",
    name: "Chopsuey",
    description: "Stir-fried mixed vegetables with quail eggs. (Healthy Lunch)",
    price: 6.5,
    rating: 4.7,
    reviews: 110,
    image:
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "5",
  },
  {
    id: "5-5",
    name: "Champorado",
    description: "Chocolate rice porridge. (Morning)",
    price: 4.5,
    rating: 4.8,
    reviews: 134,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Snacks",
    storeId: "5",
  },

  // Store 6 (Healthy Corner)
  {
    id: "6-1",
    name: "Fresh Buko Juice",
    description: "100% natural, healthy young coconut water.",
    price: 3.5,
    rating: 4.9,
    reviews: 200,
    image:
      "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Drinks",
    storeId: "6",
  },
  {
    id: "6-2",
    name: "Ginisang Sayote",
    description: "Healthy sautéed chayote with ground lean meat.",
    price: 5.0,
    rating: 4.7,
    reviews: 180,
    image:
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "6",
  },
  {
    id: "6-3",
    name: "Fresh Fruit Salad",
    description: "Healthy mix of seasonal fresh fruits.",
    price: 4.5,
    rating: 4.9,
    reviews: 400,
    image:
      "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Snacks",
    storeId: "6",
  },
  {
    id: "6-4",
    name: "Steamed Okra and Talong",
    description: "Light and healthy steamed vegetables with bagoong.",
    price: 4.0,
    rating: 4.6,
    reviews: 150,
    image:
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Rice Meals",
    storeId: "6",
  },
  {
    id: "6-5",
    name: "Chicken Papaya Soup",
    description: "Nourishing, healthy chicken soup with green papaya.",
    price: 6.5,
    rating: 4.8,
    reviews: 350,
    image:
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583913459026-781129ce061f?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Soups",
    storeId: "6",
  },

  // Store 7 (Morning Sweets)
  {
    id: "7-1",
    name: "Taho",
    description: "Classic morning silken tofu with syrup and sago.",
    price: 3.0,
    rating: 4.9,
    reviews: 500,
    image:
      "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1600850056064-a8b380df8395?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Drinks",
    storeId: "7",
  },
  {
    id: "7-2",
    name: "Puto",
    description: "Traditional steamed rice cakes. (Morning)",
    price: 4.0,
    rating: 4.9,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Snacks",
    storeId: "7",
  },
  {
    id: "7-3",
    name: "Suman",
    description: "Sticky rice steamed in banana leaves. (Morning)",
    price: 3.5,
    rating: 4.8,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Snacks",
    storeId: "7",
  },
  {
    id: "7-4",
    name: "Kutsinta",
    description: "Sticky brown rice cakes with grated coconut. (Morning)",
    price: 4.0,
    rating: 4.7,
    reviews: 180,
    image:
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Snacks",
    storeId: "7",
  },
  {
    id: "7-5",
    name: "Bibingka",
    description: "Baked rice cake with salted egg and cheese. (Morning)",
    price: 5.5,
    rating: 4.8,
    reviews: 160,
    image:
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1606525437679-037aca74a3e9?auto=format&fit=crop&q=80&w=800",
    ],
    soldOut: false,
    category: "Snacks",
    storeId: "7",
  },
]

const FOOD_IMAGE_LIBRARY: Record<string, string> = {
  "Rice Meals":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=86&w=1200",
  Noodles:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=86&w=1200",
  Soups:
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=86&w=1200",
  Snacks:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=86&w=1200",
  Drinks:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=86&w=1200",
}

const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=88&w=1600"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=82&w=1200"

const CATEGORIES = ["All", "Rice Meals", "Noodles", "Soups", "Snacks", "Drinks"]

function getFoodImage(item: FoodItem) {
  return FOOD_IMAGE_LIBRARY[item.category] ?? item.image ?? FALLBACK_IMAGE
}

function SafeImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null
        event.currentTarget.src = FALLBACK_IMAGE
      }}
    />
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="BreakBite home">
      <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#ff6b35] text-white shadow-[0_10px_30px_rgba(255,107,53,0.28)]">
        <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-amber-300/80" />
        <UtensilsCrossed className="relative" size={21} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-xl font-extrabold tracking-[-0.04em] text-[#173332]">
            Break<span className="text-[#ff6b35]">Bite</span>
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.26em] text-stone-400">
            Local food, made easy
          </div>
        </div>
      )}
    </div>
  )
}

function IconButton({
  children,
  onClick,
  label,
  className = "",
}: {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-2xl border border-stone-200/80 bg-white text-[#173332] shadow-sm transition hover:-translate-y-0.5 hover:border-[#ff6b35]/30 hover:shadow-md active:translate-y-0 ${className}`}
    >
      {children}
    </button>
  )
}

function PageHeader({
  title,
  eyebrow,
  onBack,
}: {
  title: string
  eyebrow: string
  onBack: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#fbfaf6]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4 sm:px-8">
        <IconButton label="Go back" onClick={onBack}>
          <ChevronLeft size={20} />
        </IconButton>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#ff6b35]">
            {eyebrow}
          </p>
          <h1 className="font-display text-xl font-bold tracking-tight text-[#173332] sm:text-2xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const [view, setView] = useState<ViewState>("loading")
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [cart, setCart] = useState<
    {
      item: FoodItem
      quantity: number
    }[]
  >([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState<{
    id: string
    message: string
  }[]>([])
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("takeout")
  const [orderStatus, setOrderStatus] = useState<"preparing" | "ready">(
    "preparing",
  )
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Load simulate
  useEffect(() => {
    if (view === "loading") {
      const timer = setTimeout(() => setView("home"), 2000)
      return () => clearTimeout(timer)
    }
  }, [view])

  const addNotification = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const newFavs = new Set(favorites)
    if (newFavs.has(id)) {
      newFavs.delete(id)
      addNotification("Removed from favorites")
    } else {
      newFavs.add(id)
      addNotification("Added to favorites")
    }
    setFavorites(newFavs)
  }

  const addToCart = (item: FoodItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { item, quantity }]
    })
    addNotification(`Added ${item.name} to cart`)
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.item.id === id) {
            const newQ = Math.max(0, i.quantity + delta)
            return { ...i, quantity: newQ }
          }
          return i
        })
        .filter((i) => i.quantity > 0),
    )
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0,
  )
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const filteredItems = FOOD_ITEMS.filter((item) => {
    const matchesStore =
      selectedStore === null || item.storeId === selectedStore
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)

    return matchesStore && matchesCategory && matchesSearch
  })

  // Transitions
  const pageVariants: Variants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-200">
      {/* Notifications */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-stone-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
            >
              <Bell size={16} />
              {notif.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {view === "loading" && (
          <motion.div
            key="loading"
            className="min-h-screen flex items-center justify-center bg-white"
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-stone-500 font-medium tracking-widest uppercase text-sm"
              >
                BreakBite
              </motion.div>
            </div>
          </motion.div>
        )}

        {view === "home" && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative pb-24"
          >
            <header className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
              <div>
                <h1 className="text-2xl font-display font-bold tracking-tight">
                  BreakBite
                </h1>
                <p className="text-stone-500 text-sm">
                  Delicious food, delivered fast.
                </p>
              </div>
              <button
                onClick={() => setView("cart")}
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center relative hover:bg-stone-200 transition-colors"
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </header>

            <main className="space-y-6">
              {/* Store Selector */}
              <div>
                <h2 className="text-lg font-bold font-display px-6 mb-3">
                  Canteen Branches
                </h2>
                <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
                  <button
                    onClick={() => setSelectedStore(null)}
                    className={`flex flex-col items-center gap-2 min-w-[72px] ${
                      selectedStore === null
                        ? "opacity-100"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-stone-100 ${
                        selectedStore === null
                          ? "border-orange-500"
                          : "border-transparent"
                      }`}
                    >
                      <Star size={24} className="text-stone-400" />
                    </div>
                    <span className="text-xs font-medium text-center w-full truncate">
                      All
                    </span>
                  </button>
                  {STORES.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => setSelectedStore(store.id)}
                      className={`flex flex-col items-center gap-2 min-w-[72px] transition-opacity ${
                        selectedStore === store.id
                          ? "opacity-100"
                          : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full border-2 overflow-hidden ${
                          selectedStore === store.id
                            ? "border-orange-500 p-0.5"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={store.image}
                          alt={store.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-xs font-medium text-center w-full truncate px-1">
                        {store.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide">
                {[
                  "All",
                  "Rice Meals",
                  "Noodles",
                  "Soups",
                  "Snacks",
                  "Drinks",
                ].map((cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      i === 0
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Food List */}
              <div className="grid gap-6 px-6">
                {FOOD_ITEMS.filter(
                  (item) =>
                    selectedStore === null || item.storeId === selectedStore,
                ).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group relative bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm cursor-pointer ${
                      item.soldOut ? "opacity-75 grayscale-[0.5]" : ""
                    }`}
                    onClick={() => {
                      if (!item.soldOut) {
                        setSelectedItem(item)
                        setView("details")
                      }
                    }}
                    whileHover={
                      !item.soldOut
                        ? {
                            y: -4,
                            scale: 1.01,
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                          }
                        : {}
                    }
                    whileTap={!item.soldOut ? { scale: 0.98 } : {}}
                  >
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={!item.soldOut ? { scale: 1.05 } : {}}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                      {item.soldOut && (
                        <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="bg-white text-stone-900 px-4 py-2 rounded-full font-bold tracking-widest text-sm uppercase">
                            Sold Out
                          </span>
                        </div>
                      )}
                      {!item.soldOut && (
                        <button
                          onClick={(e) => toggleFavorite(e, item.id)}
                          className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
                        >
                          <Heart
                            size={16}
                            className={
                              favorites.has(item.id)
                                ? "fill-red-500 text-red-500"
                                : "text-stone-400"
                            }
                          />
                        </button>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold font-display text-lg">
                          {item.name}
                        </h3>
                        <span className="font-bold text-orange-500">
                          ${item.price}
                        </span>
                      </div>
                      <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1 text-sm font-medium text-stone-600">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span>{item.rating}</span>
                        <span className="text-stone-400">({item.reviews})</span>
                      </div>
                    </div>

                    {/* Hover Add Button (Desktop) */}
                    {!item.soldOut && (
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(item)
                          }}
                          className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-stone-800"
                        >
                          <Plus size={16} /> Add to Cart
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </main>
          </motion.div>
        )}

        {view === "details" && selectedItem && (
          <motion.div
            key="details"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative pb-32"
          >
            <header className="absolute top-0 w-full p-6 pt-12 flex items-center justify-between z-20">
              <button
                onClick={() => setView("home")}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => toggleFavorite(e, selectedItem.id)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
              >
                <Heart
                  size={20}
                  className={
                    favorites.has(selectedItem.id)
                      ? "fill-red-500 text-red-500"
                      : "text-stone-400"
                  }
                />
              </button>
            </header>

            {/* Simulated 360 View */}
            <div className="relative h-96 bg-stone-100 overflow-hidden cursor-ew-resize group">
              <motion.div
                className="w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                whileDrag={{ cursor: "grabbing" }}
              >
                <motion.img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover pointer-events-none"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Drag to rotate</span>
              </div>
            </div>

            <div className="p-6 relative -mt-6 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-display font-bold mb-1">
                    {selectedItem.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-bold">{selectedItem.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{selectedItem.reviews} reviews</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  ${selectedItem.price}
                </div>
              </div>

              <p className="text-stone-600 leading-relaxed mb-8">
                {selectedItem.description}
              </p>

              {/* Customization (Mock) */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Add Extras</h3>
                {[
                  { name: "Extra Cheese", price: 1.5 },
                  { name: "Bacon", price: 2.0 },
                  { name: "Avocado", price: 1.5 },
                ].map((extra) => (
                  <div
                    key={extra.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-orange-200 transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{extra.name}</span>
                    <span className="text-stone-500 text-sm">
                      +${extra.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 w-full max-w-md p-6 bg-white/80 backdrop-blur-xl border-t border-stone-100 z-30">
              <button
                onClick={() => {
                  addToCart(selectedItem)
                  setView("home")
                }}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-stone-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add to Cart
              </button>
            </div>
          </motion.div>
        )}

        {view === "cart" && (
          <motion.div
            key="cart"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative pb-40"
          >
            <header className="p-6 pt-12 flex items-center justify-between border-b border-stone-100">
              <button
                onClick={() => setView("home")}
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-display font-bold">Your Cart</h1>
              <div className="w-10" />
            </header>

            <main className="p-6">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-stone-500"
                  >
                    <ShoppingBag
                      size={48}
                      className="mx-auto mb-4 opacity-20"
                    />
                    <p>Your cart is empty.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((i) => (
                      <motion.div
                        key={i.item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 items-center"
                      >
                        <img
                          src={i.item.image}
                          alt={i.item.name}
                          className="w-20 h-20 rounded-2xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold leading-tight mb-1">
                            {i.item.name}
                          </h4>
                          <div className="text-orange-500 font-bold mb-2">
                            ${i.item.price}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(i.item.id, -1)}
                              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-medium w-4 text-center">
                              {i.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(i.item.id, 1)}
                              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </main>

            {cart.length > 0 && (
              <div className="fixed bottom-0 w-full max-w-md p-6 bg-white border-t border-stone-100 z-30">
                <div className="flex justify-between mb-4 text-lg">
                  <span className="text-stone-500">Total</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setView("checkout")}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-stone-900/20 active:scale-95 transition-transform"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        )}

        {view === "checkout" && (
          <motion.div
            key="checkout"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-md mx-auto min-h-screen bg-stone-50 shadow-xl relative pb-40"
          >
            <header className="p-6 pt-12 flex items-center bg-white border-b border-stone-100">
              <button
                onClick={() => setView("cart")}
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mr-4"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-display font-bold">Checkout</h1>
            </header>

            <main className="p-6 space-y-8">
              {/* Dine-in vs Takeout */}
              <section>
                <h3 className="font-bold mb-4 text-lg">Order Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(["dine-in", "takeout"] as const).map((type) => (
                    <motion.button
                      key={type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOrderType(type)}
                      className={`relative p-4 rounded-2xl text-left border-2 transition-all ${
                        orderType === type
                          ? "border-orange-500 bg-orange-50"
                          : "border-transparent bg-white shadow-sm"
                      }`}
                    >
                      <h4 className="font-bold capitalize mb-1">
                        {type.replace("-", " ")}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {type === "dine-in"
                          ? "Eat at restaurant"
                          : "Pick up in store"}
                      </p>
                      {orderType === type && (
                        <motion.div
                          layoutId="check"
                          className="absolute top-4 right-4 text-orange-500"
                        >
                          <Check size={16} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Pickup Time */}
              <section>
                <h3 className="font-bold mb-4 text-lg">Time</h3>
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-bold">ASAP</div>
                    <div className="text-sm text-stone-500">15-25 mins</div>
                  </div>
                  <button className="text-orange-500 font-medium text-sm px-3 py-1.5 bg-orange-50 rounded-lg">
                    Change
                  </button>
                </div>
              </section>
            </main>

            <div className="fixed bottom-0 w-full max-w-md p-6 bg-white border-t border-stone-100 z-30">
              <button
                onClick={() => setView("payment")}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-stone-900/20 active:scale-95 transition-transform flex justify-between items-center px-6"
              >
                <span>Pay</span>
                <span>${cartTotal.toFixed(2)}</span>
              </button>
            </div>
          </motion.div>
        )}

        {view === "payment" && (
          <motion.div
            key="payment"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => {
                setTimeout(() => {
                  setView("tracking")
                  setCart([])
                }, 2500)
              }}
            >
              <Loader2
                size={48}
                className="animate-spin text-orange-500 mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
              <p className="text-stone-500">Please wait securely...</p>
            </motion.div>
          </motion.div>
        )}

        {view === "tracking" && (
          <motion.div
            key="tracking"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-md mx-auto min-h-screen bg-stone-50 shadow-xl relative pb-24"
          >
            <header className="p-6 pt-12 flex items-center bg-white border-b border-stone-100 mb-6">
              <button
                onClick={() => setView("home")}
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mr-4"
              >
                <X size={20} />
              </button>
              <h1 className="text-xl font-bold">Order #88B2</h1>
            </header>

            <main className="px-6 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  {orderStatus === "preparing" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 size={32} className="text-orange-500" />
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={40} className="text-orange-500" />
                    </motion.div>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {orderStatus === "preparing"
                    ? "Preparing Order..."
                    : "Ready for Pickup!"}
                </h2>
                <p className="text-stone-500 mb-8">
                  {orderStatus === "preparing"
                    ? "Your food is being freshly prepared."
                    : `Head to the counter for your ${orderType} order.`}
                </p>

                {orderStatus === "ready" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-stone-900 rounded-2xl text-white"
                  >
                    <div className="font-mono text-xl tracking-widest mb-2">
                      #88B2
                    </div>
                    <div className="flex justify-center mb-4">
                      <ScanLine size={48} className="opacity-50" />
                    </div>
                    <p className="text-sm text-stone-400">
                      Show this code at the counter
                    </p>
                  </motion.div>
                )}
              </div>

              {orderStatus === "preparing" && (
                <button
                  onClick={() => setOrderStatus("ready")}
                  className="w-full py-4 text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors"
                >
                  (Dev: Simulate Ready)
                </button>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
