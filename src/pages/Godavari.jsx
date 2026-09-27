import TranscriptionLevel from '../components/TranscriptionLevel.jsx'
import { aksharalu } from '../data/godavari.js'
import { levelById } from '../levels.js'
import GodavariLesson from '../lessons/GodavariLesson.jsx'

// ISO 15919 letters Telugu needs beyond the Sanskrit set (no ḷ/ḹ vowels here).
const KEYS = ['ā', 'ī', 'ū', 'ṛ', 'ṝ', 'ē', 'ō', 'ṅ', 'ñ', 'ṭ', 'ḍ', 'ṇ', 'ś', 'ṣ', 'ḻ', 'ṟ', 'ṃ', 'ḥ']

// Telugu bonus level 1: every character in the lesson charts.
export default function Godavari() {
  return (
    <TranscriptionLevel
      level={levelById.godavari}
      items={aksharalu}
      lesson={<GodavariLesson />}
      itemLabel="characters"
      keys={KEYS}
      lang="te"
    />
  )
}
