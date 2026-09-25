// Level 1 — Devanagari consonants and vowels with their IAST transliteration.
export const consonants = [
  ['क', 'ka'], ['ख', 'kha'], ['ग', 'ga'], ['घ', 'gha'], ['ङ', 'ṅa'],
  ['च', 'ca'], ['छ', 'cha'], ['ज', 'ja'], ['झ', 'jha'], ['ञ', 'ña'],
  ['ट', 'ṭa'], ['ठ', 'ṭha'], ['ड', 'ḍa'], ['ढ', 'ḍha'], ['ण', 'ṇa'],
  ['त', 'ta'], ['थ', 'tha'], ['द', 'da'], ['ध', 'dha'], ['न', 'na'],
  ['प', 'pa'], ['फ', 'pha'], ['ब', 'ba'], ['भ', 'bha'], ['म', 'ma'],
  ['य', 'ya'], ['र', 'ra'], ['ल', 'la'], ['व', 'va'],
  ['श', 'śa'], ['ष', 'ṣa'], ['स', 'sa'], ['ह', 'ha'],
  ['ळ', 'ḻa'],
]

export const vowels = [
  ['अ', 'a'], ['आ', 'ā'], ['इ', 'i'], ['ई', 'ī'], ['उ', 'u'], ['ऊ', 'ū'],
  ['ऋ', 'ṛ'], ['ॠ', 'ṝ'], ['ऌ', 'ḷ'], ['ॡ', 'ḹ'],
  ['ए', 'e'], ['ऐ', 'ai'], ['ओ', 'o'], ['औ', 'au'],
]

// Each IAST form is unique, so it doubles as the item id.
export const letters = [...vowels, ...consonants].map(([prompt, answer]) => ({
  id: answer,
  prompt,
  answer,
}))
