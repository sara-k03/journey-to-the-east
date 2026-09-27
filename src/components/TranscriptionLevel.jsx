import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import IastKeys from './IastKeys.jsx'
import LessonButton from './LessonButton.jsx'
import LessonDialog from './LessonDialog.jsx'
import ProgressBar from './ProgressBar.jsx'
import { getMastered, percentComplete, saveMastered } from '../progress.js'

const normalize = (text) => text.normalize('NFC').trim().toLowerCase()

// Prefer questions the player hasn't gotten yet; never repeat the one just shown.
function pickNext(items, mastered, previousId) {
  const fresh = items.filter((item) => !mastered.has(item.id) && item.id !== previousId)
  const pool = fresh.length ? fresh : items.filter((item) => item.id !== previousId)
  return pool[Math.floor(Math.random() * pool.length)] ?? items[0]
}

// A level where the player sees Devanagari (or another script, per `lang`) and types it in IAST.
export default function TranscriptionLevel({ level, items, lesson, itemLabel = 'questions', keys, lang = 'sa' }) {
  const [mastered, setMastered] = useState(() => getMastered(level.id))
  const [current, setCurrent] = useState(() => pickNext(items, mastered, null))
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong'
  const [peeked, setPeeked] = useState(false)
  const [lessonOpen, setLessonOpen] = useState(true)
  const inputRef = useRef(null)

  const masteredCount = items.filter((item) => mastered.has(item.id)).length
  const credited = result === 'correct' && !peeked

  function openLesson() {
    setLessonOpen(true)
    // Looking at the lesson mid-question forfeits credit for that question.
    if (result === null) setPeeked(true)
  }

  function closeLesson() {
    setLessonOpen(false)
    inputRef.current?.focus()
  }

  function check() {
    if (!input.trim()) return
    const correct = normalize(input) === normalize(current.answer)
    setResult(correct ? 'correct' : 'wrong')
    if (correct && !peeked && !mastered.has(current.id)) {
      const next = new Set(mastered).add(current.id)
      setMastered(next)
      saveMastered(level.id, next)
    }
  }

  function nextQuestion() {
    setCurrent(pickNext(items, mastered, current.id))
    setInput('')
    setResult(null)
    setPeeked(false)
    inputRef.current?.focus()
  }

  function insert(char) {
    const el = inputRef.current
    const start = el?.selectionStart ?? input.length
    const end = el?.selectionEnd ?? input.length
    setInput(input.slice(0, start) + char + input.slice(end))
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(start + char.length, start + char.length)
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (result === null) check()
    else nextQuestion()
  }

  let feedback = null
  if (result === 'wrong') {
    feedback = (
      <>
        Not quite. <span className="deva-inline">{current.prompt}</span> is <strong>{current.answer}</strong>.
      </>
    )
  } else if (result === 'correct' && !credited) {
    feedback = 'Correct, but no credit since you opened the lesson.'
  } else if (result === 'correct') {
    feedback = 'Correct!'
  }

  return (
    <div className="page level-page">
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
      <p className="subtitle">{level.bonus ? 'Bonus Level' : 'Level'} {level.number} · {level.description}</p>

      <div className="level-progress">
        <ProgressBar value={percentComplete(masteredCount, items.length)} label={level.empire} />
        <p className="level-progress-count">
          {masteredCount} of {items.length} {itemLabel}
        </p>
      </div>

      <form className="quiz panel" onSubmit={handleSubmit}>
        <p className="quiz-prompt" lang={lang}>{current.prompt}</p>
        <label htmlFor="answer" className="quiz-label">Write this in IAST.</label>
        <input
          id="answer"
          ref={inputRef}
          className={`quiz-input ${result ? `is-${credited ? 'correct' : result === 'correct' ? 'uncredited' : 'wrong'}` : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          readOnly={result !== null}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <IastKeys onKey={insert} disabled={result !== null} keys={keys} />
        <p className={`quiz-feedback ${result ? `is-${result}` : ''}`} aria-live="polite">
          {feedback}
        </p>
        <button type="submit" className="quiz-submit" disabled={result === null && !input.trim()}>
          {result === null ? 'Check' : 'Next'}
        </button>
      </form>
    </div>
  )
}
