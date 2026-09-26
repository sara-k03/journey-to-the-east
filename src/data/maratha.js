// Level 2 — every consonant and conjunct, each with every mātrā, anusvāra, visarga, and virāma.
export const consonants = [
  ['क', 'k'], ['ख', 'kh'], ['ग', 'g'], ['घ', 'gh'], ['ङ', 'ṅ'],
  ['च', 'c'], ['छ', 'ch'], ['ज', 'j'], ['झ', 'jh'], ['ञ', 'ñ'],
  ['ट', 'ṭ'], ['ठ', 'ṭh'], ['ड', 'ḍ'], ['ढ', 'ḍh'], ['ण', 'ṇ'],
  ['त', 't'], ['थ', 'th'], ['द', 'd'], ['ध', 'dh'], ['न', 'n'],
  ['प', 'p'], ['फ', 'ph'], ['ब', 'b'], ['भ', 'bh'], ['म', 'm'],
  ['य', 'y'], ['र', 'r'], ['ल', 'l'], ['व', 'v'],
  ['श', 'ś'], ['ष', 'ṣ'], ['स', 's'], ['ह', 'h'],
]

// Conjuncts that occur in Sanskrit words. Space-separated so the list is easy to edit.
const conjunctGroups = {
  'Nasal + stop': 'ङ्क ङ्ख ङ्ग ङ्घ ञ्च ञ्छ ञ्ज ण्ट ण्ठ ण्ड ण्ढ न्त न्थ न्द न्ध म्प म्फ म्ब म्भ',
  'Doubled': 'क्क ग्ग च्च ज्ज ट्ट ड्ड ण्ण त्त द्द न्न प्प ब्ब म्म य्य ल्ल व्व स्स',
  'Doubled with an aspirate': 'क्ख ग्घ च्छ ज्झ ट्ठ ड्ढ त्थ द्ध प्फ ब्भ',
  '+ य': 'क्य ख्य ग्य घ्य च्य ज्य ट्य ड्य ण्य त्य थ्य द्य ध्य न्य प्य फ्य ब्य भ्य म्य ल्य व्य श्य ष्य स्य ह्य',
  '+ र': 'क्र ग्र घ्र ज्र ट्र ड्र त्र द्र ध्र प्र ब्र भ्र म्र व्र श्र स्र ह्र',
  '+ व': 'क्व ज्व त्व द्व ध्व न्व श्व ष्व स्व ह्व',
  '+ म': 'क्म ग्म त्म द्म ध्म न्म ल्म श्म ष्म स्म ह्म',
  '+ न / ण': 'ग्न घ्न त्न प्न म्न श्न स्न ह्न ह्ण ष्ण',
  '+ ल': 'क्ल प्ल म्ल श्ल ह्ल',
  'Special ligatures': 'क्ष ज्ञ',
  'स / श / ष first': 'स्क स्ख स्त स्थ स्प स्फ श्च ष्क ष्ट ष्ठ ष्प',
  'Other stop + stop': 'क्त ग्द ग्ध ब्द ब्ध प्त त्क त्प त्स द्ब ड्ग द्ग द्भ',
  'Repha': 'र्क र्ग र्च र्ज र्ण र्त र्थ र्द र्ध र्प र्भ र्म र्य र्व र्श र्ष र्ह',
  'Three or more': 'स्त्र न्द्र ष्ट्र क्ष्म त्त्व न्त्र ज्ज्व र्त्स्न क्ष्य क्ष्व न्त्व न्त्य न्ध्य त्स्य ङ्क्ष र्त्य र्ध्व न्द्य ष्ट्व द्ध्य क्त्व ष्ण्य द्व्य स्थ्य',
}

export const conjuncts = Object.values(conjunctGroups).flatMap((list) => list.split(' '))

// The 15 forms every base takes: [sign added to the base, IAST added to its consonants].
export const forms = [
  ['', 'a'], ['ा', 'ā'], ['ि', 'i'], ['ी', 'ī'], ['ु', 'u'], ['ू', 'ū'], ['ृ', 'ṛ'], ['ॄ', 'ṝ'],
  ['े', 'e'], ['ै', 'ai'], ['ो', 'o'], ['ौ', 'au'], ['ं', 'aṃ'], ['ः', 'aḥ'], ['्', ''],
]

const iastOf = Object.fromEntries(consonants)

// IAST for a vowelless base, e.g. 'स्त्र' → 'str'. Virāmas inside the cluster are silent.
export function transliterate(base) {
  return [...base].filter((char) => char !== '्').map((char) => iastOf[char]).join('')
}

export const categories = [
  { id: 'all', label: 'All akṣaras' },
  { id: 'matras', label: 'Consonant + mātrā only' },
  { id: 'conjuncts', label: 'Saṃyuktākṣarāṇi only' },
]

const bases = [
  ...consonants.map(([deva]) => ({ deva, category: 'matras' })),
  ...conjuncts.map((deva) => ({ deva, category: 'conjuncts' })),
]

// Each IAST form is unique, so it doubles as the item id. `group` is the base the form is built on.
export const aksaras = bases.flatMap(({ deva, category }) => {
  const root = transliterate(deva)
  return forms.map(([sign, vowel]) => ({
    id: root + vowel,
    prompt: deva + sign,
    answer: root + vowel,
    group: deva,
    category,
  }))
})
