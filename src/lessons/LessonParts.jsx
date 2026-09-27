// Building blocks shared by the lessons.

// A sound shown as Devanagari (or another script, per `lang`) with its IAST underneath.
export function Sound({ deva, iast, lang = 'sa' }) {
  return (
    <span className="sound">
      <span className="sound-deva" lang={lang}>{deva}</span>
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
