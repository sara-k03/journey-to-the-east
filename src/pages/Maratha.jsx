import FallingLevel from '../components/FallingLevel.jsx'
import { aksaras, categories } from '../data/maratha.js'
import { levelById } from '../levels.js'
import MarathaLesson from '../lessons/MarathaLesson.jsx'

// Level 2: every consonant and conjunct with every mātrā.
export default function Maratha() {
  return <FallingLevel level={levelById.maratha} items={aksaras} categories={categories} lesson={<MarathaLesson />} />
}
