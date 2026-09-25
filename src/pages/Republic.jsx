import TranscriptionLevel from '../components/TranscriptionLevel.jsx'
import { letters } from '../data/republic.js'
import { levelById } from '../levels.js'
import RepublicLesson from '../lessons/RepublicLesson.jsx'

// Level 1: consonants and vowels.
export default function Republic() {
  return (
    <TranscriptionLevel level={levelById.republic} items={letters} lesson={<RepublicLesson />} itemLabel="letters" />
  )
}
