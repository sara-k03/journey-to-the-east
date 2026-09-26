// Level 2 lesson: virāma, mātrāḥ, saṃyuktākṣarāṇi, and syllable weight.
import { useState } from 'react'
import { consonants, forms, transliterate } from '../data/maratha.js'
import { Deva, Sound } from './LessonParts.jsx'

const VIRAMA = '्'
// Zero-width non-joiner: forces the visible-virāma spelling of a cluster.
const ZWNJ = '‌'

// Devanagari followed by its IAST, for use inside a sentence.
function Pair({ deva, iast }) {
  return (
    <>
      <Deva>{deva}</Deva> <em>{iast}</em>
    </>
  )
}

// Cards of akṣaras, each with its IAST and a short note.
function AksaraGrid({ cells }) {
  return (
    <div className="aksara-grid">
      {cells.map(([deva, iast, note]) => (
        <div className="aksara-cell" key={deva}>
          <Sound deva={deva} iast={iast} />
          <small>{note}</small>
        </div>
      ))}
    </div>
  )
}

// Every form from the game on one consonant at a time.
function MatraExplorer() {
  const [index, setIndex] = useState(0)
  const [deva, root] = consonants[index]

  return (
    <div className="lesson-tool">
      <span className="lesson-tool-label">Choose a vyañjana</span>
      <div className="matra-picker" role="group" aria-label="Consonant">
        {consonants.map(([char, iast], i) => (
          <button
            key={char}
            type="button"
            lang="sa"
            aria-label={`${iast}a`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {char}
          </button>
        ))}
      </div>
      <div className="matra-grid" aria-live="polite">
        {forms.map(([sign, vowel], i) => (
          <div key={i}>
            <Sound deva={deva + sign} iast={root + vowel} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsonantSelect({ id, label, value, onChange, optional }) {
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {optional && <option value="">none</option>}
        {consonants.map(([char, iast]) => (
          <option key={char} value={char}>
            {char} {iast}
          </option>
        ))}
      </select>
    </label>
  )
}

// Joins two or three consonants and a vowel into one akṣara.
function AksaraBuilder() {
  const [first, setFirst] = useState('स')
  const [second, setSecond] = useState('त')
  const [third, setThird] = useState('र')
  const [vowel, setVowel] = useState(3)

  const parts = [first, second, third].filter(Boolean)
  const [sign, vowelIast] = forms[vowel]
  const deva = parts.join(VIRAMA) + sign
  const iast = transliterate(parts.join(VIRAMA)) + vowelIast
  const breakdown = [...parts.map(transliterate), vowelIast].filter(Boolean).join(' + ')

  return (
    <div className="lesson-tool">
      <div className="builder">
        <ConsonantSelect id="builder-first" label="First" value={first} onChange={setFirst} />
        <ConsonantSelect id="builder-second" label="Second" value={second} onChange={setSecond} />
        <ConsonantSelect id="builder-third" label="Third" value={third} onChange={setThird} optional />
        <label htmlFor="builder-vowel">
          Vowel
          <select id="builder-vowel" value={vowel} onChange={(e) => setVowel(Number(e.target.value))}>
            {forms.map(([mark, v], i) => (
              <option key={i} value={i}>
                ◌{mark} {v || 'virāma'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="builder-output" aria-live="polite">
        <span className="builder-deva" lang="sa">{deva}</span>
        <div>
          <div className="builder-iast">{iast}</div>
          <code>{breakdown}</code>
        </div>
      </div>
      <p className="lesson-tool-note">
        What you see depends on your font. If a cluster shows a visible virāma, the font has no fused shape for it.
      </p>
    </div>
  )
}

const withVirama = [['क', 'ka', 'क्', 'k'], ['त', 'ta', 'त्', 't'], ['म', 'ma', 'म्', 'm'], ['ट', 'ṭa', 'ट्', 'ṭ']]

// [svara, IAST, mātrā sign, with क, IAST, position]
const matraRows = [
  ['अ', 'a', null, 'क', 'ka', 'built in'],
  ['आ', 'ā', '◌ा', 'का', 'kā', 'right'],
  ['इ', 'i', '◌ि', 'कि', 'ki', 'left'],
  ['ई', 'ī', '◌ी', 'की', 'kī', 'right'],
  ['उ', 'u', '◌ु', 'कु', 'ku', 'below'],
  ['ऊ', 'ū', '◌ू', 'कू', 'kū', 'below'],
  ['ऋ', 'ṛ', '◌ृ', 'कृ', 'kṛ', 'below'],
  ['ॠ', 'ṝ', '◌ॄ', 'कॄ', 'kṝ', 'below'],
  ['ऌ', 'ḷ', '◌ॢ', 'कॢ', 'kḷ', 'below'],
  ['ए', 'e', '◌े', 'के', 'ke', 'above'],
  ['ऐ', 'ai', '◌ै', 'कै', 'kai', 'above'],
  ['ओ', 'o', '◌ो', 'को', 'ko', 'right + above'],
  ['औ', 'au', '◌ौ', 'कौ', 'kau', 'right + above'],
]

const irregular = [
  ['रु', 'ru', 'u beside र'],
  ['रू', 'rū', 'ū beside र'],
  ['हृ', 'hṛ', 'ṛ tucked in'],
  ['हु', 'hu', 'u tucked in'],
  ['दृ', 'dṛ', 'ṛ tucked in'],
  ['शृ', 'śṛ', 'often reshaped'],
]

const halfForms = [
  ['स्त', 'sta', 's + t'], ['न्य', 'nya', 'n + y'], ['ग्य', 'gya', 'g + y'], ['त्य', 'tya', 't + y'],
  ['प्त', 'pta', 'p + t'], ['म्ब', 'mba', 'm + b'], ['ल्प', 'lpa', 'l + p'], ['व्य', 'vya', 'v + y'],
  ['च्छ', 'ccha', 'c + ch'], ['ष्ण', 'ṣṇa', 'ṣ + ṇ'], ['क्य', 'kya', 'k + y'], ['फ्य', 'phya', 'ph + y'],
]

const stacked = [
  ['ट्ट', 'ṭṭa', 'ṭ + ṭ'], ['ड्ड', 'ḍḍa', 'ḍ + ḍ'], ['ड्ग', 'ḍga', 'ḍ + g'], ['द्ग', 'dga', 'd + g'],
  ['द्द', 'dda', 'd + d'], ['द्भ', 'dbha', 'd + bh'], ['ङ्क', 'ṅka', 'ṅ + k'], ['ङ्ग', 'ṅga', 'ṅ + g'],
]

const ligatures = [
  ['क्ष', 'kṣa', 'k + ṣ'], ['ज्ञ', 'jña', 'j + ñ'], ['त्र', 'tra', 't + r'], ['श्र', 'śra', 'ś + r'],
  ['त्त', 'tta', 't + t'], ['क्त', 'kta', 'k + t'], ['द्ध', 'ddha', 'd + dh'], ['द्य', 'dya', 'd + y'],
  ['द्व', 'dva', 'd + v'], ['ह्म', 'hma', 'h + m'], ['ह्य', 'hya', 'h + y'], ['श्च', 'śca', 'ś + c'],
]

const raAfter = [
  ['प्र', 'pra', 'p + r'], ['क्र', 'kra', 'k + r'], ['ग्र', 'gra', 'g + r'], ['द्र', 'dra', 'd + r'],
  ['ब्र', 'bra', 'b + r'], ['ट्र', 'ṭra', 'caret'], ['ड्र', 'ḍra', 'caret'], ['ह्र', 'hra', 'h + r'],
]

const repha = [
  ['र्म', 'rma', 'r + m'], ['र्य', 'rya', 'r + y'], ['र्व', 'rva', 'r + v'],
  ['र्थ', 'rtha', 'r + th'], ['र्ता', 'rtā', 'past the ā'], ['र्मी', 'rmī', 'past the ī'],
]

const threeOrMore = [
  ['स्त्र', 'stra', 's + t + r'], ['न्द्र', 'ndra', 'n + d + r'], ['ष्ट्र', 'ṣṭra', 'ṣ + ṭ + r'],
  ['क्ष्म', 'kṣma', 'k + ṣ + m'], ['त्त्व', 'ttva', 't + t + v'], ['न्त्र', 'ntra', 'n + t + r'],
  ['ज्ज्व', 'jjva', 'j + j + v'], ['र्त्स्न', 'rtsna', 'r + t + s + n'],
]

const noLigature = [['द्ध', 'ddha'], ['क्ष', 'kṣa'], ['ङ्ग', 'ṅga'], ['ट्ट', 'ṭṭa']]

// [akṣara, IAST, parts before the vowel, vowel, word, word IAST, meaning]
const conjunctMatras = [
  ['स्त्री', 'strī', 's + t + r', 'ī', 'स्त्री', 'strī', 'woman'],
  ['प्रि', 'pri', 'p + r', 'i', 'प्रियः', 'priyaḥ', 'dear'],
  ['क्ति', 'kti', 'k + t', 'i', 'भक्तिः', 'bhaktiḥ', 'devotion'],
  ['स्थि', 'sthi', 's + th', 'i', 'स्थितिः', 'sthitiḥ', 'state'],
  ['द्यो', 'dyo', 'd + y', 'o', 'द्योतः', 'dyotaḥ', 'light'],
  ['र्ती', 'rtī', 'r + t', 'ī', 'कीर्तिः', 'kīrtiḥ', 'fame'],
]

// [word, akṣaras, akṣaras IAST, spoken syllables]
const syllables = [
  ['धर्मः', 'ध · र्मः', 'dha · rmaḥ', 'dhar · maḥ'],
  ['पुत्रः', 'पु · त्रः', 'pu · traḥ', 'put · raḥ'],
  ['अग्निः', 'अ · ग्निः', 'a · gniḥ', 'ag · niḥ'],
]

// [word, IAST, akṣaras, breakdown]
const practice = [
  ['कृष्णः', 'kṛṣṇaḥ', ['कृ', 'ष्णः'], 'k + ṛ · ṣ + ṇ + a + ḥ'],
  ['लक्ष्मीः', 'lakṣmīḥ', ['ल', 'क्ष्मीः'], 'l + a · k + ṣ + m + ī + ḥ'],
  ['ज्ञानम्', 'jñānam', ['ज्ञा', 'न', 'म्'], 'j + ñ + ā · n + a · m'],
  ['इन्द्रः', 'indraḥ', ['इ', 'न्द्रः'], 'i · n + d + r + a + ḥ'],
  ['राष्ट्रम्', 'rāṣṭram', ['रा', 'ष्ट्र', 'म्'], 'r + ā · ṣ + ṭ + r + a · m'],
  ['विद्या', 'vidyā', ['वि', 'द्या'], 'v + i · d + y + ā'],
  ['सत्यम्', 'satyam', ['स', 'त्य', 'म्'], 's + a · t + y + a · m'],
  ['शास्त्रम्', 'śāstram', ['शा', 'स्त्र', 'म्'], 'ś + ā · s + t + r + a · m'],
  ['तत्त्वम्', 'tattvam', ['त', 'त्त्व', 'म्'], 't + a · t + t + v + a · m'],
  ['श्रीः', 'śrīḥ', ['श्रीः'], 'ś + r + ī + ḥ'],
  ['सूर्यः', 'sūryaḥ', ['सू', 'र्यः'], 's + ū · r + y + a + ḥ (repha on य)'],
  ['बुद्धिः', 'buddhiḥ', ['बु', 'द्धिः'], 'b + u · d + dh + i + ḥ'],
]

export default function MarathaLesson() {
  return (
    <div className="lesson-content">
      <p>How vowels attach to consonants, and how consonants join together into a single akṣara.</p>

      <h3>The inherent a</h3>
      <p>
        In Lesson 1 every <strong>vyañjana</strong> was written with an <em>a</em> after it:{' '}
        <Pair deva="क" iast="ka" />, <Pair deva="त" iast="ta" />, <Pair deva="म" iast="ma" />. That <em>a</em> is
        part of the letter. A consonant cannot be pronounced alone, so the script gives each one a built-in{' '}
        <Pair deva="अ" iast="a" />.
      </p>
      <p>
        Devanagari is written in <strong>akṣaras</strong>, not in separate consonants and vowels. An akṣara is one or
        more consonants plus the vowel that follows them. Everything in this lesson is about building those units.
      </p>

      <h4>Virāma</h4>
      <p>
        To remove the inherent <em>a</em>, add the <strong>virāma</strong> <Deva>◌्</Deva> (also called{' '}
        <em>halanta</em>, from <em>hal</em> "consonant" + <em>anta</em> "end") below the letter.
      </p>
      <div className="table-scroll">
        <table>
          <tbody>
            <tr>
              <th scope="row">with a</th>
              {withVirama.map(([deva, iast]) => (
                <td key={iast}><Sound deva={deva} iast={iast} /></td>
              ))}
            </tr>
            <tr>
              <th scope="row">with virāma</th>
              {withVirama.map(([, , deva, iast]) => (
                <td key={iast}><Sound deva={deva} iast={iast} /></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        You see the virāma most often at the end of a word: <Pair deva="वाक्" iast="vāk" /> ("speech"),{' '}
        <Pair deva="फलम्" iast="phalam" /> ("fruit"), <Pair deva="जगत्" iast="jagat" /> ("world").
      </p>

      <h3>Mātrāḥ</h3>
      <p>
        When any vowel other than <em>a</em> follows a consonant, you do not write the full vowel letter (the{' '}
        <em>svara</em> from Lesson 1). You write its <strong>mātrā</strong>, a vowel sign attached to the consonant.
        The full vowel letters are used only at the start of a word or after another vowel, as in{' '}
        <Pair deva="इति" iast="iti" /> or <Pair deva="ऋषिः" iast="ṛṣiḥ" />.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">svara</th>
              <th scope="col">mātrā</th>
              <th scope="col">with क</th>
              <th scope="col">position</th>
            </tr>
          </thead>
          <tbody>
            {matraRows.map(([svara, iast, sign, withKa, withKaIast, position]) => (
              <tr key={iast}>
                <td><Sound deva={svara} iast={iast} /></td>
                <td>{sign ? <span className="sound-deva" lang="sa">{sign}</span> : 'none'}</td>
                <td><Sound deva={withKa} iast={withKaIast} /></td>
                <td>{position === 'left' ? <strong>left</strong> : position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="callout">
        <strong>The i-mātrā is written first but read last.</strong> In <Pair deva="कि" iast="ki" /> the hook stands
        to the left of क, but you still say <em>k</em> and then <em>i</em>. This is the only mātrā that sits before its
        consonant.
      </p>
      <p>
        The <strong>anusvāra</strong> and <strong>visarga</strong> from Lesson 1 sit on top of this system. They come
        after the vowel, so they attach to the whole akṣara: <Pair deva="कं" iast="kaṃ" />,{' '}
        <Pair deva="किं" iast="kiṃ" />, <Pair deva="कः" iast="kaḥ" />, <Pair deva="कोः" iast="koḥ" />.
      </p>

      <h4>Irregular shapes</h4>
      <p>A few consonants change shape when a mātrā is added. These are worth memorizing on their own.</p>
      <AksaraGrid cells={irregular} />

      <h4>Try it: every mātrā on one consonant</h4>
      <MatraExplorer />

      <h3>Saṃyuktākṣarāṇi</h3>
      <p>
        <strong>Saṃyuktākṣara</strong> comes from <em>saṃyukta</em> ("joined") + <em>akṣara</em>. It is a conjunct
        consonant: two or more consonants with no vowel between them, written as one akṣara.
      </p>
      <p>Pāṇini defines the idea in one sūtra:</p>
      <p className="sutra" lang="sa">हलोऽनन्तराः संयोगः</p>
      <p>
        <em>halo 'nantarāḥ saṃyogaḥ</em> (Aṣṭādhyāyī 1.1.7): "Consonants with nothing between them are a{' '}
        <strong>saṃyoga</strong>."
      </p>
      <p>
        In principle every conjunct is just consonant + virāma + consonant. <Deva>स्</Deva> + <Deva>त</Deva> is{' '}
        <em>sta</em>. The script then fuses them into one shape, and how it fuses depends on the shapes of the letters
        involved.
      </p>

      <h4>1. Half forms: side by side</h4>
      <p>
        Most consonants end in a vertical stroke on the right, called the <strong>daṇḍa</strong>. When such a
        consonant comes first in a cluster, it drops its daṇḍa and joins the next letter from the left.
      </p>
      <AksaraGrid cells={halfForms} />
      <p>
        <Deva>क</Deva> and <Deva>फ</Deva> have their stroke in the middle rather than on the right, so their half forms
        cut off the right-hand hook instead.
      </p>

      <h4>2. Stacked forms: one above the other</h4>
      <p>
        Consonants with no daṇḍa have no stroke to drop: <Deva>ङ छ ट ठ ड ढ द ह</Deva>. When one of these comes first,
        the second consonant is usually written <strong>underneath</strong> it.
      </p>
      <AksaraGrid cells={stacked} />
      <p>
        This is where the nasal assimilation from Lesson 1 shows up in writing. <Pair deva="शङ्करः" iast="śaṅkaraḥ" />{' '}
        contains the stacked <Deva>ङ्क</Deva>, and <Pair deva="पञ्च" iast="pañca" /> contains the half form{' '}
        <Deva>ञ्च</Deva>.
      </p>

      <h4>3. Special ligatures</h4>
      <p>Some clusters take a shape that does not look like either letter. Learn these as whole units.</p>
      <AksaraGrid cells={ligatures} />
      <p>
        <Deva>क्ष</Deva> and <Deva>ज्ञ</Deva> are so common that many charts list them after <Deva>ह</Deva> as if they
        were letters of their own. They are not. <Deva>क्ष</Deva> is always <em>k</em> + <em>ṣ</em>, and{' '}
        <Deva>ज्ञ</Deva> is always <em>j</em> + <em>ñ</em>. The pronunciation of <Deva>ज्ञ</Deva> varies by region
        (you will hear <em>gnya</em> and <em>dnya</em>), but the spelling does not.
      </p>

      <h4>4. The two forms of र</h4>
      <p><Deva>र</Deva> changes shape depending on where it sits in the cluster.</p>
      <p>
        <strong>र after a consonant</strong> becomes a short slanted stroke at the foot of that consonant. Under a
        stemless letter it becomes a small caret.
      </p>
      <AksaraGrid cells={raAfter} />
      <p>
        <strong>र before a consonant</strong> becomes the <strong>repha</strong>, a small hook drawn on top of the
        akṣara at its right end. It is written last but pronounced first.
      </p>
      <AksaraGrid cells={repha} />
      <p>
        Examples: <Pair deva="धर्मः" iast="dharmaḥ" />, <Pair deva="सूर्यः" iast="sūryaḥ" />,{' '}
        <Pair deva="अर्थः" iast="arthaḥ" />. Because the repha moves to the end of the akṣara, it rides over any ā or
        ī sign too: <Pair deva="वार्ता" iast="vārtā" />.
      </p>

      <h4>5. Three or more consonants</h4>
      <p>
        The same rules apply one step at a time, left to right. Each consonant except the last takes its joining form.
      </p>
      <AksaraGrid cells={threeOrMore} />

      <h4>6. When there is no ligature</h4>
      <p>
        Not every pair has a fused form, and different fonts fuse different pairs. When a font has no shape for a
        cluster, it falls back to writing the first consonant with a visible virāma. Both spellings are the same
        letters and are read the same way.
      </p>
      <div className="table-scroll">
        <table>
          <tbody>
            <tr>
              <th scope="row">fused</th>
              {noLigature.map(([deva, iast]) => (
                <td key={iast}><span className="sound-deva" lang="sa">{deva}</span></td>
              ))}
            </tr>
            <tr>
              <th scope="row">with virāma</th>
              {noLigature.map(([deva, iast]) => (
                <td key={iast}>
                  <span className="sound-deva" lang="sa">{deva.replace(VIRAMA, VIRAMA + ZWNJ)}</span>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">reading</th>
              {noLigature.map(([, iast]) => (
                <td key={iast}><em>{iast}</em></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        If you meet a shape you do not recognize, break it into its parts: find the last full consonant (that one
        carries the vowel), and read everything before it as half forms, stacked letters, or a repha.
      </p>

      <h3>Conjuncts with mātrāḥ</h3>
      <p>
        A mātrā belongs to the whole akṣara, but it is pronounced after the <strong>last</strong> consonant. Only the
        final consonant carries a vowel. Every consonant before it is vowelless.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">akṣara</th>
              <th scope="col">parts</th>
              <th scope="col">in a word</th>
            </tr>
          </thead>
          <tbody>
            {conjunctMatras.map(([deva, iast, parts, vowel, word, wordIast, meaning]) => (
              <tr key={iast}>
                <td><Sound deva={deva} iast={iast} /></td>
                <td>{parts} + <strong>{vowel}</strong></td>
                <td><Sound deva={word} iast={wordIast} /> "{meaning}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="callout">
        <strong>Two things are drawn out of spoken order.</strong> The i-mātrā <Deva>ि</Deva> goes to the left of the{' '}
        <em>entire</em> cluster, so in <Deva>क्ति</Deva> it stands before the क even though you say it after the त.
        The repha is drawn at the far right, even though you say <em>r</em> first. Everything else reads left to right,
        top to bottom.
      </p>

      <h4>Try it: build an akṣara</h4>
      <AksaraBuilder />

      <h3>Syllables and weight</h3>
      <p>
        The script and the syllable do not divide a word in the same place. The script puts every consonant of a
        cluster with the <em>following</em> vowel. Spoken syllables split the cluster between the two vowels.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">word</th>
              <th scope="col">akṣaras (written)</th>
              <th scope="col">syllables (spoken)</th>
            </tr>
          </thead>
          <tbody>
            {syllables.map(([word, aksaras, aksarasIast, spoken]) => (
              <tr key={word}>
                <td><span className="sound-deva" lang="sa">{word}</span></td>
                <td><Sound deva={aksaras} iast={aksarasIast} /></td>
                <td><em>{spoken}</em></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        This matters for meter. A hrasva vowel is normally <strong>laghu</strong> (light): <em>hrasvaṃ laghu</em>{' '}
        (1.4.10). But a hrasva vowel followed by a saṃyoga becomes <strong>guru</strong> (heavy):
      </p>
      <p className="sutra" lang="sa">संयोगे गुरु</p>
      <p>
        <em>saṃyoge guru</em> (Aṣṭādhyāyī 1.4.11). So the <em>dha</em> of <em>dharmaḥ</em> is short by vowel length
        but heavy by weight, because the <em>r</em> closes its syllable. Dīrgha vowels are always guru (
        <em>dīrghaṃ ca</em>, 1.4.12).
      </p>
      <p>
        Doubled consonants are real conjuncts and must be held for both beats: <Pair deva="उत्तमः" iast="uttamaḥ" />{' '}
        is <em>ut-ta-maḥ</em>, not <em>u-ta-maḥ</em>.
      </p>

      <h3>Reading practice</h3>
      <p>Try to read each word, then open it to check the breakdown.</p>
      <div className="reading-practice">
        {practice.map(([word, iast, aksaras, breakdown]) => (
          <details key={word}>
            <summary>
              <span className="sound-deva" lang="sa">{word}</span>
            </summary>
            <p><em>{iast}</em></p>
            <p className="reading-split" lang="sa">
              {aksaras.map((aksara, i) => (
                <span key={i}>{aksara}</span>
              ))}
            </p>
            <p>{breakdown}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
