// Telugu bonus level 1 — Telugu letters (from teluguaksharalu.com) with IAST-style transliteration.
// ISO 15919 additions where Telugu differs from Sanskrit: ē, ō (long e/o) and ṟ (bandi ṟa).
export const achulu = [
  ['అ', 'a'], ['ఆ', 'ā'], ['ఇ', 'i'], ['ఈ', 'ī'], ['ఉ', 'u'], ['ఊ', 'ū'], ['ఋ', 'ṛ'], ['ౠ', 'ṝ'],
  ['ఎ', 'e'], ['ఏ', 'ē'], ['ఐ', 'ai'], ['ఒ', 'o'], ['ఓ', 'ō'], ['ఔ', 'au'], ['అం', 'aṃ'], ['అః', 'aḥ'],
]

// Rows as laid out in the lesson chart.
export const halluluRows = [
  [['క', 'ka'], ['ఖ', 'kha'], ['గ', 'ga'], ['ఘ', 'gha'], ['ఙ', 'ṅa']],
  [['చ', 'ca'], ['ఛ', 'cha'], ['జ', 'ja'], ['ఝ', 'jha'], ['ఞ', 'ña']],
  [['ట', 'ṭa'], ['ఠ', 'ṭha'], ['డ', 'ḍa'], ['ఢ', 'ḍha'], ['ణ', 'ṇa']],
  [['త', 'ta'], ['థ', 'tha'], ['ద', 'da'], ['ధ', 'dha'], ['న', 'na']],
  [['ప', 'pa'], ['ఫ', 'pha'], ['బ', 'ba'], ['భ', 'bha'], ['మ', 'ma']],
  [['య', 'ya'], ['ర', 'ra'], ['ల', 'la'], ['వ', 'va'], ['శ', 'śa']],
  [['ష', 'ṣa'], ['స', 'sa'], ['హ', 'ha'], ['ళ', 'ḻa'], ['క్ష', 'kṣa']],
  [['ఱ', 'ṟa']],
]

export const hallulu = halluluRows.flat()

const VIRAMA = '్'

// Guninthapu gurthulu: [sign added to a consonant, name, vowel it gives]. Thalakattu is the inherent a.
export const gurthulu = [
  ['', 'Thalakattu', 'a'],
  ['ా', 'Deergam', 'ā'],
  ['ి', 'Gudi', 'i'],
  ['ీ', 'Gudi Deergam', 'ī'],
  ['ు', 'Kommu', 'u'],
  ['ూ', 'Kommu Deergam', 'ū'],
  ['ృ', 'Ruthvamu', 'ṛ'],
  ['ౄ', 'Ruthva Deergam', 'ṝ'],
  ['ె', 'Ethvamu', 'e'],
  ['ే', 'Yethvamu', 'ē'],
  ['ై', 'Aithvamu', 'ai'],
  ['ొ', 'Othvamu', 'o'],
  ['ో', 'Othvamu Deergam', 'ō'],
  ['ౌ', 'Authvamu', 'au'],
  ['ం', 'Sunna', 'aṃ'],
  ['ః', 'Visarga', 'aḥ'],
]

// Vatthulu: every single consonant written under another (క్ష is already a conjunct, so it has none).
export const vatthulu = hallulu
  .filter(([letter]) => !letter.includes(VIRAMA))
  .map(([letter, sound]) => [VIRAMA + letter, sound])

const stem = (sound) => sound.slice(0, -1) // drop the inherent a

// One cell of the gunintham/vatthulu chart for a hallu.
export const withGurthu = ([letter, sound], [sign, , vowel]) => [letter + sign, stem(sound) + vowel]
// ISO 15919 writes a colon where a consonant + h conjunct would read as an aspirate (క్హ k:ha, not ఖ kha).
export const withVatthu = ([letter, sound], [vatthu, vatthuSound]) => {
  const separator = vatthuSound === 'ha' && /[kgcjṭḍtdpb]$/.test(stem(sound)) ? ':' : ''
  return [letter + vatthu, stem(sound) + separator + vatthuSound]
}

export const ankelu = [
  ['౦', '0'], ['౧', '1'], ['౨', '2'], ['౩', '3'], ['౪', '4'],
  ['౫', '5'], ['౬', '6'], ['౭', '7'], ['౮', '8'], ['౯', '9'], ['౧౦', '10'],
]

// Every character in the lesson: achulu, each cell of the guninthalu & vatthulu chart
// (whose Thalakattu column is the hallulu), and ankelu.
const chart = hallulu.flatMap((hallu) => [
  ...gurthulu.map((gurthu) => withGurthu(hallu, gurthu)),
  ...vatthulu.map((vatthu) => withVatthu(hallu, vatthu)),
])

// Each transliteration is unique, so it doubles as the item id. క + ష vatthu is క్ష itself, so it's listed once.
export const aksharalu = [
  ...new Map([...achulu, ...chart, ...ankelu].map(([prompt, answer]) => [answer, { id: answer, prompt, answer }])).values(),
]
