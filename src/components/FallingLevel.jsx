import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import IastKeys from './IastKeys.jsx'
import LessonButton from './LessonButton.jsx'
import LessonDialog from './LessonDialog.jsx'
import ProgressBar from './ProgressBar.jsx'
import {
  getHighScore,
  getMastered,
  hasSeenLesson,
  markLessonSeen,
  percentComplete,
  saveHighScore,
  saveMastered,
} from '../progress.js'

const LIVES = 3
// Game mode: the first akṣara takes START_SECONDS to fall, and each one cleared
// takes SPEEDUP seconds off the next, down to MIN_SECONDS.
const START_SECONDS = 8
const MIN_SECONDS = 3
const SPEEDUP = 0.1
const PRACTICE_SPEEDS = [
  { id: 'slow', label: 'Slow', seconds: 10 },
  { id: 'medium', label: 'Medium', seconds: 6 },
  { id: 'fast', label: 'Fast', seconds: 3.5 },
]
// How long the cleared flash and the missed answer stay up before the next akṣara.
const CLEARED_MS = 450
const MISSED_MS = 1800

const normalize = (text) => text.normalize('NFC').trim().toLowerCase()

// Prefer items not in `avoid`; never repeat the one just shown.
function pickNext(pool, avoid, previousId) {
  const fresh = pool.filter((item) => !avoid.has(item.id) && item.id !== previousId)
  const rest = fresh.length ? fresh : pool.filter((item) => item.id !== previousId)
  return rest[Math.floor(Math.random() * rest.length)] ?? pool[0]
}

// A level where akṣaras fall one at a time and the player types each in IAST before it hits the ground.
// Game mode has lives, speeds up, and earns progress; practice mode has none of those.
// Items: { id, prompt, answer, group, category }. Progress counts forms; a group is complete
// once every one of its forms is mastered.
export default function FallingLevel({ level, items, categories, lesson }) {
  const [mastered, setMastered] = useState(() => getMastered(level.id))
  const [highScore, setHighScore] = useState(() => getHighScore(level.id))
  const [lessonOpen, setLessonOpen] = useState(() => !hasSeenLesson(level.id))

  const [screen, setScreen] = useState('menu') // 'menu' | 'play' | 'over'
  const [mode, setMode] = useState('game') // 'game' | 'practice'
  const [category, setCategory] = useState(categories[0].id)
  const [speed, setSpeed] = useState('medium')

  const [drop, setDrop] = useState(null) // { item, x } for the akṣara on screen
  const [status, setStatus] = useState(null) // null while falling | 'cleared' | 'missed'
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [input, setInput] = useState('')
  const [peeked, setPeeked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [newHighScore, setNewHighScore] = useState(false)

  const fieldRef = useRef(null)
  const aksaraRef = useRef(null)
  const inputRef = useRef(null)
  const fallRef = useRef(0) // 0 = top of the field, 1 = resting on the ground line
  const timeoutRef = useRef(null)
  const missRef = useRef(null)

  const groups = useMemo(() => {
    const byGroup = {}
    for (const item of items) (byGroup[item.group] ??= []).push(item.id)
    return Object.values(byGroup)
  }, [items])

  const pool = useMemo(
    () => (mode === 'game' || category === 'all' ? items : items.filter((item) => item.category === category)),
    [items, mode, category],
  )

  const masteredCount = items.filter((item) => mastered.has(item.id)).length
  const groupsComplete = groups.filter((ids) => ids.every((id) => mastered.has(id))).length
  const seconds =
    mode === 'game'
      ? Math.max(MIN_SECONDS, START_SECONDS - SPEEDUP * score)
      : PRACTICE_SPEEDS.find((option) => option.id === speed).seconds
  const secondsRef = useRef(seconds)
  secondsRef.current = seconds
  const running = screen === 'play' && drop !== null && status === null && !lessonOpen

  function later(ms, callback) {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(callback, ms)
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  // Moves the akṣara to match fallRef without re-rendering.
  function place() {
    const field = fieldRef.current
    const el = aksaraRef.current
    if (!field || !el) return
    el.style.transform = `translate(-50%, ${fallRef.current * (field.clientHeight - el.offsetHeight)}px)`
  }

  // Also re-place on a miss, since showing the answer makes the akṣara taller.
  useLayoutEffect(place, [drop, status])

  useEffect(() => {
    if (!running) return
    let frame
    let last = performance.now()
    const tick = (now) => {
      // Cap each step so returning to a background tab doesn't drop the akṣara all at once.
      const dt = Math.min(now - last, 100)
      last = now
      fallRef.current = Math.min(1, fallRef.current + dt / (secondsRef.current * 1000))
      place()
      if (fallRef.current >= 1) missRef.current()
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])

  // The first akṣara of a run; later ones come from nextAksara.
  useEffect(() => {
    if (screen === 'play' && drop === null) nextAksara(mastered, null)
  }, [screen, drop])

  function nextAksara(masteredNow, previousId) {
    // Game mode steers toward forms the player hasn't mastered yet.
    const avoid = mode === 'game' ? masteredNow : new Set()
    fallRef.current = 0
    setDrop({ item: pickNext(pool, avoid, previousId), x: 30 + Math.random() * 40 })
    setStatus(null)
    setInput('')
    setPeeked(false)
    setRevealed(false)
    inputRef.current?.focus()
  }

  function start(nextMode) {
    clearTimeout(timeoutRef.current)
    setMode(nextMode)
    setScore(0)
    setLives(LIVES)
    setNewHighScore(false)
    setDrop(null)
    setStatus(null)
    setScreen('play')
  }

  function endRun() {
    clearTimeout(timeoutRef.current)
    if (mode === 'game' && score > highScore) {
      setHighScore(score)
      saveHighScore(level.id, score)
      setNewHighScore(true)
    }
    setDrop(null)
    setStatus(null)
    setScreen(mode === 'game' ? 'over' : 'menu')
  }

  function clearAksara() {
    const { item } = drop
    let masteredNow = mastered
    if (mode === 'game' && !peeked && !mastered.has(item.id)) {
      masteredNow = new Set(mastered).add(item.id)
      setMastered(masteredNow)
      saveMastered(level.id, masteredNow)
    }
    setScore(score + 1)
    setStatus('cleared')
    later(CLEARED_MS, () => nextAksara(masteredNow, item.id))
  }

  missRef.current = function miss() {
    const livesLeft = mode === 'game' ? lives - 1 : lives
    setLives(livesLeft)
    setStatus('missed')
    later(MISSED_MS, livesLeft > 0 ? () => nextAksara(mastered, drop.item.id) : endRun)
  }

  function handleChange(value) {
    setInput(value)
    if (status === null && drop && normalize(value) === drop.item.answer) clearAksara()
  }

  function insert(char) {
    const el = inputRef.current
    const from = el?.selectionStart ?? input.length
    const to = el?.selectionEnd ?? input.length
    handleChange(input.slice(0, from) + char + input.slice(to))
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(from + char.length, from + char.length)
    })
  }

  function openLesson() {
    setLessonOpen(true)
    // Looking at the lesson mid-fall forfeits progress credit for that akṣara (it still scores).
    if (screen === 'play' && mode === 'game' && status === null) setPeeked(true)
  }

  function closeLesson() {
    setLessonOpen(false)
    markLessonSeen(level.id)
    inputRef.current?.focus()
  }

  let feedback = null
  if (status === 'missed') {
    feedback = (
      <>
        Missed. <span className="deva-inline">{drop.item.prompt}</span> is <strong>{drop.item.answer}</strong>.
      </>
    )
  } else if (status === 'cleared' && peeked) {
    feedback = 'Cleared, but no progress credit since you opened the lesson.'
  } else if (status === 'cleared') {
    feedback = 'Correct!'
  }

  return (
    <div className="page level-page falling-page">
      {level.background && (
        <div
          className={`level-background${level.darkenBackground ? ' is-darkened' : ''}`}
          style={{ backgroundImage: `url(${level.background})` }}
          aria-hidden="true"
        />
      )}
      <LessonButton onClick={openLesson} />
      <LessonDialog open={lessonOpen} onClose={closeLesson} title={`Lesson · ${level.description}`}>
        {lesson}
      </LessonDialog>

      <Link to="/" className="back-link">← All levels</Link>
      <h1 className="title">{level.empire}</h1>
      <p className="subtitle">Level {level.number} · {level.description}</p>

      {screen !== 'play' && (
        <div className="level-progress">
          <ProgressBar value={percentComplete(masteredCount, items.length)} label={level.empire} />
          <p className="level-progress-count">
            {masteredCount} of {items.length} forms · {groupsComplete} of {groups.length} groups complete
          </p>
        </div>
      )}

      {screen === 'menu' && (
        <div className="falling-menu">
          <section className="panel mode-card">
            <h2>Game</h2>
            <p>
              You have {LIVES} lives, and the akṣaras fall faster as you go. Only game mode counts toward progress.
            </p>
            <p className="mode-stat">
              High score: <strong>{highScore}</strong>
            </p>
            <button type="button" className="quiz-submit" onClick={() => start('game')}>
              Start game
            </button>
          </section>
          <section className="panel mode-card">
            <h2>Practice</h2>
            <p>No lives and no progress. Pick what falls and how fast.</p>
            <label className="mode-field">
              Akṣaras
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </label>
            <label className="mode-field">
              Speed
              <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
                {PRACTICE_SPEEDS.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </label>
            <button type="button" className="quiz-submit" onClick={() => start('practice')}>
              Start practice
            </button>
          </section>
        </div>
      )}

      {screen === 'play' && (
        <div className="falling-play">
          <div className="falling-hud">
            <span>
              Score <strong>{score}</strong>
            </span>
            {mode === 'game' ? (
              <span className="falling-lives" aria-label={`${lives} of ${LIVES} lives left`}>
                {Array.from({ length: LIVES }, (_, i) => (
                  <span key={i} className={i < lives ? 'is-full' : ''} aria-hidden="true">♥</span>
                ))}
              </span>
            ) : (
              <span>Practice</span>
            )}
            <button type="button" className="falling-end" onClick={endRun}>
              {mode === 'game' ? 'End run' : 'Stop'}
            </button>
          </div>

          <div className="falling-field panel" ref={fieldRef}>
            {drop && (
              <div
                ref={aksaraRef}
                className={`falling-aksara${status ? ` is-${status}` : ''}`}
                style={{ left: `${drop.x}%` }}
              >
                <span lang="sa">{drop.item.prompt}</span>
                {(revealed || status === 'missed') && <span className="falling-answer">{drop.item.answer}</span>}
              </div>
            )}
          </div>

          <form className="quiz falling-controls" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="answer" className="quiz-label">Write the falling akṣara in IAST.</label>
            <input
              id="answer"
              ref={inputRef}
              className="quiz-input"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className={`quiz-feedback ${status === 'cleared' ? 'is-correct' : status === 'missed' ? 'is-wrong' : ''}`} aria-live="polite">
              {feedback}
            </p>
            <IastKeys onKey={insert} disabled={status !== null} />
            {mode === 'practice' && (
              <button
                type="button"
                className="falling-reveal"
                disabled={revealed || status !== null}
                onClick={() => setRevealed(true)}
              >
                Reveal answer
              </button>
            )}
          </form>
        </div>
      )}

      {screen === 'over' && (
        <section className="panel falling-over">
          <h2>{lives === 0 ? 'Out of lives' : 'Run ended'}</h2>
          <p className="falling-final">{score}</p>
          <p>{score === 1 ? 'akṣara' : 'akṣaras'} cleared</p>
          <p className="mode-stat">{newHighScore ? 'New high score!' : `High score: ${highScore}`}</p>
          <div className="falling-over-actions">
            <button type="button" className="quiz-submit" onClick={() => start('game')}>
              Play again
            </button>
            <button type="button" className="falling-end" onClick={() => setScreen('menu')}>
              Back to menu
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
