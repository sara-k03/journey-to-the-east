// Telugu bonus level 1 lesson: charts of achulu, hallulu, guninthalu with vatthulu, and ankelu.
import { achulu, ankelu, gurthulu, hallulu, halluluRows, vatthulu, withGurthu, withVatthu } from '../data/godavari.js'
import { Sound } from './LessonParts.jsx'

const Telugu = ({ pair: [letter, sound] }) => <Sound deva={letter} iast={sound} lang="te" />

function Grid({ rows }) {
  return (
    <div className="table-scroll">
      <table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((pair) => (
                <td key={pair[1]}><Telugu pair={pair} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function GodavariLesson() {
  return (
    <div className="lesson-content">
      <h3>Achulu</h3>
      <Grid rows={[achulu.slice(0, 8), achulu.slice(8)]} />

      <h3>Hallulu</h3>
      <Grid rows={halluluRows} />

      <h3>Guninthalu &amp; Vatthulu</h3>
      <div className="table-scroll gunintham-chart">
        <table>
          <thead>
            <tr>
              <th scope="col" />
              {gurthulu.map(([sign, name]) => (
                <th scope="col" key={name}>
                  <Sound deva={sign ? `◌${sign}` : '✓'} iast={name} lang="te" />
                </th>
              ))}
              {vatthulu.map((pair) => (
                <th scope="col" key={pair[0]}>
                  <Sound deva={`◌${pair[0]}`} iast={pair[1]} lang="te" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hallulu.map((hallu) => (
              <tr key={hallu[1]}>
                <th scope="row"><Telugu pair={hallu} /></th>
                {gurthulu.map((gurthu) => (
                  <td key={gurthu[1]}><Telugu pair={withGurthu(hallu, gurthu)} /></td>
                ))}
                {vatthulu.map((vatthu) => (
                  <td key={vatthu[0]}><Telugu pair={withVatthu(hallu, vatthu)} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Ankelu</h3>
      <Grid rows={[ankelu]} />
    </div>
  )
}
