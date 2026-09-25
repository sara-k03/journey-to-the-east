// Buttons for IAST characters that aren't on a standard keyboard.
const KEYS = ['ā', 'ī', 'ū', 'ṛ', 'ṝ', 'ḷ', 'ḹ', 'ṅ', 'ñ', 'ṭ', 'ḍ', 'ṇ', 'ś', 'ṣ', 'ḻ', 'ṃ', 'ḥ']

export default function IastKeys({ onKey, disabled }) {
  return (
    <div className="iast-keys" role="group" aria-label="IAST characters">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className="iast-key"
          disabled={disabled}
          // Keep focus (and the caret position) in the answer box.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onKey(key)}
        >
          {key}
        </button>
      ))}
    </div>
  )
}
