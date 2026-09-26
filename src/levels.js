import { letters } from './data/republic.js'
import mumbaiBackground from '../background-images/modern-mumbai-web.jpg'

// Level list from the game script. `path` is set only for levels that are playable;
// `total` is the number of questions that make up 100%; `background` replaces the default Ellora image.
export const levels = [
  { id: 'republic', number: 1, empire: 'Republic', description: 'Svarāḥ and Vyañjanāḥ', path: '/level/republic', total: letters.length, background: mumbaiBackground },
  { id: 'maratha', number: 2, empire: 'Maratha', description: 'Bārākhaḍī and Saṃyuktākṣaras' },
  { id: 'vijayanagara', number: 3, empire: 'Vijayanagara', description: 'Transcribing Devanāgarī I' },
  { id: 'chola', number: 4, empire: 'Chola', description: 'Translating Devanāgarī I' },
  { id: 'rashtrakuta', number: 5, empire: 'Rashtrakuta', description: 'Śabdarūpāṇi' },
  { id: 'chalukya', number: 6, empire: 'Chalukya', description: 'Lakāraḥ' },
  { id: 'kamarupa', number: 7, empire: 'Kamarupa', description: 'Transcribing Devanāgarī II' },
  { id: 'gupta', number: 8, empire: 'Gupta', description: 'Sandhi' },
  { id: 'kushan', number: 9, empire: 'Kushan', description: 'Translating Devanāgarī II' },
  { id: 'maurya', number: 10, empire: 'Maurya', description: 'Transcribing Śāstrāṇi' },
  { id: 'kuru', number: 11, empire: 'Kuru', description: 'Translating Śāstrāṇi' },
  { id: 'sarasvati', number: 12, empire: 'Sarasvati', description: 'Do you know śruti?' },
]

export const levelById = Object.fromEntries(levels.map((level) => [level.id, level]))
