import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bonusLevels, levels } from '../levels.js'
import { getMastered, percentComplete } from '../progress.js'
import ProgressBar from '../components/ProgressBar.jsx'
import LessonButton from '../components/LessonButton.jsx'
import LessonDialog from '../components/LessonDialog.jsx'
import SettingsButton from '../components/SettingsButton.jsx'
import SettingsDialog from '../components/SettingsDialog.jsx'

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
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // Bumped after a reset so the progress bars re-read storage.
  const [progressVersion, setProgressVersion] = useState(0)

  return (
    <div className="page home">
      <SettingsButton onClick={() => setSettingsOpen(true)} />
      <LessonButton label="How to Play" onClick={() => setHowToPlayOpen(true)} />
      <LessonDialog open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} title="How to Play">
        <div className="lesson-content">
          <p>TBA</p>
        </div>
      </LessonDialog>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={() => setProgressVersion((v) => v + 1)}
      />
      <header className="hero">
        <h1 className="title">Journey to the East</h1>
      </header>
      <main key={progressVersion}>
        <ol className="levels">
          {levels.map((level) => (
            <LevelButton key={level.id} level={level} />
          ))}
        </ol>
        <h2 className="levels-heading">Telugu Bonus Levels</h2>
        <ol className="levels">
          {bonusLevels.map((level) => (
            <LevelButton key={level.id} level={level} />
          ))}
        </ol>
      </main>
    </div>
  )
}
