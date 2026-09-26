// Level 1 lesson: vowels, consonants, antasthāḥ, uṣmāṇaḥ, anusvāra, and visarga.
import { Deva, Sound } from './LessonParts.jsx'

const hrasva = [['अ', 'a'], ['इ', 'i'], ['उ', 'u'], ['ऋ', 'ṛ'], ['ऌ', 'ḷ']]
const dirgha = [['आ', 'ā'], ['ई', 'ī'], ['ऊ', 'ū'], ['ॠ', 'ṝ'], ['ॡ', 'ḹ']]

const sandhyaksara = [
  { length: 'hrasva sandhyakṣara', rows: [[['अ', 'a'], ['इ', 'i'], ['ए', 'e']], [['अ', 'a'], ['उ', 'u'], ['ओ', 'o']]] },
  { length: 'dīrgha sandhyakṣara', rows: [[['अ', 'a'], ['ए', 'e'], ['ऐ', 'ai']], [['अ', 'a'], ['ओ', 'o'], ['औ', 'au']]] },
]

const vargas = [
  ['Kavarga/kaṇṭhya (guttural)', [['क', 'ka'], ['ख', 'kha'], ['ग', 'ga'], ['घ', 'gha'], ['ङ', 'ṅa']]],
  ['Cavarga/tālavya (palatal)', [['च', 'ca'], ['छ', 'cha'], ['ज', 'ja'], ['झ', 'jha'], ['ञ', 'ña']]],
  ['Ṭavarga/mūrdhanya (retroflex)', [['ट', 'ṭa'], ['ठ', 'ṭha'], ['ड', 'ḍa'], ['ढ', 'ḍha'], ['ण', 'ṇa']]],
  ['Tavarga/dantya (dental)', [['त', 'ta'], ['थ', 'tha'], ['द', 'da'], ['ध', 'dha'], ['न', 'na']]],
  ['Pavarga/oṣṭhya (labial)', [['प', 'pa'], ['फ', 'pha'], ['ब', 'ba'], ['भ', 'bha'], ['म', 'ma']]],
]

const antasthah = [['य', 'ya'], ['र', 'ra'], ['ल', 'la'], ['व', 'va']]

const usmanah = [
  ['श', 'śa', 'tālavya (palatal)'],
  ['ष', 'ṣa', 'mūrdhanya (retroflex)'],
  ['स', 'sa', 'dantya (dental)'],
  ['ह', 'ha', 'kaṇṭhya (guttural)'],
]

export default function RepublicLesson() {
  return (
    <div className="lesson-content">
      <h3>Svarāḥ</h3>
      <p>
        <strong>Svarāḥ</strong> means vowels. Every vowel comes in two lengths: <strong>hrasva</strong> (short) or{' '}
        <strong>dīrgha</strong> (long).
      </p>

      <h4>Hrasva &amp; Dīrgha</h4>
      <div className="table-scroll">
        <table>
          <tbody>
            <tr>
              <th scope="row">hrasva (short)</th>
              {hrasva.map(([deva, iast]) => (
                <td key={iast}><Sound deva={deva} iast={iast} /></td>
              ))}
            </tr>
            <tr>
              <th scope="row">dīrgha (long)</th>
              {dirgha.map(([deva, iast]) => (
                <td key={iast}><Sound deva={deva} iast={iast} /></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="callout">ḷ and ḹ are rare vowels. They mostly only show up in Vedic Sanskrit. There also another letter that only shows up in Vedic Sanskrit (see below).</p>
      <div className="featured-letter">
        <Sound deva="ळ" iast="ḻa" />
      </div>
      <p>
        ḻ is an alternative form of ḍ and usually replaces ḍ when it is between two vowels. This only appears in the
        oldest form of Sanskrit, Vedic Sanskrit. However, it is still common in many South Indian languages.
      </p>

      <h4>Sandhyakṣara</h4>
      <p>
        <strong>Sandhyakṣara</strong> comes from <em>sandhi</em> + <em>akṣara</em>. <strong>Akṣara</strong> means
        "letter" or "undying" (a- "not" + kṣara "perishable/decaying"). Sandhyakṣara are the vowels formed by
        combining two other vowels.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Length</th>
              <th scope="col">Combination</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {sandhyaksara.map(({ length, rows }) =>
              rows.map(([first, second, result], i) => (
                <tr key={result[1]}>
                  {i === 0 && (
                    <th scope="row" rowSpan={rows.length}>{length}</th>
                  )}
                  <td>
                    <span className="combination">
                      <Sound deva={first[0]} iast={first[1]} /> + <Sound deva={second[0]} iast={second[1]} />
                    </span>
                  </td>
                  <td><Sound deva={result[0]} iast={result[1]} /></td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
      <p className="callout">
        All four sandhyakṣara (e, ai, o, au) are treated as dīrgha. They have no hrasva form of their own.
      </p>

      <h3>Vyañjanāḥ</h3>
      <p>
        <strong>Vyañjanāḥ</strong> means consonants. The 25 stop consonants are organized into five{' '}
        <strong>vargas</strong> (meaning "collections" or "groups"), each named after its first letter. Each column
        shares a 'manner' of articulation.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Varga (place)</th>
              <th scope="col">Unaspirated voiceless</th>
              <th scope="col">Aspirated voiceless</th>
              <th scope="col">Voiced unaspirated</th>
              <th scope="col">Voiced aspirated</th>
              <th scope="col">Nasal</th>
            </tr>
          </thead>
          <tbody>
            {vargas.map(([name, sounds]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                {sounds.map(([deva, iast]) => (
                  <td key={iast}><Sound deva={deva} iast={iast} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="callout">
        Nasal assimilation: within a word, the nasal consonant that comes right before a stop consonant is the nasal
        belonging to that stop's own varga. That's why <em>pañca</em> <Deva>पञ्च</Deva> ("five") is spelled with{' '}
        <strong>ñ</strong> <Deva>ञ</Deva> (the cavarga nasal) before <strong>c</strong> <Deva>च</Deva> (also cavarga),
        rather than with a plain <em>n</em> <Deva>न</Deva>.
      </p>

      <h3>Antasthāḥ, Anusvāra, and Visarga</h3>

      <h4>Antasthāḥ</h4>
      <p>
        <strong>Antasthāḥ</strong> literally means "inner-standing." They are considered to be inbetween consonants and
        vowels.
      </p>
      <div className="table-scroll">
        <table>
          <tbody>
            <tr>
              {antasthah.map(([deva, iast]) => (
                <td key={iast}><Sound deva={deva} iast={iast} /></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h4>Uṣmāṇaḥ</h4>
      <p>
        <strong>Uṣmāṇaḥ</strong> are called sibilants because they make a hissing sound.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {usmanah.map(([deva, iast]) => (
                <th scope="col" key={iast}><Sound deva={deva} iast={iast} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {usmanah.map(([, iast, place]) => (
                <td key={iast} className="cell-label">{place}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h4>Anusvāra</h4>
      <p>
        The <strong>anusvāra</strong> <Deva>ं</Deva> (ṃ) is a nasal sound that can take the form of any of
        the five varga nasals (nasal → <em>anunāsika</em>), depending on the consonant that follows it.
      </p>
      <p className="callout">
        Example: <em>śaṃkaraḥ</em> <Deva>शंकरः</Deva> (with anusvāra) becomes <strong>śaṅkaraḥ</strong>{' '}
        <Deva>शङ्करः</Deva>. The ṃ is realized as ṅa <Deva>ङ</Deva> because ka <Deva>क</Deva> (a kavarga consonant)
        follows it.
      </p>

      <h4>Visarga</h4>
      <p>
        The <strong>visarga</strong> <Deva>ः</Deva> (ḥ) appears at the end of a word and adds a breathy
        emphasis on the last vowel.
      </p>
    </div>
  )
}
