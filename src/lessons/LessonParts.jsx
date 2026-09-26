// Building blocks shared by the lessons.

// A sound shown as Devanagari with its IAST underneath.
export function Sound({ deva, iast }) {
  return (
    <span className="sound">
      <span className="sound-deva" lang="sa">{deva}</span>
      <span className="sound-iast">{iast}</span>
    </span>
  )
}

// Devanagari set apart as a chip inside a sentence, so it reads clearly at text size.
export function Deva({ children }) {
  return (
    <span className="deva-chip" lang="sa">
      {children}
    </span>
  )
}
