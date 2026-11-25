const fs = require("fs")
let fileContent = fs.readFileSync("src/App.tsx", "utf8")

// I will just use string replace to clean up the bad export
const badStr = `export default function App() {{ motion, AnimatePresence } from "framer-motion"
import {`

const goodStr = `export default function App() {`

// We have duplicated imports and App func now.
// Let's just restore the file properly from git, and do the simple replace.
