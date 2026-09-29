// Which questions the player has answered correctly (without help), per level,
// saved in the player's browser as { [levelId]: [itemId, ...] }.
const KEY = 'jtte-progress'

export function getMastered(levelId) {
  const ids = readKey(KEY)[levelId]
  return new Set(Array.isArray(ids) ? ids : [])
}

export function saveMastered(levelId, mastered) {
  writeKey(KEY, levelId, [...mastered])
}

// Best game-mode score per level, saved as { [levelId]: number }.
const HIGH_SCORE_KEY = 'jtte-high-scores'

export function getHighScore(levelId) {
  const score = readKey(HIGH_SCORE_KEY)[levelId]
  return Number.isFinite(score) ? score : 0
}

export function saveHighScore(levelId, score) {
  writeKey(HIGH_SCORE_KEY, levelId, score)
}

// Levels whose lesson the player has already closed once, saved as { [levelId]: true }.
const LESSONS_SEEN_KEY = 'jtte-lessons-seen'

export function hasSeenLesson(levelId) {
  return readKey(LESSONS_SEEN_KEY)[levelId] === true
}

export function markLessonSeen(levelId) {
  writeKey(LESSONS_SEEN_KEY, levelId, true)
}

// Wipes mastered questions, high scores and seen lessons for every level.
export function resetAllProgress() {
  try {
    for (const key of [KEY, HIGH_SCORE_KEY, LESSONS_SEEN_KEY]) localStorage.removeItem(key)
  } catch {
    // Storage unavailable — nothing was saved to reset.
  }
}

// Wipes mastered questions, high score and seen lesson for one level.
export function resetLevelProgress(levelId) {
  for (const key of [KEY, HIGH_SCORE_KEY, LESSONS_SEEN_KEY]) {
    try {
      const all = readKey(key)
      delete all[levelId]
      localStorage.setItem(key, JSON.stringify(all))
    } catch {
      // Storage unavailable — nothing was saved to reset.
    }
  }
}

function readKey(key) {
  try {
    const all = JSON.parse(localStorage.getItem(key))
    return all && typeof all === 'object' ? all : {}
  } catch {
    return {}
  }
}

function writeKey(key, levelId, value) {
  try {
    const all = readKey(key)
    all[levelId] = value
    localStorage.setItem(key, JSON.stringify(all))
  } catch {
    // Storage unavailable (private mode, blocked site data) — progress just won't persist.
  }
}

export function percentComplete(count, total) {
  if (!total) return 0
  // Floor so the bar only reads 100% once every question is done.
  return Math.floor((Math.min(count, total) / total) * 100)
}
