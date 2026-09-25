// Which questions the player has answered correctly (without help), per level,
// saved in the player's browser as { [levelId]: [itemId, ...] }.
const KEY = 'jtte-progress'

function readAll() {
  try {
    const all = JSON.parse(localStorage.getItem(KEY))
    return all && typeof all === 'object' ? all : {}
  } catch {
    return {}
  }
}

export function getMastered(levelId) {
  const ids = readAll()[levelId]
  return new Set(Array.isArray(ids) ? ids : [])
}

export function saveMastered(levelId, mastered) {
  try {
    const all = readAll()
    all[levelId] = [...mastered]
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // Storage unavailable (private mode, blocked site data) — progress just won't persist.
  }
}

export function percentComplete(count, total) {
  if (!total) return 0
  // Floor so the bar only reads 100% once every question is done.
  return Math.floor((Math.min(count, total) / total) * 100)
}
