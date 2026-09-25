import { Link } from 'react-router-dom'
import { levels } from '../levels.js'
import { getMastered, percentComplete } from '../progress.js'
import ProgressBar from '../components/ProgressBar.jsx'

function LevelButton({ level }) {
  const available = Boolean(level.path)
  const content = (
    <>
      <span className="level-number">{level.number}</span>
      <span className="level-text">
        <span className="level-empire">{level.empire}</span>
        <span className="level-description">
          {available ? level.description : 'Coming soon'}
        </span>
      </span>
    </>
  )

  return (
    <li className="level">
      {available ? (
        <Link to={level.path} className="level-button">
          {content}
        </Link>
      ) : (
        <span className="level-button is-locked" aria-disabled="true">
          {content}
        </span>
      )}
      <ProgressBar value={percentComplete(getMastered(level.id).size, level.total)} label={level.empire} />
    </li>
  )
}

export default function Home() {
  return (
    <div className="page home">
      <header className="hero">
        <h1 className="title">Journey to the East</h1>
        <p className="subtitle">Can you make it to Meluhha?</p>
      </header>
      <main>
        <ol className="levels">
          {levels.map((level) => (
            <LevelButton key={level.id} level={level} />
          ))}
        </ol>
      </main>
    </div>
  )
}
