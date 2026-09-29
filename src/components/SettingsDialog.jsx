import { useState } from 'react'
import LessonDialog from './LessonDialog.jsx'
import { bonusLevels, levels } from '../levels.js'
import { resetAllProgress, resetLevelProgress } from '../progress.js'

// Only playable levels can have progress to reset.
const playableLevels = [...levels, ...bonusLevels].filter((level) => level.path)

// Settings pop-up. For now it only holds reset-progress options.
export default function SettingsDialog({ open, onClose, onReset }) {
  const [confirming, setConfirming] = useState(null) // id of the option awaiting confirmation
  const [status, setStatus] = useState('')

  function close() {
    setConfirming(null)
    setStatus('')
    onClose()
  }

  function reset(id, name) {
    if (id === 'all') resetAllProgress()
    else resetLevelProgress(id)
    setConfirming(null)
    setStatus(id === 'all' ? 'All progress has been reset.' : `${name} progress has been reset.`)
    onReset()
  }

  function resetOption({ id, name, description, sub }) {
    return (
      <li key={id} className={`settings-option${sub ? ' is-sub' : ''}`}>
        <div>
          <strong>{name}</strong>
          {description && <p>{description}</p>}
        </div>
        {confirming === id ? (
          <div className="settings-actions">
            <button type="button" className="settings-action is-danger" onClick={() => reset(id, name)}>
              Yes, reset
            </button>
            <button type="button" className="settings-action" onClick={() => setConfirming(null)}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="settings-action is-danger"
            aria-label={sub ? `Reset ${name}` : undefined}
            onClick={() => {
              setConfirming(id)
              setStatus('')
            }}
          >
            Reset
          </button>
        )}
      </li>
    )
  }

  return (
    <LessonDialog open={open} onClose={close} title="Settings">
      <div className="lesson-content">
        <h3>Reset progress</h3>
        <ul className="settings-list">
          {resetOption({
            id: 'all',
            name: 'Reset all progress',
            description: 'Clears progress, high scores and seen lessons for every level.',
          })}
          {playableLevels.map((level) => (
            resetOption({
              id: level.id,
              name: level.empire,
              description: `${level.bonus ? 'Bonus Level' : 'Level'} ${level.number} · ${level.description}`,
              sub: true,
            })
          ))}
        </ul>
        <p className="settings-status" aria-live="polite">
          {status}
        </p>
      </div>
    </LessonDialog>
  )
}
