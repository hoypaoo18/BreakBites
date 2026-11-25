const fs = require("fs")
let fileContent = fs.readFileSync("src/App.tsx", "utf8")

// I will just use string replace to clean up the bad export
const badStr =
  'export default function App() {{ motion, AnimatePresence } from "framer-motion"\nimport {'

if (fileContent.includes(badStr)) {
  console.log("Found bad str")
}
